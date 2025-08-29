'use client';

import { searchGame, addExperience } from './actions';
import { getAllTeamsForDropdown } from './teams';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { GameSearchResult } from './actions';

type Step = 'form' | 'review' | 'results';

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
      id: selectedGame.id,
      league: formData.get('league'),
      homeTeam: formData.get('homeTeam') === 'custom' ? formData.get('customHomeTeam') : formData.get('homeTeam'),
      awayTeam: formData.get('awayTeam') === 'custom' ? formData.get('customAwayTeam') : formData.get('awayTeam'),
      date: selectedGame.date,
      venue: selectedGame.venue,
      score: selectedGame.score,
      description: selectedGame.description,  // Add description
      gameDetails: formData.get('gameDetails'),
      sourceUrl: selectedGame.sourceUrl,
      sourceName: selectedGame.sourceName,
      savedAt: new Date().toISOString()
    };
    
    savedGames.unshift(gameToSave);
    localStorage.setItem('restub_games', JSON.stringify(savedGames));
    
    // Also save to the existing experience system
    await addExperience(formData);
    
    // Redirect to profile page to see the saved game
    router.push('/profile');
  };

  const resetForm = () => {
    setCurrentStep('form');
    setShowForm(true);
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
            <span className="text-slate-800">Manual</span>
            <br />
            <span className="text-orange-600">+ AI Assist</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
            Enter what you remember — teams, venue, timeframe, score — and we’ll search and match the exact game for you.
          </p>
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
                          const sections = document.querySelectorAll('[data-date-section]') as NodeListOf<HTMLElement>;
                          sections.forEach(section => section.style.display = 'none');
                          const targetSection = document.querySelector(`[data-date-section="${e.target.value}"]`) as HTMLElement;
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
                <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
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

              <div className="flex flex-col sm:flex-row justify-center gap-6">
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
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Found Your Games!
              </h2>
              {searchResults && searchResults.length > 0 && (
                <p className="text-xl text-slate-600 font-medium">
                  We found {searchResults.length} possible match{searchResults.length > 1 ? 'es' : ''}. Click the + button to add the right one!
                </p>
              )}
            </div>
            
            {searchResults && searchResults.length > 0 ? (
              <div className="space-y-6 mb-12">
                <div className="grid gap-6">
                  {searchResults.map((game) => (
                    <div 
                      key={game.id}
                      className={`group relative bg-white rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 ${
                        selectedGameId === game.id 
                          ? 'border-emerald-400 ring-4 ring-emerald-100 shadow-2xl shadow-emerald-100/50' 
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 transition-opacity duration-300 ${
                        selectedGameId === game.id 
                          ? 'bg-gradient-to-br from-emerald-50/80 to-green-50/80 opacity-100' 
                          : 'bg-gradient-to-br from-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100'
                      }`}></div>
                      
                      <div className="relative p-8">
                        <div className="flex items-center justify-between mb-6">
                          {/* Game Title */}
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                              {game.awayTeam} @ {game.homeTeam}
                            </h3>
                            {game.score && (
                              <p className="text-lg font-semibold text-slate-700 bg-slate-100 inline-block px-3 py-1 rounded-lg">
                                Final Score: {game.score}
                              </p>
                            )}
                          </div>
                          
                          {/* Add Button */}
                          <button
                            onClick={() => handleSelectGame(game)}
                            className={`relative flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                              selectedGameId === game.id 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                                : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-200/50'
                            }`}
                          >
                            {selectedGameId === game.id ? (
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            ) : (
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Game Details Grid */}
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-700">Date</span>
                            </div>
                            <p className="text-slate-600 font-medium">{game.date}</p>
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-700">Venue</span>
                            </div>
                            <p className="text-slate-600 font-medium">{game.venue}</p>
                          </div>
                          
                          <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-700">Match Confidence</span>
                            </div>
                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                              game.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                              game.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {Math.round(game.confidence * 100)}% match
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {game.description && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-slate-700 font-medium">{game.description}</p>
                          </div>
                        )}

                        {/* Source Link */}
                        {game.sourceUrl && (
                          <div className="flex justify-end">
                            <a 
                              href={game.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                            >
                              <span>View Source: {game.sourceName || 'External Link'}</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}

                        {/* Selected Indicator */}
                        {selectedGameId === game.id && (
                          <div className="mt-6 p-4 bg-emerald-100 rounded-xl border-2 border-emerald-200">
                            <div className="flex items-center justify-center gap-3 text-emerald-800">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              <span className="text-lg font-bold">Perfect! This is your game!</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center mb-12">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-3xl flex items-center justify-center shadow-xl">
                  <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-slate-700 mb-4">
                  No Matches Found
                </h3>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  We need more information to identify this game. Try adding more specific details like the final score, notable plays, or weather conditions.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {selectedGameId && (
                <button 
                  onClick={handleAddToMyList}
                  className="group relative bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-200/50 flex items-center gap-3"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add to My Collection</span>
                </button>
              )}

              <button 
                onClick={() => setCurrentStep('form')}
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-200/50 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Add More Details
              </button>

              <button 
                onClick={resetForm}
                className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start Over
              </button>
            </div>

            {/* Profile Link */}
            {selectedGameId && (
              <div className="text-center mt-8">
                <Link 
                  href="/profile"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors hover:underline"
                >
                  <span>View My Sports Collection</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default AddExperienceForm;
