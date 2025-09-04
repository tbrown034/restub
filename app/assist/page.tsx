'use client';

import { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ExperienceCard from './ExperienceCard';
import AddExperienceForm from './AddExperienceForm';
import type { Experience } from './actions';

const AssistPage = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    // Load saved games from localStorage
    const loadExperiences = () => {
      const saved = localStorage.getItem('restub_games');
      if (saved) {
        try {
          const games = JSON.parse(saved);
          
          // Fix duplicate IDs: track seen IDs and generate new ones for duplicates
          const seenIds = new Set<string>();
          const fixedGames = games.map((game: Record<string, unknown>) => {
            let gameId = (game.id as string) || crypto.randomUUID();
            
            // If we've seen this ID before, generate a new unique one
            if (seenIds.has(gameId)) {
              gameId = crypto.randomUUID();
            }
            seenIds.add(gameId);
            
            return { ...game, id: gameId };
          });
          
          // Save the fixed games back to localStorage if we had to fix any IDs
          if (games.some((g: Record<string, unknown>, i: number) => (g.id as string) !== fixedGames[i].id)) {
            localStorage.setItem('restub_games', JSON.stringify(fixedGames));
            console.log('Fixed duplicate game IDs in localStorage');
          }
          
          // Transform saved games to Experience format
          const exps: Experience[] = fixedGames.map((game: {
            id?: string;
            league?: string;
            homeTeam?: string;
            awayTeam?: string;
            customHomeTeam?: string;
            customAwayTeam?: string;
            date?: string;
            venue?: string;
            score?: string;
            gameDetails?: string;
            description?: string;
            personalMemories?: string;
            whoWith?: string;
            rating?: number;
            savedAt?: string;
          }) => ({
            id: game.id || crypto.randomUUID(),
            league: game.league || '',
            homeTeam: game.homeTeam || '',
            awayTeam: game.awayTeam || '',
            customHomeTeam: game.customHomeTeam,
            customAwayTeam: game.customAwayTeam,
            date: game.date || '',
            venue: game.venue || '',
            score: game.score,
            gameDetails: game.gameDetails || game.description,
            personalMemories: game.personalMemories,
            whoWith: game.whoWith,
            rating: game.rating,
            savedAt: game.savedAt || new Date().toISOString()
          }));
          setExperiences(exps);
        } catch (error) {
          console.error('Error loading experiences:', error);
        }
      }
    };

    loadExperiences();

    // Listen for storage changes (when games are added from the form)
    const handleStorageChange = () => {
      loadExperiences();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-page updates
    window.addEventListener('restub-game-added', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('restub-game-added', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1">
        <AddExperienceForm />

        {/* Experiences List */}
        {experiences.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Your Game Collection
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  You&apos;ve tracked <span className="font-bold text-orange-600 dark:text-orange-400">{experiences.length}</span> {experiences.length === 1 ? 'game' : 'games'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map((experience) => (
                  <ExperienceCard
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {experiences.length === 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-white dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No games tracked yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start building your sports memory collection by adding your first game above.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AssistPage;