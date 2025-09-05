'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY,
});

export interface GameSearchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  score?: string;
  description?: string;
  confidence: number;
  sourceUrl?: string;
  sourceName?: string;
}

export interface Experience {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  customHomeTeam?: string;
  customAwayTeam?: string;
  date: string;
  venue: string;
  score?: string;
  gameDetails?: string;
  description?: string;
  personalMemories?: string;
  whoWith?: string;
  rating?: number;
  savedAt: string;
  sourceUrl?: string;
  sourceName?: string;
}

/** ---------------------- Query builder (unchanged) ---------------------- */
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
  const venue = formData.get('venue')?.toString() || '';
  const gameDetails = formData.get('gameDetails')?.toString() || '';

  let dateInfo = '';
  const dateType = formData.get('dateType')?.toString();

  if (dateType === 'exact') {
    // Check for the exactDate input field first
    const exactDate = formData.get('exactDate')?.toString();
    if (exactDate) {
      // Convert YYYY-MM-DD to readable format
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
  if (venue) query += ` played at ${venue}`;
  if (gameDetails) query += `. Additional details: ${gameDetails}`;

  return query;
}

/** ---------------------- Search with web grounding ---------------------- */
export async function searchGame(formData: FormData): Promise<GameSearchResult[]> {
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
      "sourceUrl": "URL to source",
      "sourceName": "Source name"
    }
  ]
}

Rules:
- Use web search to find real, accurate game information
- Return up to 5 most likely matches, sorted by confidence
- The description field should be 2-3 sentences with rich details about the actual game
- Include playoff/championship/series information in the description if applicable
- Include notable player performances in the description
- If the score is not available, omit the score field
- Confidence should reflect how well the game matches ALL provided criteria
- Output ONLY the JSON object, nothing else`;

  try {
    // Using the GPT-5 Responses API with web search
    const response = await (openai as unknown as {responses: {create: (params: object) => Promise<{output_text: string}>}}).responses.create({
      model: 'gpt-5-mini',
      input: `${systemPrompt}\n\n${searchQuery}`,
      reasoning: { effort: 'low' },  // Low effort for web search compatibility
      text: { 
        verbosity: 'low'  // Concise output
      },
      tools: [
        { type: 'web_search' }  // Enable web search for real game data
      ]
    });

    const content = response.output_text;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    const games = result.games || [];

    // Ensure all games have required fields
    return games.map((game: Partial<GameSearchResult>) => ({
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
  } catch (error) {
    console.error('Error searching for game:', error);
    // Return empty array to trigger proper error UI
    return [];
  }
}

/** ---------------------- Save/load (server-safe placeholders) ---------------------- */
export async function addExperience(formData: FormData): Promise<void> {
  const experience: Experience = {
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
    personalMemories: formData.get('personalMemories')?.toString(),
    whoWith: formData.get('whoWith')?.toString(),
    rating: formData.get('rating') ? Number(formData.get('rating')) : undefined,
    savedAt: new Date().toISOString(),
  };

  // This runs on the server; localStorage is client-only.
  // Keep as a no-op log until you wire a database.
  console.log('Experience saved (server log):', experience);
}

export async function getExperiences(): Promise<Experience[]> {
  // Server-side placeholder; return empty for now.
  return [];
}

export async function deleteExperience(id: string): Promise<void> {
  // Server-side placeholder; log only for now.
  console.log('Experience deleted:', id);
}