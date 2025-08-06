'use client';

import { searchGame, addExperience } from './actions';
import { getAllTeamsForDropdown } from './teams';
import { useState } from 'react';
import Link from 'next/link';

import type { GameSearchResult } from './actions';

type Step = 'form' | 'review' | 'results';

const AddExperienceForm = () => {
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
    } catch (error) {
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
      id: selectedGame.id,
      league: formData.get('league'),
      homeTeam: formData.get('homeTeam') === 'custom' ? formData.get('customHomeTeam') : formData.get('homeTeam'),
      awayTeam: formData.get('awayTeam') === 'custom' ? formData.get('customAwayTeam') : formData.get('awayTeam'),
      date: selectedGame.date,
      venue: selectedGame.venue,
      score: selectedGame.score,
      gameDetails: formData.get('gameDetails'),
      sourceUrl: selectedGame.sourceUrl,
      sourceName: selectedGame.sourceName,
      savedAt: new Date().toISOString()
    };
    
    savedGames.unshift(gameToSave);
    localStorage.setItem('restub_games', JSON.stringify(savedGames));
    
    // Also save to the existing experience system
    await addExperience(formData);
    
    // Reset the form and hide search results
    resetForm();
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
  };

  const getFormValue = (name: string): string => {
    return formData?.get(name)?.toString() || '';
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-100 py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-orange-600">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-slate-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-slate-800">
              Track Your
            </span>
            <br />
            <span className="text-orange-600">
              Sports Games
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Never forget that incredible game you witnessed! Track NFL, NBA, MLB, and NHL games - 
            capture every detail and build your sports legacy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <button 
              className="group relative bg-orange-600 border-2 border-orange-700 text-white font-bold py-5 px-12 rounded-3xl text-xl transition-all duration-300 hover:bg-orange-700 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
              onClick={() => alert('Ticket scanning coming soon!')}
            >
              <span className="relative z-10 flex items-center justify-center">
                Scan Ticket
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button 
              className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 text-orange-700 hover:text-orange-800 font-bold py-5 px-12 rounded-3xl text-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-orange-50"
              onClick={() => setShowForm(true)}
            >
              <span className="flex items-center justify-center">
                <svg className="mr-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Game Manually
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      {showForm && currentStep === 'form' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-3xl p-10 shadow-2xl border-4 border-orange-300">
              <h2 className="text-4xl font-bold text-center mb-10 text-slate-800">
                Add Your Game
              </h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* League Selection */}
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-3">
                    League *
                  </label>
                  <select 
                    name="league"
                    value={selectedLeague}
                    onChange={(e) => {
                      setSelectedLeague(e.target.value);
                      setHomeTeamSelection('');
                      setAwayTeamSelection('');
                    }}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg font-medium"
                    required
                  >
                    <option value="">Choose the league</option>
                    <option value="nfl">NFL</option>
                    <option value="nba">NBA</option>
                    <option value="mlb">MLB</option>
                    <option value="nhl">NHL</option>
                  </select>
                </div>

                {/* Teams Selection */}
                {selectedLeague && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-lg font-bold text-slate-700 mb-3">
                        Home Team
                      </label>
                      <select 
                        name="homeTeam"
                        value={homeTeamSelection}
                        onChange={(e) => setHomeTeamSelection(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg font-medium"
                      >
                        {getAllTeamsForDropdown(selectedLeague).map(team => (
                          <option key={team.value} value={team.value}>{team.label}</option>
                        ))}
                      </select>
                      {homeTeamSelection === 'custom' && (
                        <input 
                          type="text"
                          name="customHomeTeam"
                          placeholder="Type the home team name..."
                          className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg placeholder-slate-400 font-medium mt-3"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-slate-700 mb-3">
                        Away Team
                      </label>
                      <select 
                        name="awayTeam"
                        value={awayTeamSelection}
                        onChange={(e) => setAwayTeamSelection(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg font-medium"
                      >
                        {getAllTeamsForDropdown(selectedLeague).map(team => (
                          <option key={team.value} value={team.value}>{team.label}</option>
                        ))}
                      </select>
                      {awayTeamSelection === 'custom' && (
                        <input 
                          type="text"
                          name="customAwayTeam"
                          placeholder="Type the away team name..."
                          className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg placeholder-slate-400 font-medium mt-3"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Game Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">
                      When Was This Game? 
                    </label>
                    
                    {/* Date Type Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-600 mb-2">How well do you remember the date?</label>
                      <select 
                        name="dateType"
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg font-medium"
                        onChange={(e) => {
                          // We'll handle this with state if needed
                          const sections = document.querySelectorAll('[data-date-section]');
                          sections.forEach(section => section.style.display = 'none');
                          const targetSection = document.querySelector(`[data-date-section="${e.target.value}"]`);
                          if (targetSection) targetSection.style.display = 'block';
                        }}
                      >
                        <option value="">Choose how you remember it...</option>
                        <option value="exact">I know the exact date</option>
                        <option value="approximate">I remember the month/season and year</option>
                        <option value="range">It was sometime between certain years</option>
                        <option value="context">I remember other details (day of week, season, etc.)</option>
                      </select>
                    </div>

                    {/* Exact Date Section */}
                    <div data-date-section="exact" style={{display: 'none'}} className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">📅 Exact Date</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <select name="month" className="px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 bg-white">
                          <option value="">Month</option>
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
                        <input 
                          type="number" name="day" min="1" max="31" placeholder="Day"
                          className="px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 bg-white"
                        />
                        <input 
                          type="number" name="exactYear" min="1990" max="2030" placeholder="Year"
                          className="px-3 py-2 rounded-lg border border-green-300 focus:ring-2 focus:ring-green-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Approximate Date Section */}
                    <div data-date-section="approximate" style={{display: 'none'}} className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3">📆 Month/Season & Year</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <select name="approxTimeframe" className="px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white">
                          <option value="">When during the year?</option>
                          <option value="january">January</option>
                          <option value="february">February</option>
                          <option value="march">March</option>
                          <option value="april">April</option>
                          <option value="may">May</option>
                          <option value="june">June</option>
                          <option value="july">July</option>
                          <option value="august">August</option>
                          <option value="september">September</option>
                          <option value="october">October</option>
                          <option value="november">November</option>
                          <option value="december">December</option>
                          <option value="spring">Spring (Mar-May)</option>
                          <option value="summer">Summer (Jun-Aug)</option>
                          <option value="fall">Fall (Sep-Nov)</option>
                          <option value="winter">Winter (Dec-Feb)</option>
                          <option value="preseason">Preseason</option>
                          <option value="regular">Regular Season</option>
                          <option value="playoffs">Playoffs</option>
                        </select>
                        <input 
                          type="number" name="approxYear" min="1990" max="2030" placeholder="What year?"
                          className="px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    {/* Year Range Section */}
                    <div data-date-section="range" style={{display: 'none'}} className="mb-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3">🎯 Year Range</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-purple-700 mb-1">Earliest year</label>
                          <input 
                            type="number" name="fromYear" min="1990" max="2030" placeholder="e.g., 2019"
                            className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-purple-700 mb-1">Latest year</label>
                          <input 
                            type="number" name="toYear" min="1990" max="2030" placeholder="e.g., 2022"
                            className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Context Clues Section */}
                    <div data-date-section="context" style={{display: 'none'}} className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-3">🧩 Context Clues</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <select name="dayOfWeek" className="px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white">
                            <option value="">Day of the week?</option>
                            <option value="sunday">Sunday</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                            <option value="saturday">Saturday</option>
                          </select>
                          <select name="timeOfDay" className="px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white">
                            <option value="">Time of day?</option>
                            <option value="morning">Morning game</option>
                            <option value="afternoon">Afternoon game</option>
                            <option value="evening">Evening game</option>
                            <option value="night">Night game</option>
                            <option value="primetime">Prime time</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="number" name="contextYearStart" min="1990" max="2030" placeholder="Earliest possible year"
                            className="px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white"
                          />
                          <input 
                            type="number" name="contextYearEnd" min="1990" max="2030" placeholder="Latest possible year"
                            className="px-3 py-2 rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 mt-3">
                      💡 <strong>Tip:</strong> The more details you remember, the better we can find your game!
                    </p>
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-slate-700 mb-3">
                      Venue
                    </label>
                    <input 
                      type="text"
                      name="venue"
                      placeholder="Stadium, arena, or city..."
                      className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80 text-lg placeholder-slate-400 font-medium"
                    />
                    <p className="text-sm text-slate-500 mt-1">Example: &quot;Yankee Stadium&quot; or &quot;somewhere in Chicago&quot;</p>
                  </div>
                </div>

                {/* Game Identification Details */}
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-3">
                    Help Us Identify This Game
                  </label>
                  <textarea 
                    name="gameDetails"
                    rows={5}
                    placeholder="What details do you remember that could help identify this specific game? Final score, notable plays, playoff game, opening day, weather conditions, anything unique about this particular game..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 resize-none bg-white/80 text-lg placeholder-slate-400 font-medium"
                  />
                  <p className="text-sm text-slate-500 mt-2">This helps us find the exact game you attended. Personal memories will be added later!</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center gap-6 pt-6">
                  <button 
                    type="submit"
                    className="bg-orange-600 border-2 border-orange-700 text-white font-bold py-5 px-16 rounded-3xl text-xl transition-all duration-300 hover:bg-orange-700 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                  >
                    Review & Find Game
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-5 px-16 rounded-3xl text-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Review Section */}
      {showForm && currentStep === 'review' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 rounded-3xl p-10 shadow-2xl border-4 border-blue-300">
              <h2 className="text-4xl font-bold text-center mb-10 text-slate-800">
                Review Your Information
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-3">Game Details</h3>
                    <div className="space-y-2 text-slate-600">
                      <p><span className="font-semibold">League:</span> {getFormValue('league').toUpperCase()}</p>
                      <p><span className="font-semibold">Home Team:</span> {getFormValue('homeTeam') === 'custom' ? getFormValue('customHomeTeam') : getFormValue('homeTeam')}</p>
                      <p><span className="font-semibold">Away Team:</span> {getFormValue('awayTeam') === 'custom' ? getFormValue('customAwayTeam') : getFormValue('awayTeam')}</p>
                      <p><span className="font-semibold">Venue:</span> {getFormValue('venue') || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-700 mb-3">Date Information</h3>
                    <div className="space-y-2 text-slate-600">
                      {getFormValue('exactYear') ? (
                        <p>
                          <span className="font-semibold">Specific Date:</span> 
                          {getFormValue('month') && getFormValue('day') && getFormValue('exactYear') ? 
                            ` ${getFormValue('month')}/${getFormValue('day')}/${getFormValue('exactYear')}` :
                            getFormValue('month') ? 
                              ` ${getFormValue('month')}/${getFormValue('exactYear')}` :
                              ` ${getFormValue('exactYear')}`
                          }
                        </p>
                      ) : (
                        <p>
                          <span className="font-semibold">Date Range:</span> 
                          {getFormValue('fromYear')} - {getFormValue('toYear')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-700 mb-3">Game Identification Details</h3>
                  <p className="text-slate-600">{getFormValue('gameDetails') || 'No additional details provided'}</p>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <button 
                  onClick={handleGameSearch}
                  disabled={isSearching}
                  className="bg-blue-600 border-2 border-blue-700 text-white font-bold py-5 px-16 rounded-3xl text-xl transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Look Up Game'}
                </button>
                <button 
                  onClick={() => setCurrentStep('form')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-5 px-16 rounded-3xl text-xl transition-all duration-300 hover:scale-105"
                >
                  Back to Edit
                </button>
                <button 
                  onClick={resetForm}
                  className="bg-red-200 hover:bg-red-300 text-red-700 font-bold py-5 px-16 rounded-3xl text-xl transition-all duration-300 hover:scale-105"
                >
                  Cancel
                </button>
              </div>

              {searchError && (
                <div className="mt-6 p-4 bg-red-100 rounded-xl text-red-700 text-center">
                  {searchError}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showForm && currentStep === 'results' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-50 rounded-3xl p-10 shadow-2xl border-4 border-green-300">
              <h2 className="text-4xl font-bold text-center mb-10 text-slate-800">
                Game Search Results
              </h2>
              
              {searchResults && searchResults.length > 0 ? (
                <div className="space-y-6 mb-10">
                  <p className="text-center text-slate-600 mb-8">
                    We found {searchResults.length} possible match{searchResults.length > 1 ? 'es' : ''} for your game. Click on the correct one:
                  </p>
                  
                  <div className="grid gap-6">
                    {searchResults.map((game) => (
                      <div 
                        key={game.id}
                        onClick={() => handleSelectGame(game)}
                        className={`bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${
                          selectedGameId === game.id 
                            ? 'border-green-500 bg-green-50 shadow-lg' 
                            : 'border-transparent hover:border-green-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-slate-800">
                                {game.awayTeam} @ {game.homeTeam}
                              </h3>
                              {game.sourceUrl && (
                                <a 
                                  href={game.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  {game.sourceName || 'Source'}
                                </a>
                              )}
                            </div>
                            <p className="text-slate-600 mb-2">
                              <span className="font-semibold">Date:</span> {game.date}
                            </p>
                            <p className="text-slate-600 mb-2">
                              <span className="font-semibold">Venue:</span> {game.venue}
                            </p>
                            {game.score && (
                              <p className="text-slate-600 mb-2">
                                <span className="font-semibold">Score:</span> {game.score}
                              </p>
                            )}
                            <p className="text-slate-600 text-sm">{game.description}</p>
                            
                            {selectedGameId === game.id && (
                              <div className="mt-4 flex items-center text-green-700">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                <span className="font-semibold">Selected - This is your game!</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              game.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                              game.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(game.confidence * 100)}% match
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center mb-10">
                  <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 border-4 border-yellow-300 rounded-2xl flex items-center justify-center">
                    <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4">
                    Couldn't Find a Match
                  </h3>
                  <p className="text-xl text-slate-600">
                    We need more information to identify this game. Try adding more specific details like the final score, notable plays, or weather conditions.
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-4">
                {selectedGameId && (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleAddToMyList}
                      className="bg-green-600 border-2 border-green-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-all duration-300 hover:bg-green-700 hover:scale-105 flex items-center gap-2 justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Game to My List
                    </button>
                    <Link 
                      href="/profile"
                      className="text-blue-600 hover:text-blue-800 text-center font-medium transition-colors"
                    >
                      View My Profile & Lists →
                    </Link>
                  </div>
                )}
                <button 
                  onClick={() => setCurrentStep('form')}
                  className="bg-orange-600 border-2 border-orange-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-all duration-300 hover:bg-orange-700 hover:scale-105"
                >
                  Add More Details
                </button>
                <button 
                  onClick={resetForm}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-12 rounded-2xl text-lg transition-all duration-300 hover:scale-105"
                >
                  Start Over
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