'use client';

import { Experience } from './actions';

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) {
      return;
    }
    
    // Delete from localStorage
    const savedGames = JSON.parse(localStorage.getItem('restub_games') || '[]');
    const filtered = savedGames.filter((game: { id: string }) => game.id !== id);
    localStorage.setItem('restub_games', JSON.stringify(filtered));
    
    // Trigger refresh
    window.dispatchEvent(new Event('restub-game-added'));
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLeagueColor = (league: string) => {
    const colors = {
      nfl: 'bg-blue-600 border-blue-700',
      nba: 'bg-orange-600 border-orange-700',
      mlb: 'bg-slate-600 border-slate-700',
      nhl: 'bg-slate-700 border-slate-800'
    };
    return colors[league as keyof typeof colors] || colors.nfl;
  };

  const getLeagueIcon = (league: string) => {
    return league.toUpperCase();
  };

  const getDisplayTeamName = (teamName: string, customTeamName?: string) => {
    if (customTeamName) return customTeamName;
    if (!teamName) return 'Unknown Team';
    return teamName;
  };

  const getMatchupDisplay = () => {
    const awayTeam = getDisplayTeamName(experience.awayTeam, experience.customAwayTeam);
    const homeTeam = getDisplayTeamName(experience.homeTeam, experience.customHomeTeam);
    
    if (awayTeam === 'Unknown Team' && homeTeam === 'Unknown Team') {
      return 'Game Details Unknown';
    }
    
    return `${awayTeam} @ ${homeTeam}`;
  };

  const StarRating = ({ rating = 0 }: { rating?: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-slate-600 ml-1">
          {rating > 0 ? `${rating}/5` : 'Not rated'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-orange-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white border-2 ${getLeagueColor(experience.league)} shadow-lg`}>
          {getLeagueIcon(experience.league)}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 border border-slate-300 hover:border-orange-400 rounded-xl transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            type="button"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-300 hover:border-red-400 rounded-xl transition-all duration-200"
            onClick={() => handleDelete(experience.id)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-3">{getMatchupDisplay()}</h3>
      
      {/* Star Rating */}
      <div className="mb-4">
        <StarRating rating={experience.rating} />
      </div>
      
      <div className="space-y-3 text-sm text-slate-600 mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-600 border-2 border-orange-700 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {formatDate(experience.date)}
        </div>
        
        {experience.venue && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {experience.venue}
          </div>
        )}

        {experience.whoWith && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 border-2 border-purple-700 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            With: {experience.whoWith}
          </div>
        )}
      </div>

      {/* Media Section */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Photo Upload Placeholder */}
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Photos
          </button>
          
          {/* Video Upload Placeholder */}
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm text-slate-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Add Videos
          </button>
        </div>
      </div>
      
      {experience.gameDetails && (
        <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 mb-4">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Game Details</h4>
          <p className="text-sm text-slate-700 leading-relaxed">{experience.gameDetails}</p>
        </div>
      )}

      {experience.personalMemories && (
        <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Personal Memories</h4>
          <p className="text-sm text-blue-700 leading-relaxed">{experience.personalMemories}</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;