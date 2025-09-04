'use client';

import { searchGame, addExperience } from './actions';
import { getAllTeamsForDropdown } from './teams';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../components/Icon';
import type { GameSearchResult } from './actions';

type Step = 'form' | 'review' | 'results';

const AddExperienceForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [showForm, setShowForm] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [homeTeamSelection, setHomeTeamSelection] = useState('');
  const [awayTeamSelection, setAwayTeamSelection] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [searchResults, setSearchResults] = useState<GameSearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [dateType, setDateType] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setFormData(data);
    setCurrentStep('review');
  };

  const handleGameSearch = async () => {
    if (!formData) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const results = await searchGame(formData);
      setSearchResults(results);
      setCurrentStep('results');
    } catch {
      setSearchError('Failed to search for games. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectGame = (game: GameSearchResult) => {
    setSelectedGameId(game.id);
  };

  const handleAddToMyList = async () => {
    if (!formData || !selectedGameId || !searchResults) return;
    
    const selectedGame = searchResults.find(game => game.id === selectedGameId);
    if (!selectedGame) return;
    
    // Add selected game info to form data
    formData.set('selectedGameId', selectedGame.id);
    formData.set('finalDate', selectedGame.date);
    formData.set('finalVenue', selectedGame.venue);
    formData.set('finalScore', selectedGame.score || '');
    
    // Save to localStorage temporarily
    const savedGames = JSON.parse(localStorage.getItem('restub_games') || '[]');
    const gameToSave = {
      id: crypto.randomUUID(), // Always generate unique ID for each saved game
      league: formData.get('league'),
      homeTeam: formData.get('homeTeam') === 'custom' ? formData.get('customHomeTeam') : formData.get('homeTeam'),
      awayTeam: formData.get('awayTeam') === 'custom' ? formData.get('customAwayTeam') : formData.get('awayTeam'),
      date: selectedGame.date,
      venue: selectedGame.venue,
      score: selectedGame.score,
      description: selectedGame.description,
      gameDetails: formData.get('gameDetails'),
      sourceUrl: selectedGame.sourceUrl,
      sourceName: selectedGame.sourceName,
      savedAt: new Date().toISOString()
    };
    
    savedGames.unshift(gameToSave);
    localStorage.setItem('restub_games', JSON.stringify(savedGames));
    
    // Also save to the existing experience system
    await addExperience(formData);
    
    // Trigger event for same-page updates
    window.dispatchEvent(new Event('restub-game-added'));
    
    // Redirect to profile page to see the saved game
    router.push('/profile');
  };

  const resetForm = () => {
    setCurrentStep('form');
    setShowForm(false);
    setFormData(null);
    setSearchResults(null);
    setSearchError(null);
    setSelectedLeague('');
    setHomeTeamSelection('');
    setAwayTeamSelection('');
    setSelectedGameId(null);
    setDateType('');
  };

  const getFormValue = (name: string): string => {
    return formData?.get(name)?.toString() || '';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {!showForm ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <Icon name="sparkles" className="text-orange-600 dark:text-orange-400" size="sm" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">AI-Powered Game Detection</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Tell us what you
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400">
                  remember
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Our AI will search through millions of games to find your exact match. Just provide what details you can recall.
              </p>
              
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Icon name="sparkles" size="sm" />
                Start Adding Game
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 'form' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'form' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  1
                </div>
                <span className={`text-sm font-medium ${currentStep === 'form' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Enter Details
                </span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 'review' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  2
                </div>
                <span className={`text-sm font-medium ${currentStep === 'review' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Review
                </span>
              </div>
              
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep === 'results' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'results' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                  3
                </div>
                <span className={`text-sm font-medium ${currentStep === 'results' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Select Match
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Form Section */}
      {showForm && currentStep === 'form' && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* League Selection */}
                <div>
                  <label htmlFor="league" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    League *
                  </label>
                  <select 
                    id="league"
                    name="league"
                    value={selectedLeague}
                    onChange={(e) => {
                      setSelectedLeague(e.target.value);
                      setHomeTeamSelection('');
                      setAwayTeamSelection('');
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    required
                    aria-required="true"
                  >
                    <option value="">Select a league</option>
                    <option value="nfl">NFL (Football)</option>
                    <option value="nba">NBA (Basketball)</option>
                    <option value="mlb">MLB (Baseball)</option>
                    <option value="nhl">NHL (Hockey)</option>
                    <option value="mls">MLS (Soccer)</option>
                    <option value="ncaa">NCAA</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Teams Selection */}
                {selectedLeague && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="homeTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Home Team
                      </label>
                      <select 
                        id="homeTeam"
                        name="homeTeam"
                        value={homeTeamSelection}
                        onChange={(e) => setHomeTeamSelection(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        aria-label="Select home team"
                      >
                        {getAllTeamsForDropdown(selectedLeague).map(team => (
                          <option key={team.value} value={team.value}>{team.label}</option>
                        ))}
                      </select>
                      {homeTeamSelection === 'custom' && (
                        <input 
                          type="text"
                          name="customHomeTeam"
                          placeholder="Enter team name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 mt-2"
                          aria-label="Custom home team name"
                        />
                      )}
                    </div>

                    <div>
                      <label htmlFor="awayTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Away Team
                      </label>
                      <select 
                        id="awayTeam"
                        name="awayTeam"
                        value={awayTeamSelection}
                        onChange={(e) => setAwayTeamSelection(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        aria-label="Select away team"
                      >
                        {getAllTeamsForDropdown(selectedLeague).map(team => (
                          <option key={team.value} value={team.value}>{team.label}</option>
                        ))}
                      </select>
                      {awayTeamSelection === 'custom' && (
                        <input 
                          type="text"
                          name="customAwayTeam"
                          placeholder="Enter team name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 mt-2"
                          aria-label="Custom away team name"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Date Selection */}
                <div>
                  <label htmlFor="dateType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    When was this game?
                  </label>
                  <select 
                    id="dateType"
                    name="dateType"
                    value={dateType}
                    onChange={(e) => setDateType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    aria-label="Select date type"
                  >
                    <option value="">How well do you remember?</option>
                    <option value="exact">I know the exact date</option>
                    <option value="month">I remember the month and year</option>
                    <option value="year">I only remember the year</option>
                    <option value="range">Sometime between certain years</option>
                  </select>

                  {/* Date inputs based on selection */}
                  {dateType === 'exact' && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label htmlFor="exactDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Game Date
                      </label>
                      <input 
                        id="exactDate"
                        type="date"
                        name="exactDate"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        aria-label="Exact game date"
                      />
                    </div>
                  )}

                  {dateType === 'month' && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Month
                        </label>
                        <select 
                          id="month"
                          name="month"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select month</option>
                          <option value="1">January</option>
                          <option value="2">February</option>
                          <option value="3">March</option>
                          <option value="4">April</option>
                          <option value="5">May</option>
                          <option value="6">June</option>
                          <option value="7">July</option>
                          <option value="8">August</option>
                          <option value="9">September</option>
                          <option value="10">October</option>
                          <option value="11">November</option>
                          <option value="12">December</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Year
                        </label>
                        <input 
                          id="year"
                          type="number"
                          name="year"
                          min="1900"
                          max="2030"
                          placeholder="YYYY"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}

                  {dateType === 'year' && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <label htmlFor="yearOnly" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year
                      </label>
                      <input 
                        id="yearOnly"
                        type="number"
                        name="yearOnly"
                        min="1900"
                        max="2030"
                        placeholder="YYYY"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        aria-label="Game year"
                      />
                    </div>
                  )}

                  {dateType === 'range' && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fromYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          From Year
                        </label>
                        <input 
                          id="fromYear"
                          type="number"
                          name="fromYear"
                          min="1900"
                          max="2030"
                          placeholder="YYYY"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label htmlFor="toYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          To Year
                        </label>
                        <input 
                          id="toYear"
                          type="number"
                          name="toYear"
                          min="1900"
                          max="2030"
                          placeholder="YYYY"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Venue (Optional)
                    </label>
                    <input 
                      id="venue"
                      type="text"
                      name="venue"
                      placeholder="e.g., Madison Square Garden"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      aria-label="Game venue"
                    />
                  </div>

                  <div>
                    <label htmlFor="score" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Score (Optional)
                    </label>
                    <input 
                      id="score"
                      type="text"
                      name="score"
                      placeholder="e.g., 110-95 or 3-2"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      aria-label="Game score"
                    />
                  </div>
                </div>

                {/* Game Details */}
                <div>
                  <label htmlFor="gameDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea 
                    id="gameDetails"
                    name="gameDetails"
                    rows={3}
                    placeholder="Any other details you remember about the game..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                    aria-label="Additional game details"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Review Section */}
      {currentStep === 'review' && formData && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Review Your Information</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">League</span>
                  <span className="font-medium text-gray-900 dark:text-white">{getFormValue('league').toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Home Team</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getFormValue('homeTeam') === 'custom' ? getFormValue('customHomeTeam') : getFormValue('homeTeam')}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">Away Team</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getFormValue('awayTeam') === 'custom' ? getFormValue('customAwayTeam') : getFormValue('awayTeam')}
                  </span>
                </div>
                {getFormValue('venue') && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Venue</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getFormValue('venue')}</span>
                  </div>
                )}
                {getFormValue('score') && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Score</span>
                    <span className="font-medium text-gray-900 dark:text-white">{getFormValue('score')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGameSearch}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size="sm" />
                      Search Games
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-700 dark:text-red-300">{searchError}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {currentStep === 'results' && searchResults && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">We found {searchResults.length} matching games</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Select the game that matches your memory</p>
              
              <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
                {searchResults.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedGameId === game.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {game.awayTeam} @ {game.homeTeam}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {game.date} • {game.venue}
                        </p>
                        {game.score && (
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                            Final: {game.score}
                          </p>
                        )}
                        {game.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {game.description}
                          </p>
                        )}
                      </div>
                      {selectedGameId === game.id && (
                        <Icon name="check" className="text-orange-600 flex-shrink-0 ml-4" size="md" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('review')}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleAddToMyList}
                  disabled={!selectedGameId}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="check" size="sm" />
                  Add to My Games
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AddExperienceForm;