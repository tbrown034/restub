// Shared types for the Restub application
// Single source of truth for all game/experience types

/**
 * Game search result from AI search
 */
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

/**
 * Saved game experience (used in database and client)
 */
export interface SavedGame {
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
  sourceUrl?: string;
  sourceName?: string;
  savedAt: string;
}

/**
 * Form state for adding a new game
 */
export interface GameFormState {
  league: string;
  homeTeam: string;
  awayTeam: string;
  customHomeTeam: string;
  customAwayTeam: string;
  dateType: 'exact' | 'month' | 'year' | 'range' | '';
  exactDate: string;
  month: string;
  year: string;
  yearOnly: string;
  fromYear: string;
  toYear: string;
  gameDetails: string;
}

/**
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Supported leagues
 */
export const LEAGUES = ['NFL', 'NBA', 'MLB', 'NHL'] as const;
export type League = typeof LEAGUES[number];

/**
 * League color mapping for UI
 */
export const LEAGUE_COLORS: Record<League, { bg: string; text: string; border: string }> = {
  NFL: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-600' },
  NBA: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' },
  MLB: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600' },
  NHL: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600' },
};

/**
 * Teams by league
 */
export const TEAMS_BY_LEAGUE: Record<League, string[]> = {
  NFL: [
    'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills',
    'Carolina Panthers', 'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns',
    'Dallas Cowboys', 'Denver Broncos', 'Detroit Lions', 'Green Bay Packers',
    'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars', 'Kansas City Chiefs',
    'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
    'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants',
    'New York Jets', 'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers',
    'Seattle Seahawks', 'Tampa Bay Buccaneers', 'Tennessee Titans', 'Washington Commanders'
  ],
  NBA: [
    'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets',
    'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets',
    'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
    'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat',
    'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
    'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
    'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors',
    'Utah Jazz', 'Washington Wizards'
  ],
  MLB: [
    'Arizona Diamondbacks', 'Atlanta Braves', 'Baltimore Orioles', 'Boston Red Sox',
    'Chicago Cubs', 'Chicago White Sox', 'Cincinnati Reds', 'Cleveland Guardians',
    'Colorado Rockies', 'Detroit Tigers', 'Houston Astros', 'Kansas City Royals',
    'Los Angeles Angels', 'Los Angeles Dodgers', 'Miami Marlins', 'Milwaukee Brewers',
    'Minnesota Twins', 'New York Mets', 'New York Yankees', 'Oakland Athletics',
    'Philadelphia Phillies', 'Pittsburgh Pirates', 'San Diego Padres', 'San Francisco Giants',
    'Seattle Mariners', 'St. Louis Cardinals', 'Tampa Bay Rays', 'Texas Rangers',
    'Toronto Blue Jays', 'Washington Nationals'
  ],
  NHL: [
    'Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres',
    'Calgary Flames', 'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche',
    'Columbus Blue Jackets', 'Dallas Stars', 'Detroit Red Wings', 'Edmonton Oilers',
    'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild', 'Montreal Canadiens',
    'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers',
    'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks',
    'Seattle Kraken', 'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs',
    'Vancouver Canucks', 'Vegas Golden Knights', 'Washington Capitals', 'Winnipeg Jets'
  ],
};

/**
 * Convert database row to SavedGame
 */
export function dbRowToSavedGame(row: Record<string, unknown>): SavedGame {
  return {
    id: String(row.id),
    league: String(row.league),
    homeTeam: String(row.home_team),
    awayTeam: String(row.away_team),
    customHomeTeam: row.custom_home_team ? String(row.custom_home_team) : undefined,
    customAwayTeam: row.custom_away_team ? String(row.custom_away_team) : undefined,
    date: String(row.game_date),
    venue: String(row.venue),
    score: row.score ? String(row.score) : undefined,
    gameDetails: row.game_details ? String(row.game_details) : undefined,
    description: row.description ? String(row.description) : undefined,
    personalMemories: row.personal_memories ? String(row.personal_memories) : undefined,
    whoWith: row.who_with ? String(row.who_with) : undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    sourceUrl: row.source_url ? String(row.source_url) : undefined,
    sourceName: row.source_name ? String(row.source_name) : undefined,
    savedAt: String(row.created_at),
  };
}
