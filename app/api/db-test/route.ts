import { NextResponse } from 'next/server';
import { testConnection, initializeDatabase } from '@/lib/db';

export async function GET() {
  // Test connection
  const connectionResult = await testConnection();

  if (!connectionResult.success) {
    return NextResponse.json(connectionResult, { status: 500 });
  }

  // Initialize database schema
  const initResult = await initializeDatabase();

  return NextResponse.json({
    connection: connectionResult,
    initialization: initResult,
  });
}
