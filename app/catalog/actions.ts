'use server';

import { redirect } from 'next/navigation';

export interface Experience {
  id: string;
  league: string; // nfl, nba, mlb, nhl
  homeTeam: string;
  awayTeam: string;
  customHomeTeam?: string;
  customAwayTeam?: string;
  date: string;
  venue: string;
  gameDetails: string;
  selectedGameId?: string;
  finalDate?: string;
  finalVenue?: string;
  finalScore?: string;
  // New enhanced fields
  rating?: number; // 1-5 stars
  whoWith?: string;
  personalMemories?: string;
  photos?: string[]; // URLs or file paths
  videos?: string[]; // URLs or file paths
  createdAt: Date;
}

export interface GameSearchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  score?: string;
  description: string;
  confidence: number;
  sourceUrl?: string;
  sourceName?: string;
}

// In a real app, this would be stored in a database
let experiences: Experience[] = [];

export async function searchGame(formData: FormData): Promise<GameSearchResult[]> {
  const league = formData.get('league') as string;
  const homeTeam = formData.get('homeTeam') as string;
  const awayTeam = formData.get('awayTeam') as string;
  const customHomeTeam = formData.get('customHomeTeam') as string;
  const customAwayTeam = formData.get('customAwayTeam') as string;
  const venue = formData.get('venue') as string;
  const gameDetails = formData.get('gameDetails') as string;
  
  // Build date info
  const exactYear = formData.get('exactYear') as string;
  const month = formData.get('month') as string;
  const day = formData.get('day') as string;
  const fromYear = formData.get('fromYear') as string;
  const toYear = formData.get('toYear') as string;
  
  let dateInfo = '';
  if (exactYear) {
    if (month && day) {
      dateInfo = `${month}/${day}/${exactYear}`;
    } else if (month) {
      dateInfo = `${month}/${exactYear}`;
    } else {
      dateInfo = exactYear;
    }
  } else if (fromYear && toYear) {
    dateInfo = `between ${fromYear} and ${toYear}`;
  }
  
  // Build team names
  const finalHomeTeam = homeTeam === 'custom' ? customHomeTeam : homeTeam;
  const finalAwayTeam = awayTeam === 'custom' ? customAwayTeam : awayTeam;
  
  // Create prompt for LLM
  const prompt = `
Find a ${league.toUpperCase()} game with the following details:
- Home Team: ${finalHomeTeam}
- Away Team: ${finalAwayTeam}
- Date: ${dateInfo}
- Venue: ${venue || 'Not specified'}
- Additional Details: ${gameDetails || 'None provided'}

Please return potential matching games with their exact dates, final scores, and venue information. Include a confidence score for each match.
  `.trim();

  console.log('LLM Prompt:', prompt);

  // TODO: Replace this with actual LLM API call when API key is ready
  // For now, return mock results based on the input
  
  try {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock results for testing
    const mockResults: GameSearchResult[] = [];
    
    if (finalHomeTeam && finalAwayTeam) {
      const timestamp = Date.now();
      // Create a mock game result with guaranteed unique ID
      mockResults.push({
        id: `mock-${timestamp}-${crypto.randomUUID().substring(0, 8)}`,
        homeTeam: finalHomeTeam,
        awayTeam: finalAwayTeam,
        date: dateInfo.includes('between') ? `${fromYear}-10-15` : (exactYear ? `${exactYear}-${month?.padStart(2, '0') || '10'}-${day?.padStart(2, '0') || '15'}` : '2019-10-15'),
        venue: venue || 'Stadium Name',
        score: '24-17',
        description: `${league.toUpperCase()} game between ${finalAwayTeam} and ${finalHomeTeam}. ${gameDetails || 'Regular season matchup.'}`,
        confidence: 0.85,
        sourceUrl: `https://www.espn.com/${league}/game/_/gameId/123456789`,
        sourceName: 'ESPN'
      });
      
      // Add a second lower-confidence result sometimes
      if (Math.random() > 0.5) {
        // Ensure second ID is different by adding delay and new UUID
        mockResults.push({
          id: `mock-${timestamp + Math.floor(Math.random() * 1000)}-${crypto.randomUUID().substring(0, 8)}`,
          homeTeam: finalHomeTeam,
          awayTeam: finalAwayTeam,
          date: dateInfo.includes('between') ? `${fromYear}-11-20` : (exactYear ? `${exactYear}-${month?.padStart(2, '0') || '11'}-${day?.padStart(2, '0') || '20'}` : '2019-11-20'),
          venue: venue || 'Alternative Stadium',
          score: '31-14',
          description: `Another possible ${league.toUpperCase()} matchup. Could be a different game from the same season.`,
          confidence: 0.65,
          sourceUrl: `https://www.nfl.com/games/${finalHomeTeam.toLowerCase()}-vs-${finalAwayTeam.toLowerCase()}`,
          sourceName: 'NFL.com'
        });
      }
    }
    
    return mockResults;
    
    // TODO: Uncomment and implement when API key is ready
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a sports database expert. Return game results in JSON format with id, homeTeam, awayTeam, date (YYYY-MM-DD), venue, score, description, and confidence (0-1).'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const results = JSON.parse(content);
      return Array.isArray(results) ? results : [results];
    } catch (parseError) {
      console.error('Failed to parse LLM response:', parseError);
      return [];
    }
    */
    
  } catch (error) {
    console.error('Game search error:', error);
    throw new Error('Failed to search for games');
  }
}

export async function addExperience(formData: FormData) {
  const homeTeam = formData.get('homeTeam') as string;
  const awayTeam = formData.get('awayTeam') as string;
  
  // Build date string from separate fields
  const exactYear = formData.get('exactYear') as string;
  const month = formData.get('month') as string;
  const day = formData.get('day') as string;
  const fromYear = formData.get('fromYear') as string;
  const toYear = formData.get('toYear') as string;
  
  let dateString = '';
  
  // Use final date if available (from AI search results)
  const finalDate = formData.get('finalDate') as string;
  if (finalDate) {
    dateString = finalDate;
  } else if (exactYear) {
    if (month && day) {
      dateString = `${exactYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else if (month) {
      dateString = `${exactYear}-${month.padStart(2, '0')}`;
    } else {
      dateString = exactYear;
    }
  } else if (fromYear && toYear) {
    dateString = `${fromYear}-${toYear}`;
  }
  
  const newExperience: Experience = {
    id: Date.now().toString(),
    league: formData.get('league') as string,
    homeTeam: homeTeam === 'custom' ? '' : homeTeam,
    awayTeam: awayTeam === 'custom' ? '' : awayTeam,
    customHomeTeam: homeTeam === 'custom' ? formData.get('customHomeTeam') as string : undefined,
    customAwayTeam: awayTeam === 'custom' ? formData.get('customAwayTeam') as string : undefined,
    date: dateString,
    venue: formData.get('finalVenue') as string || formData.get('venue') as string,
    gameDetails: formData.get('gameDetails') as string,
    selectedGameId: formData.get('selectedGameId') as string || undefined,
    finalDate: formData.get('finalDate') as string || undefined,
    finalVenue: formData.get('finalVenue') as string || undefined,
    finalScore: formData.get('finalScore') as string || undefined,
    createdAt: new Date()
  };

  experiences.unshift(newExperience);
  redirect('/catalog');
}

export async function updateExperience(id: string, formData: FormData) {
  const homeTeam = formData.get('homeTeam') as string;
  const awayTeam = formData.get('awayTeam') as string;
  
  const updatedExperience: Experience = {
    id,
    league: formData.get('league') as string,
    homeTeam: homeTeam === 'custom' ? '' : homeTeam,
    awayTeam: awayTeam === 'custom' ? '' : awayTeam,
    customHomeTeam: homeTeam === 'custom' ? formData.get('customHomeTeam') as string : undefined,
    customAwayTeam: awayTeam === 'custom' ? formData.get('customAwayTeam') as string : undefined,
    date: formData.get('date') as string,
    venue: formData.get('venue') as string,
    gameDetails: formData.get('gameDetails') as string,
    createdAt: new Date()
  };

  const index = experiences.findIndex(exp => exp.id === id);
  if (index !== -1) {
    experiences[index] = updatedExperience;
  }

  redirect('/catalog');
}

export async function deleteExperience(id: string) {
  experiences = experiences.filter(exp => exp.id !== id);
  redirect('/catalog');
}

export async function getExperiences(): Promise<Experience[]> {
  return experiences;
}