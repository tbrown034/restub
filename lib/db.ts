import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the Neon serverless driver
const sql = neon(process.env.DATABASE_URL!);

export { sql };

// Database types
export interface DbGame {
  id: string;
  user_id: string;
  league: string;
  home_team: string;
  away_team: string;
  custom_home_team: string | null;
  custom_away_team: string | null;
  game_date: string;
  venue: string;
  score: string | null;
  game_details: string | null;
  description: string | null;
  personal_memories: string | null;
  who_with: string | null;
  rating: number | null;
  source_url: string | null;
  source_name: string | null;
  created_at: string;
  updated_at: string;
}

// Initialize database schema
export async function initializeDatabase() {
  try {
    // Create games table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL DEFAULT 'anonymous',
        league TEXT NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        custom_home_team TEXT,
        custom_away_team TEXT,
        game_date TEXT NOT NULL,
        venue TEXT NOT NULL,
        score TEXT,
        game_details TEXT,
        description TEXT,
        personal_memories TEXT,
        who_with TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        source_url TEXT,
        source_name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create index for faster user queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id)
    `;

    // Create index for league filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_games_league ON games(league)
    `;

    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { success: false, message: String(error) };
  }
}

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time, current_database() as database_name`;
    return {
      success: true,
      data: result[0],
      message: 'Database connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
      message: 'Database connection failed'
    };
  }
}
