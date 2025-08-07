'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface SavedGame {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  score?: string;
  gameDetails?: string;
  sourceUrl?: string;
  sourceName?: string;
  rating?: number;
  whoWith?: string;
  personalMemories?: string;
  savedAt: string;
}

interface GameList {
  id: string;
  name: string;
  description?: string;
  gameIds: string[];
  createdAt: string;
  isPublished: boolean;
}

export default function ProfilePage() {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [gameLists, setGameLists] = useState<GameList[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [showCreateList, setShowCreateList] = useState(false);
  const [showAddToExisting, setShowAddToExisting] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedExistingListId, setSelectedExistingListId] = useState('');

  useEffect(() => {
    // Load saved games from localStorage
    const games = JSON.parse(localStorage.getItem('restub_games') || '[]');
    setSavedGames(games);

    // Load game lists from localStorage
    const lists = JSON.parse(localStorage.getItem('restub_lists') || '[]');
    setGameLists(lists);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Mock login - in real app, would handle authentication
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedGames(new Set());
  };

  const toggleGameSelection = (gameId: string) => {
    const newSelected = new Set(selectedGames);
    if (newSelected.has(gameId)) {
      newSelected.delete(gameId);
    } else {
      newSelected.add(gameId);
    }
    setSelectedGames(newSelected);
  };

  const createNewList = () => {
    if (!newListName.trim()) return;

    const newList: GameList = {
      id: `list-${Date.now()}`,
      name: newListName.trim(),
      description: newListDescription.trim() || undefined,
      gameIds: Array.from(selectedGames),
      createdAt: new Date().toISOString(),
      isPublished: false
    };

    const updatedLists = [newList, ...gameLists];
    setGameLists(updatedLists);
    localStorage.setItem('restub_lists', JSON.stringify(updatedLists));

    // Reset form
    setNewListName('');
    setNewListDescription('');
    setSelectedGames(new Set());
    setShowCreateList(false);
  };

  const addToExistingList = () => {
    if (!selectedExistingListId) return;

    const updatedLists = gameLists.map(list => {
      if (list.id === selectedExistingListId) {
        // Add selected games to existing list, avoiding duplicates
        const existingGameIds = new Set(list.gameIds);
        const newGameIds = Array.from(selectedGames).filter(gameId => !existingGameIds.has(gameId));
        return {
          ...list,
          gameIds: [...list.gameIds, ...newGameIds]
        };
      }
      return list;
    });

    setGameLists(updatedLists);
    localStorage.setItem('restub_lists', JSON.stringify(updatedLists));

    // Reset form
    setSelectedGames(new Set());
    setSelectedExistingListId('');
    setShowAddToExisting(false);
  };

  const publishList = (listId: string) => {
    const updatedLists = gameLists.map(list => 
      list.id === listId ? { ...list, isPublished: true } : list
    );
    setGameLists(updatedLists);
    localStorage.setItem('restub_lists', JSON.stringify(updatedLists));
  };

  const moveGameInList = (listId: string, gameId: string, direction: 'up' | 'down') => {
    const updatedLists = gameLists.map(list => {
      if (list.id === listId) {
        const gameIds = [...list.gameIds];
        const currentIndex = gameIds.indexOf(gameId);
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex >= 0 && newIndex < gameIds.length) {
          [gameIds[currentIndex], gameIds[newIndex]] = [gameIds[newIndex], gameIds[currentIndex]];
        }
        
        return { ...list, gameIds };
      }
      return list;
    });
    
    setGameLists(updatedLists);
    localStorage.setItem('restub_lists', JSON.stringify(updatedLists));
  };

  const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-xs text-slate-500 ml-1">
          {rating > 0 ? `${rating}/5` : ''}
        </span>
      </div>
    );
  };

  const getGameById = (gameId: string) => {
    return savedGames.find(game => game.id === gameId);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Your Sports Profile</h1>
                  <p className="text-slate-600">Manage your games and create custom lists</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  Account Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">{savedGames.length}</div>
              <div className="text-slate-600">Games Logged</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">{gameLists.length}</div>
              <div className="text-slate-600">Lists Created</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {gameLists.filter(list => list.isPublished).length}
              </div>
              <div className="text-slate-600">Published Lists</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {savedGames.filter(game => game.rating && game.rating >= 4).length}
              </div>
              <div className="text-slate-600">4+ Star Games</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link 
              href="/catalog"
              className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Log New Game
            </Link>
            
            {selectedGames.size === 0 ? (
              // Show "Create New List" when no games selected
              <button 
                onClick={() => setShowCreateList(true)}
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Create New List
              </button>
            ) : (
              // Show both options when games are selected
              <>
                <button 
                  onClick={() => setShowCreateList(true)}
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to New List ({selectedGames.size})
                </button>
                
                {gameLists.length > 0 && (
                  <button 
                    onClick={() => setShowAddToExisting(true)}
                    className="bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Add to Existing List ({selectedGames.size})
                  </button>
                )}
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Saved Games */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Saved Games</h2>
                
                {savedGames.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Games Yet</h3>
                    <p className="text-slate-500 mb-4">Start by logging your first game experience!</p>
                    <Link 
                      href="/catalog"
                      className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors inline-block"
                    >
                      Log Your First Game
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedGames.map((game) => (
                      <div 
                        key={game.id}
                        className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                          selectedGames.has(game.id) 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => toggleGameSelection(game.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <h3 className="font-bold text-slate-800">
                                {game.awayTeam} @ {game.homeTeam}
                              </h3>
                              <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-600 uppercase">
                                {game.league}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                              <span>{new Date(game.date).toLocaleDateString()}</span>
                              <span>{game.venue}</span>
                              {game.score && <span className="font-semibold">{game.score}</span>}
                            </div>
                            
                            {game.rating && <StarRating rating={game.rating} />}
                            
                            {game.whoWith && (
                              <p className="text-sm text-slate-600 mt-2">With: {game.whoWith}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {selectedGames.has(game.id) && (
                              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Game Lists */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Lists</h2>
                
                {gameLists.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">No Lists Yet</h3>
                    <p className="text-xs text-slate-500">Select games to create your first list!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gameLists.map((list) => (
                      <div key={list.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-slate-800">{list.name}</h3>
                            {list.description && (
                              <p className="text-sm text-slate-600">{list.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {list.isPublished ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                Published
                              </span>
                            ) : (
                              <button
                                onClick={() => publishList(list.id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                              >
                                Publish
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {list.gameIds.map((gameId, index) => {
                            const game = getGameById(gameId);
                            if (!game) return null;
                            
                            return (
                              <div key={gameId} className="flex items-center justify-between bg-slate-50 rounded-lg p-2">
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-slate-800">
                                    {index + 1}. {game.awayTeam} @ {game.homeTeam}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => moveGameInList(list.id, gameId, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => moveGameInList(list.id, gameId, 'down')}
                                    disabled={index === list.gameIds.length - 1}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create List Modal */}
        {showCreateList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Create New List</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    List Name *
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g., Favorite Bears Games"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="What makes this list special?"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    Games to include ({selectedGames.size}):
                  </p>
                  <div className="space-y-1">
                    {Array.from(selectedGames).map(gameId => {
                      const game = getGameById(gameId);
                      return game ? (
                        <div key={gameId} className="text-sm text-blue-700">
                          • {game.awayTeam} @ {game.homeTeam}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={createNewList}
                  disabled={!newListName.trim()}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Create List
                </button>
                <button
                  onClick={() => setShowCreateList(false)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}