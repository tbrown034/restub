'use server';

import Anthropic from '@anthropic-ai/sdk';
import { sql } from '@/lib/db';
import { GameSearchResult, SavedGame, ApiResponse, dbRowToSavedGame } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/** ---------------------- Query builder ---------------------- */
function buildSearchQuery(formData: FormData): string {
  const league = formData.get('league')?.toString() || '';
  const homeTeam =
    formData.get('homeTeam') === 'custom'
      ? formData.get('customHomeTeam')?.toString()
      : formData.get('homeTeam')?.toString();
  const awayTeam =
    formData.get('awayTeam') === 'custom'
      ? formData.get('customAwayTeam')?.toString()
      : formData.get('awayTeam')?.toString();
  const gameDetails = formData.get('gameDetails')?.toString() || '';

  let dateInfo = '';
  const dateType = formData.get('dateType')?.toString();

  if (dateType === 'exact') {
    const exactDate = formData.get('exactDate')?.toString();
    if (exactDate) {
      const date = new Date(exactDate);
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      dateInfo = `on ${date.toLocaleDateString('en-US', options)}`;
    }
  } else if (dateType === 'month') {
    const month = formData.get('month')?.toString();
    const year = formData.get('year')?.toString();
    if (month && year) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[parseInt(month) - 1];
      dateInfo = `in ${monthName} ${year}`;
    }
  } else if (dateType === 'year') {
    const year = formData.get('yearOnly')?.toString();
    if (year) dateInfo = `in ${year}`;
  } else if (dateType === 'range') {
    const fromYear = formData.get('fromYear')?.toString();
    const toYear = formData.get('toYear')?.toString();
    if (fromYear && toYear) dateInfo = `between ${fromYear} and ${toYear}`;
  }

  let query = `Find ${league.toUpperCase()} games`;
  if (homeTeam && awayTeam) query += ` between ${awayTeam} at ${homeTeam}`;
  else if (homeTeam) query += ` with ${homeTeam} as home team`;
  else if (awayTeam) query += ` with ${awayTeam} as away team`;

  if (dateInfo) query += ` ${dateInfo}`;
  if (gameDetails) query += `. Additional details: ${gameDetails}`;

  return query;
}

/** ---------------------- Search with Anthropic ---------------------- */
export async function searchGame(formData: FormData): Promise<ApiResponse<GameSearchResult[]>> {
  const searchQuery = buildSearchQuery(formData);

  const systemPrompt = `You are a sports game database assistant. Search for real sports games based on the provided information.

IMPORTANT: You MUST return ONLY valid JSON with no additional text, markdown, or explanations.

Return your response in this exact JSON format:
{
  "games": [
    {
      "id": "unique_id",
      "homeTeam": "Team Name",
      "awayTeam": "Team Name",
      "date": "Month DD, YYYY",
      "venue": "Stadium/Arena Name, City",
      "score": "Away XX - Home XX",
      "description": "Detailed game summary including key moments, notable players, game significance (playoff/regular season), final result, and any memorable highlights or records broken",
      "confidence": 0.95,
      "sourceUrl": "URL to source if known",
      "sourceName": "Source name"
    }
  ]
}

Rules:
- Return up to 5 most likely matches based on your knowledge
- The description field should be 2-3 sentences with rich details about the actual game
- Include playoff/championship/series information in the description if applicable
- Include notable player performances in the description
- If the score is not available, omit the score field
- Confidence should reflect how well the game matches ALL provided criteria
- Output ONLY the JSON object, nothing else`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\nSearch Query: ${searchQuery}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return {
        success: false,
        error: 'Unexpected response format from AI',
      };
    }

    // Extract JSON from potential markdown code blocks
    let jsonText = content.text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const result = JSON.parse(jsonText);
    const games = result.games || [];

    // Ensure all games have required fields
    const validatedGames: GameSearchResult[] = games.map((game: Partial<GameSearchResult>) => ({
      id: game.id || crypto.randomUUID(),
      homeTeam: game.homeTeam || 'Unknown',
      awayTeam: game.awayTeam || 'Unknown',
      date: game.date || 'Unknown Date',
      venue: game.venue || 'Unknown Venue',
      score: game.score,
      description: game.description,
      confidence: game.confidence || 0.5,
      sourceUrl: game.sourceUrl,
      sourceName: game.sourceName
    })).slice(0, 5);

    return {
      success: true,
      data: validatedGames,
    };
  } catch (error) {
    console.error('Error searching for game:', error);

    // Return specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Failed to search for games: ${errorMessage}`,
    };
  }
}

/** ---------------------- Database Operations ---------------------- */

// Save a game to the database
export async function saveGame(game: SavedGame, userId: string = 'anonymous'): Promise<ApiResponse<SavedGame>> {
  try {
    const result = await sql`
      INSERT INTO games (
        id, user_id, league, home_team, away_team,
        custom_home_team, custom_away_team, game_date, venue, score,
        game_details, description, personal_memories, who_with, rating,
        source_url, source_name
      ) VALUES (
        ${game.id}, ${userId}, ${game.league}, ${game.homeTeam}, ${game.awayTeam},
        ${game.customHomeTeam || null}, ${game.customAwayTeam || null}, ${game.date}, ${game.venue}, ${game.score || null},
        ${game.gameDetails || null}, ${game.description || null}, ${game.personalMemories || null}, ${game.whoWith || null}, ${game.rating || null},
        ${game.sourceUrl || null}, ${game.sourceName || null}
      )
      RETURNING *
    `;

    return {
      success: true,
      data: dbRowToSavedGame(result[0]),
      message: 'Game saved successfully',
    };
  } catch (error) {
    console.error('Error saving game:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to save game: ${errorMessage}`,
    };
  }
}

// Get all games for a user
export async function getGames(userId: string = 'anonymous'): Promise<ApiResponse<SavedGame[]>> {
  try {
    const result = await sql`
      SELECT * FROM games
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    const games = result.map(row => dbRowToSavedGame(row));

    return {
      success: true,
      data: games,
    };
  } catch (error) {
    console.error('Error fetching games:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to fetch games: ${errorMessage}`,
    };
  }
}

// Delete a game
export async function deleteGame(gameId: string, userId: string = 'anonymous'): Promise<ApiResponse<void>> {
  try {
    const result = await sql`
      DELETE FROM games
      WHERE id = ${gameId} AND user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return {
        success: false,
        error: 'Game not found or you do not have permission to delete it',
      };
    }

    return {
      success: true,
      message: 'Game deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting game:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to delete game: ${errorMessage}`,
    };
  }
}

// Get game statistics for a user
export async function getGameStats(userId: string = 'anonymous'): Promise<ApiResponse<{
  total: number;
  byLeague: Record<string, number>;
  topRated: number;
}>> {
  try {
    const [totalResult, leagueResult, topRatedResult] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM games WHERE user_id = ${userId}`,
      sql`SELECT league, COUNT(*) as count FROM games WHERE user_id = ${userId} GROUP BY league`,
      sql`SELECT COUNT(*) as count FROM games WHERE user_id = ${userId} AND rating >= 4`,
    ]);

    const byLeague: Record<string, number> = {};
    leagueResult.forEach(row => {
      byLeague[String(row.league)] = Number(row.count);
    });

    return {
      success: true,
      data: {
        total: Number(totalResult[0].count),
        byLeague,
        topRated: Number(topRatedResult[0].count),
      },
    };
  } catch (error) {
    console.error('Error fetching game stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to fetch game stats: ${errorMessage}`,
    };
  }
}

/** ---------------------- Legacy server action for form submission ---------------------- */
export async function addExperience(formData: FormData): Promise<ApiResponse<SavedGame>> {
  const game: SavedGame = {
    id: formData.get('selectedGameId')?.toString() || crypto.randomUUID(),
    league: formData.get('league')?.toString() || '',
    homeTeam: formData.get('homeTeam')?.toString() || '',
    awayTeam: formData.get('awayTeam')?.toString() || '',
    customHomeTeam:
      formData.get('homeTeam') === 'custom'
        ? formData.get('customHomeTeam')?.toString()
        : undefined,
    customAwayTeam:
      formData.get('awayTeam') === 'custom'
        ? formData.get('customAwayTeam')?.toString()
        : undefined,
    date: formData.get('finalDate')?.toString() || '',
    venue: formData.get('finalVenue')?.toString() || '',
    score: formData.get('finalScore')?.toString(),
    gameDetails: formData.get('gameDetails')?.toString(),
    description: formData.get('description')?.toString(),
    personalMemories: formData.get('personalMemories')?.toString(),
    whoWith: formData.get('whoWith')?.toString(),
    rating: formData.get('rating') ? Number(formData.get('rating')) : undefined,
    sourceUrl: formData.get('sourceUrl')?.toString(),
    sourceName: formData.get('sourceName')?.toString(),
    savedAt: new Date().toISOString(),
  };

  return saveGame(game);
}
