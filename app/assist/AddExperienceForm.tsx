'use client';

import { searchGame, addExperience } from './actions';
import { getAllTeamsForDropdown } from './teams';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../components/Icon';
import type { GameSearchResult } from './actions';

type Step = 'form' | 'review' | 'results';

const loadingMessages = [
  { time: 0, message: "Searching through game archives..." },
  { time: 3000, message: "Scanning historical records..." },
  { time: 5000, message: "Checking scores and statistics..." },
  { time: 7000, message: "Cross-referencing venue information..." },
  { time: 9000, message: "Verifying game details..." },
  { time: 11000, message: "Almost there! Finalizing your results..." },
  { time: 13000, message: "Just a moment more..." },
  { time: 15000, message: "Nearly done, preparing your matches..." }
];

const AddExperienceForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [showForm, setShowForm] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [homeTeamSelection, setHomeTeamSelection] = useState('');
  const [awayTeamSelection, setAwayTeamSelection] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [searchResults, setSearchResults] = useState<GameSearchResult[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [dateType, setDateType] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempEditValue, setTempEditValue] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  // Handle dynamic loading messages
  useEffect(() => {
    if (!isSearching) {
      setLoadingMessage(loadingMessages[0]);
      setLoadingProgress(0);
      return;
    }

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Slower progression over 15 seconds, with slowdown near the end
      let progress;
      if (elapsed < 12000) {
        // First 12 seconds: linear progression to 80%
        progress = (elapsed / 12000) * 80;
      } else if (elapsed < 14000) {
        // Next 2 seconds: slow from 80% to 90%
        progress = 80 + ((elapsed - 12000) / 2000) * 10;
      } else {
        // Final second+: very slow from 90% to 95%
        progress = 90 + Math.min((elapsed - 14000) / 1000 * 5, 5);
      }
      setLoadingProgress(Math.min(progress, 95));
    }, 50);

    const messageTimeouts: NodeJS.Timeout[] = [];
    
    loadingMessages.forEach((msg) => {
      if (msg.time > 0) {
        const timeout = setTimeout(() => {
          if (isSearching) {
            setLoadingMessage(msg);
          }
        }, msg.time);
        messageTimeouts.push(timeout);
      }
    });

    return () => {
      clearInterval(progressInterval);
      messageTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isSearching]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    
    // Check if at least some information was provided
    const hasLeague = data.get('league');
    const hasHomeTeam = data.get('homeTeam');
    const hasAwayTeam = data.get('awayTeam');
    const hasVenue = data.get('venue');
    const hasScore = data.get('score');
    const hasDetails = data.get('gameDetails');
    const hasDate = data.get('dateType') && data.get('dateType') !== '';
    
    if (!hasLeague && !hasHomeTeam && !hasAwayTeam && !hasVenue && 
        !hasScore && !hasDetails && !hasDate) {
      // Show a friendly prompt to enter at least something
      setSearchError('Please enter at least one detail about the game to help us search.');
      return;
    }
    
    setSearchError(null);
    setFormData(data);
    setCurrentStep('review');
    // Scroll to top when moving to review
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGameSearch = async () => {
    if (!formData) return;
    
    setIsSearching(true);
    setSearchError(null);
    setLoadingProgress(0);
    
    try {
      const results = await searchGame(formData);
      setLoadingProgress(100);
      // Small delay to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 300));
      setSearchResults(results);
      setCurrentStep('results');
      // Scroll to top when showing results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSearchError('Failed to search for games. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectGame = (game: GameSearchResult) => {
    setSelectedGameId(game.id);
  };

  const toggleDescriptionExpanded = (gameId: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(gameId)) {
      newExpanded.delete(gameId);
    } else {
      newExpanded.add(gameId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const getConfidenceLabel = (confidence: number): { label: string; color: string } => {
    if (confidence >= 0.9) return { label: 'Very Likely', color: 'text-green-600 dark:text-green-400' };
    if (confidence >= 0.7) return { label: 'Likely', color: 'text-blue-600 dark:text-blue-400' };
    if (confidence >= 0.5) return { label: 'Possible', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Unlikely', color: 'text-gray-600 dark:text-gray-400' };
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
      // Use the actual teams from the selected game (from API), fallback to form if needed
      homeTeam: selectedGame.homeTeam || (formData.get('homeTeam') === 'custom' ? formData.get('customHomeTeam') : formData.get('homeTeam')),
      awayTeam: selectedGame.awayTeam || (formData.get('awayTeam') === 'custom' ? formData.get('customAwayTeam') : formData.get('awayTeam')),
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

  const handleDeleteField = (fieldName: string) => {
    if (formData) {
      const newFormData = new FormData();
      const fieldsToDelete = [fieldName];
      
      // Handle related fields
      if (fieldName === 'homeTeam') fieldsToDelete.push('customHomeTeam');
      if (fieldName === 'awayTeam') fieldsToDelete.push('customAwayTeam');
      if (fieldName === 'dateType') {
        fieldsToDelete.push('exactDate', 'month', 'year', 'yearOnly', 'fromYear', 'toYear');
      }
      
      for (const [key, value] of Array.from(formData.entries())) {
        if (!fieldsToDelete.includes(key)) {
          newFormData.append(key, value);
        }
      }
      setFormData(newFormData);
    }
  };

  const handleEditField = (fieldName: string, newValue: string) => {
    if (formData) {
      const newFormData = new FormData();
      for (const [key, value] of Array.from(formData.entries())) {
        if (key === fieldName) {
          newFormData.append(key, newValue);
        } else {
          newFormData.append(key, value);
        }
      }
      setFormData(newFormData);
      setEditingField(null);
      setTempEditValue('');
    }
  };

  const startEditing = (fieldName: string, currentValue: string) => {
    setEditingField(fieldName);
    setTempEditValue(currentValue);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white/50 dark:bg-gray-800/50 py-8 sm:py-12">
        <div className="px-4 sm:px-6 lg:max-w-4xl lg:mx-auto text-center">
          {!showForm ? (
            <div className="py-4">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Icon name="sparkles" size="sm" />
                Add New Game
              </button>
            </div>
          ) : (
            <>
            {/* Compact header with step indicators */}
            <div className="mb-6 relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Add Your Game</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tell us what you remember</p>
              {currentStep === 'form' && (
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-0 right-0 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Hide form
                </button>
              )}
            </div>
            {/* Mobile-first step indicators */}
            <div className="mb-8 -mx-4 sm:mx-0">
              <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm sm:rounded-lg p-2">
                <div className={`flex-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-3 sm:py-2 rounded-lg ${currentStep === 'form' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'form' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    1
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${currentStep === 'form' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    Details
                  </span>
                </div>
                
                <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                
                <div className={`flex-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-3 sm:py-2 rounded-lg ${currentStep === 'review' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    2
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${currentStep === 'review' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    Review
                  </span>
                </div>
                
                <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                
                <div className={`flex-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 py-3 sm:py-2 rounded-lg ${currentStep === 'results' ? 'bg-orange-100 dark:bg-orange-900/30' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'results' ? 'bg-orange-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`}>
                    3
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${currentStep === 'results' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    Match
                  </span>
                </div>
              </div>
            </div>
            </>
          )}
        </div>
      </section>

      {/* Form Section */}
      {showForm && currentStep === 'form' && (
        <section className="py-4 sm:py-8">
          <div className="px-0 sm:px-6 lg:max-w-4xl lg:mx-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm sm:rounded-3xl shadow-xl border-y sm:border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleFormSubmit} className="space-y-8 sm:space-y-10">
                {/* WHO Section - League & Teams */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-orange-50 dark:bg-orange-900/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-base sm:text-lg">1</span>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Who was playing?</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tell us what you remember</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* League Selection */}
                  <div>
                    <label htmlFor="league" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      League <span className="text-xs text-gray-500 dark:text-gray-400">(optional)</span>
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
                    aria-label="Select league"
                  >
                    <option value="">Select a league</option>
                    <option value="nfl">NFL (Football)</option>
                    <option value="nba">NBA (Basketball)</option>
                    <option value="mlb">MLB (Baseball)</option>
                    <option value="nhl">NHL (Hockey)</option>
                    <option value="ncaa">NCAA</option>
                    <option value="other">Other</option>
                  </select>
                  </div>

                  {/* Teams Selection */}
                  {selectedLeague && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                      <label htmlFor="homeTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Home Team <span className="text-xs text-gray-500 dark:text-gray-400">(optional)</span>
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
                        Away Team <span className="text-xs text-gray-500 dark:text-gray-400">(optional)</span>
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
                </div>

                {/* WHEN Section - Date */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-base sm:text-lg">2</span>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">When was it?</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Any timeframe helps</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      How well do you remember the date?
                  </label>
                  <select 
                    id="dateType"
                    name="dateType"
                    value={dateType}
                    onChange={(e) => setDateType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    aria-label="Select date type"
                  >
                    <option value="">Not sure / Skip this</option>
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
                </div>

                {/* WHERE & MORE Section - Consolidated Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-base sm:text-lg">3</span>
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Where & More</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Any detail helps</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Single Combined Details Box */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <div>
                        <label htmlFor="gameDetails" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Game Details
                          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                            (venue, score, memorable moments, etc.)
                          </span>
                        </label>
                        <textarea 
                          id="gameDetails"
                          name="gameDetails"
                          rows={5}
                          placeholder="Tell us anything you remember about this game...

• Venue: Madison Square Garden, Yankee Stadium, etc.
• Score: 110-95, 3-2 in overtime, etc.
• Details: playoff game, specific players, weather, memorable moments, etc.

The more details you provide, the better we can find your game!"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                          aria-label="Additional game details"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 px-4 sm:px-6">
                      <Icon name="lightbulb" size="sm" className="mt-0.5 text-orange-500" />
                      <p>Enter only what you remember - even a single detail helps our AI find your game!</p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {searchError && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Icon name="lightbulb" size="sm" className="text-orange-600 dark:text-orange-400 mt-0.5" />
                      <p className="text-sm text-orange-700 dark:text-orange-300">{searchError}</p>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 sm:pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all text-center shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Ready to Review
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
        <section className="py-4 sm:py-8">
          <div className="px-0 sm:px-6 lg:max-w-4xl lg:mx-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm sm:rounded-3xl shadow-xl border-y sm:border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="document" size="lg" className="text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Your Information</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                {getFormValue('league') && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 group">
                    <span className="text-gray-600 dark:text-gray-400">League</span>
                    <div className="flex items-center gap-2">
                      {editingField === 'league' ? (
                        <>
                          <select
                            value={tempEditValue}
                            onChange={(e) => setTempEditValue(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Select league</option>
                            <option value="nfl">NFL</option>
                            <option value="nba">NBA</option>
                            <option value="mlb">MLB</option>
                            <option value="nhl">NHL</option>
                          </select>
                          <button
                            onClick={() => handleEditField('league', tempEditValue)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="Save"
                          >
                            <Icon name="check" size="sm" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Cancel"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white">{getFormValue('league').toUpperCase()}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing('league', getFormValue('league'))}
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Icon name="pencil" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteField('league')}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Icon name="trash" size="sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {getFormValue('homeTeam') && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 group">
                    <span className="text-gray-600 dark:text-gray-400">Home Team</span>
                    <div className="flex items-center gap-2">
                      {editingField === 'homeTeam' ? (
                        <>
                          <input
                            type="text"
                            value={tempEditValue}
                            onChange={(e) => setTempEditValue(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => handleEditField('homeTeam', tempEditValue)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="Save"
                          >
                            <Icon name="check" size="sm" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Cancel"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getFormValue('homeTeam') === 'custom' ? getFormValue('customHomeTeam') : getFormValue('homeTeam')}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing('homeTeam', getFormValue('homeTeam') === 'custom' ? getFormValue('customHomeTeam') : getFormValue('homeTeam'))}
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Icon name="pencil" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteField('homeTeam')}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Icon name="trash" size="sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {getFormValue('awayTeam') && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 group">
                    <span className="text-gray-600 dark:text-gray-400">Away Team</span>
                    <div className="flex items-center gap-2">
                      {editingField === 'awayTeam' ? (
                        <>
                          <input
                            type="text"
                            value={tempEditValue}
                            onChange={(e) => setTempEditValue(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => handleEditField('awayTeam', tempEditValue)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="Save"
                          >
                            <Icon name="check" size="sm" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Cancel"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {getFormValue('awayTeam') === 'custom' ? getFormValue('customAwayTeam') : getFormValue('awayTeam')}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing('awayTeam', getFormValue('awayTeam') === 'custom' ? getFormValue('customAwayTeam') : getFormValue('awayTeam'))}
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Icon name="pencil" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteField('awayTeam')}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Icon name="trash" size="sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {getFormValue('gameDetails') && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 group">
                    <span className="text-gray-600 dark:text-gray-400">Details</span>
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      {editingField === 'gameDetails' ? (
                        <>
                          <textarea
                            value={tempEditValue}
                            onChange={(e) => setTempEditValue(e.target.value)}
                            className="flex-1 max-w-xs px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={2}
                          />
                          <button
                            onClick={() => handleEditField('gameDetails', tempEditValue)}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                            title="Save"
                          >
                            <Icon name="check" size="sm" />
                          </button>
                          <button
                            onClick={() => setEditingField(null)}
                            className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="Cancel"
                          >
                            <Icon name="close" size="sm" />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs">{getFormValue('gameDetails')}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEditing('gameDetails', getFormValue('gameDetails'))}
                              className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Icon name="pencil" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDeleteField('gameDetails')}
                              className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Icon name="trash" size="sm" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {getFormValue('dateType') && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 group">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getFormValue('dateType') === 'exact' && getFormValue('exactDate')}
                        {getFormValue('dateType') === 'month' && `${getFormValue('month')}/${getFormValue('year')}`}
                        {getFormValue('dateType') === 'year' && getFormValue('yearOnly')}
                        {getFormValue('dateType') === 'range' && `${getFormValue('fromYear')}-${getFormValue('toYear')}`}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDeleteField('dateType')}
                          className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Icon name="trash" size="sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Show a message if only minimal info */}
                {!getFormValue('league') && !getFormValue('homeTeam') && !getFormValue('awayTeam') && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Limited information provided - AI will do its best to find matches
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                <button
                  onClick={() => setCurrentStep('form')}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all text-center shadow-sm hover:shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={handleGameSearch}
                  disabled={isSearching}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
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

              {/* Enhanced Loading UI */}
              {isSearching && (
                <div className="mt-8 space-y-6">
                  {/* Progress Bar Container */}
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${loadingProgress}%` }}
                        >
                          {/* Animated shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Progress percentage text below bar */}
                      <div className="text-center mt-2">
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                          {Math.round(loadingProgress)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Message with pulsing dot animation */}
                  <div className="flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Animated dots loader */}
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {loadingMessage.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Context message that changes based on progress */}
                  <div className="text-center px-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {loadingProgress < 30 
                        ? "Searching across multiple sports databases..."
                        : loadingProgress < 60
                        ? "Analyzing game data and matching your criteria..."
                        : loadingProgress < 85
                        ? "Cross-referencing with historical records..."
                        : "Almost there! Preparing your results..."}
                    </p>
                  </div>
                </div>
              )}

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
        <section className="py-4 sm:py-8">
          <div className="px-0 sm:px-6 lg:max-w-6xl lg:mx-auto">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm sm:rounded-3xl shadow-xl border-y sm:border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center gap-3 mb-2">
                  <Icon name="sparkles" size="md" className="text-orange-500 mt-1 sm:mt-0" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    We found {searchResults.length} {searchResults.length === 1 ? 'game' : 'games'}
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 sm:pl-10">Select the game that matches your memory</p>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 max-h-96 overflow-y-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                {searchResults.map((game) => {
                  const confidenceInfo = getConfidenceLabel(game.confidence);
                  const isExpanded = expandedDescriptions.has(game.id);
                  
                  // Parse score to add team names if it's in "XX - XX" format
                  const formattedScore = game.score ? 
                    game.score.replace(/(\d+)\s*-\s*(\d+)/, `${game.awayTeam} $1, ${game.homeTeam} $2`) 
                    : null;
                  
                  return (
                    <div
                      key={game.id}
                      onClick={() => handleSelectGame(game)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedGameId === game.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                              {game.awayTeam} @ {game.homeTeam}
                            </h3>
                            <span className={`text-xs font-medium ${confidenceInfo.color} ml-2`}>
                              {confidenceInfo.label}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {game.date} • {game.venue}
                          </p>
                          {formattedScore && (
                            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                              Final: {formattedScore}
                            </p>
                          )}
                          {game.description && (
                            <div className="mt-2">
                              <p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                {game.description}
                              </p>
                              {game.description.length > 150 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDescriptionExpanded(game.id);
                                  }}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                >
                                  [{isExpanded ? 'less' : 'more'}]
                                </button>
                              )}
                            </div>
                          )}
                          {game.sourceUrl && (
                            <a
                              href={game.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {game.sourceName || 'View source'}
                            </a>
                          )}
                        </div>
                        {selectedGameId === game.id && (
                          <Icon name="check" className="text-orange-600 flex-shrink-0 ml-4" size="md" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
                <button
                  onClick={() => setCurrentStep('review')}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white transition-all text-center shadow-sm hover:shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={handleAddToMyList}
                  disabled={!selectedGameId}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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