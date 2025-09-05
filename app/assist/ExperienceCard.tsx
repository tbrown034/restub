'use client';

/*
PRESERVED DESIGN - Fuzzy League Watermark Background Effect:
This design feature creates a subtle, blurred league abbreviation in the background.
Can be reused in other card components:

<div className="absolute bottom-0 right-0 opacity-10 dark:opacity-20">
  <div className={`text-8xl font-black ${leagueColors.text} select-none blur-sm`}>
    {experience.league.toUpperCase()}
  </div>
</div>

Where leagueColors comes from the getLeagueColors function that maps leagues to their brand colors.
*/

import { useState } from 'react';
import { Experience } from './actions';
import Icon from '../components/Icon';

interface ExperienceCardProps {
  experience: Experience;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const ExperienceCard = ({ experience, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const getDisplayTeamName = (teamName: string, customTeamName?: string) => {
    if (customTeamName) return customTeamName;
    if (!teamName || teamName === 'Unknown Team') return 'Team';
    return teamName;
  };

  const getMatchupDisplay = () => {
    const awayTeam = getDisplayTeamName(experience.awayTeam, experience.customAwayTeam);
    const homeTeam = getDisplayTeamName(experience.homeTeam, experience.customHomeTeam);
    return { awayTeam, homeTeam };
  };

  const { awayTeam, homeTeam } = getMatchupDisplay();
  const leagueColors = getLeagueColors(experience.league);

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Modern Glassmorphic Card with Depth */}
      <div className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/80 dark:to-gray-900/60
        backdrop-blur-xl backdrop-saturate-150
        border-2 ${leagueColors.border} 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] dark:hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]
        transform transition-all duration-300 ease-out
        ring-2 ring-transparent ${leagueColors.ring}
        ${isHovered ? '-translate-y-2 scale-[1.02]' : ''}
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none
      `}>
        
        {/* League Badge - Top Left Corner */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`
            px-3 py-1 rounded-full 
            bg-gradient-to-r ${leagueColors.bg}
            text-white text-xs font-bold uppercase
            shadow-lg
          `}>
            {experience.league}
          </div>
        </div>

        {/* Quick Actions - Top Right */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Reorder Arrows */}
          {canMoveUp && (
            <button 
              onClick={onMoveUp}
              className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
              title="Move Up"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {canMoveDown && (
            <button 
              onClick={onMoveDown}
              className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
              title="Move Down"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          
          {/* Favorite/Heart Button */}
          <button className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* More Options */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl ring-1 ring-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white dark:hover:bg-gray-700"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-50 ring-1 ring-black/5">
                <button 
                  onClick={() => handleDelete(experience.id)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 pt-14">
          {/* Teams - Primary Focus */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {awayTeam} @ {homeTeam}
              </h3>
            </div>
            {experience.score && (
              <p className={`text-2xl font-bold ${leagueColors.text}`}>
                {experience.score}
              </p>
            )}
          </div>

          {/* Date & Venue - Secondary Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Icon name="calendar" size="sm" />
              <span>{formatDate(experience.date)}</span>
            </div>
            {experience.venue && (
              <div className="flex items-center gap-1">
                <Icon name="pin" size="sm" />
                <span className="truncate">{experience.venue}</span>
              </div>
            )}
          </div>

          {/* Rating Stars */}
          {experience.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= experience.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}

          {/* Game Description from AI */}
          {experience.description && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {experience.description}
              </p>
            </div>
          )}

          {/* Hover Overlay - Source Link */}
          {experience.sourceUrl && (
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
              flex items-end justify-center pb-6
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              pointer-events-none
            `}>
              <a 
                href={experience.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 dark:text-white pointer-events-auto hover:scale-105 transition-transform flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {experience.sourceName || 'View Source'}
              </a>
            </div>
          )}
        </div>

        {/* Subtle League Watermark with Glow */}
        <div className="absolute bottom-0 right-0 opacity-10 dark:opacity-20">
          <div className={`text-8xl font-black ${leagueColors.text} select-none blur-sm`}>
            {experience.league.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;