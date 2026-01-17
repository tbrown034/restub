'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from '../components/Icon';
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getGames, deleteGame as deleteGameAction, getGameStats } from '../assist/actions';
import type { SavedGame } from '@/lib/types';
import { GmailImport } from '../components/GmailImport';

const getLeagueColors = (league: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; ring: string }> = {
    nfl: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-400/60 dark:border-blue-500/60',
      ring: 'hover:ring-blue-500/30'
    },
    nba: {
      bg: 'from-orange-500 to-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-400/60 dark:border-orange-500/60',
      ring: 'hover:ring-orange-500/30'
    },
    mlb: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-400/60 dark:border-green-500/60',
      ring: 'hover:ring-green-500/30'
    },
    nhl: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-400/60 dark:border-purple-500/60',
      ring: 'hover:ring-purple-500/30'
    },
    default: {
      bg: 'from-gray-500 to-gray-600',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-400/60 dark:border-gray-500/60',
      ring: 'hover:ring-gray-500/30'
    }
  };
  return colors[league.toLowerCase()] || colors.default;
};

const formatScore = (score: string | undefined, awayTeam: string, homeTeam: string) => {
  if (!score) return null;
  if (awayTeam && homeTeam) {
    return score.replace(/(\d+)\s*-\s*(\d+)/, `${awayTeam} $1, ${homeTeam} $2`);
  }
  return score;
};

interface Stats {
  total: number;
  byLeague: Record<string, number>;
  topRated: number;
}

export default function ProfilePage() {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, byLeague: {}, topRated: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [gamesResponse, statsResponse] = await Promise.all([
        getGames(),
        getGameStats()
      ]);

      if (!gamesResponse.success) {
        setError(gamesResponse.error || 'Failed to load games');
        return;
      }

      setSavedGames(gamesResponse.data || []);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch {
      setError('Failed to load games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();

    // Listen for new games added
    const handleGameAdded = () => {
      loadGames();
    };
    window.addEventListener('restub-game-added', handleGameAdded);
    return () => window.removeEventListener('restub-game-added', handleGameAdded);
  }, [loadGames]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Are you sure you want to delete this game?')) {
      return;
    }

    setDeletingId(gameId);

    try {
      const response = await deleteGameAction(gameId);

      if (!response.success) {
        setError(response.error || 'Failed to delete game');
        return;
      }

      // Update local state
      setSavedGames(prev => prev.filter(game => game.id !== gameId));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
    } catch {
      setError('Failed to delete game. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Sign In Required</h1>
            <p className="text-slate-600 mb-6">
              Please sign in to access your profile and manage your game lists.
            </p>
            <button
              onClick={handleLogin}
              className="w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors"
            >
              Sign In (Mock)
            </button>
            <Link href="/" className="block mt-4 text-slate-600 hover:text-slate-800">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Sports Profile</h1>
                  <p className="text-slate-600 dark:text-slate-400">Manage your games and create custom lists</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleLogout}
                  className="bg-slate-600 dark:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-2">
                {isLoading ? '...' : stats.total}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Games Tracked</div>
            </div>
            <div className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-2">
                {isLoading ? '...' : stats.byLeague['nfl'] || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">NFL Games</div>
            </div>
            <div className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-600 mb-2">
                {isLoading ? '...' : stats.byLeague['nba'] || 0}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">NBA Games</div>
            </div>
            <div className="group bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600 mb-2">
                {isLoading ? '...' : stats.topRated}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">Top Rated</div>
            </div>
          </div>

          {/* Action Buttons & Gmail Import */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            {/* Manual Log Button */}
            <div className="flex flex-col justify-center">
              <Link
                href="/assist"
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Log New Game
              </Link>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Manually add a game you attended
              </p>
            </div>

            {/* Gmail Import */}
            <GmailImport />
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-5xl mx-auto mb-6">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="ml-auto text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Games */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Saved Games</h2>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading your games...</p>
                </div>
              ) : savedGames.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Games Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start by logging your first game experience!</p>
                  <Link
                    href="/assist"
                    className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors inline-block"
                  >
                    Log Your First Game
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedGames.map((game) => {
                    const leagueColors = getLeagueColors(game.league);
                    const awayTeam = game.awayTeam || '';
                    const homeTeam = game.homeTeam || '';
                    const formattedScore = formatScore(game.score, awayTeam, homeTeam);
                    const isDeleting = deletingId === game.id;

                    return (
                      <div
                        key={game.id}
                        className={`
                          group relative overflow-hidden rounded-2xl
                          bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/80 dark:to-gray-900/60
                          backdrop-blur-xl backdrop-saturate-150
                          border-2 ${leagueColors.border}
                          shadow-lg hover:shadow-xl
                          transform transition-all duration-300 ease-out
                          hover:-translate-y-1
                          ${isDeleting ? 'opacity-50' : ''}
                        `}
                      >
                        {/* League Badge */}
                        <div className="absolute top-4 left-4">
                          <div className={`
                            px-3 py-1 rounded-full
                            bg-gradient-to-r ${leagueColors.bg}
                            text-white text-xs font-bold uppercase
                            shadow-md
                          `}>
                            {game.league}
                          </div>
                        </div>

                        {/* Delete Button - Top Right */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            disabled={isDeleting}
                            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-md disabled:opacity-50"
                            title="Delete Game"
                          >
                            {isDeleting ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Main Content */}
                        <div className="p-6 pt-12">
                          {/* Teams */}
                          {(awayTeam && homeTeam) && (
                            <div className="mb-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {awayTeam} @ {homeTeam}
                              </h3>
                              {formattedScore && (
                                <p className={`text-lg font-semibold mt-1 ${leagueColors.text}`}>
                                  Final: {formattedScore}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Date & Venue */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Icon name="calendar" size="sm" />
                              <span>{game.date}</span>
                            </div>
                            {game.venue && (
                              <div className="flex items-center gap-1">
                                <Icon name="pin" size="sm" />
                                <span>{game.venue}</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {game.description ? (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {game.description}
                            </p>
                          ) : game.gameDetails ? (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                Your notes: {game.gameDetails}
                              </p>
                            </div>
                          ) : null}

                          {/* Rating Display */}
                          {game.rating && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= game.rating!
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 dark:text-gray-600'
                                    }`}
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                  ({game.rating}/5)
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Source Link */}
                          {game.sourceUrl && (
                            <a
                              href={game.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {game.sourceName || 'View source'}
                            </a>
                          )}
                        </div>

                        {/* Subtle League Watermark */}
                        <div className="absolute bottom-0 right-0 opacity-5 dark:opacity-10">
                          <div className={`text-8xl font-black ${leagueColors.text} select-none blur-sm`}>
                            {game.league.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
