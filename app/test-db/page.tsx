import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TestDbPage() {
  async function testConnection() {
    'use server';
    
    try {
      if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL not configured');
        redirect('/dashboard?error=no-database-url');
      }
      
      const sql = neon(process.env.DATABASE_URL);
      
      // Simple test query
      const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
      
      console.log('Database connection successful!');
      console.log('Current time from DB:', result[0].current_time);
      console.log('PostgreSQL version:', result[0].pg_version);
      
      // Create comments table if it doesn't exist
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        console.log('Comments table ready');
      } catch (error) {
        console.log('Comments table might already exist:', error);
      }
      
      // Redirect to dashboard on success
      redirect('/dashboard?success=true');
    } catch (error) {
      console.error('Database connection failed:', error);
      redirect('/dashboard?error=connection-failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Database Connection Test
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">What this test does:</h2>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Verifies your Neon database connection</li>
                <li>• Creates the comments table if needed</li>
                <li>• Redirects to the dashboard to view results</li>
              </ul>
            </div>
            
            <form action={testConnection}>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Test Database Connection & Go to Dashboard
              </button>
            </form>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
              <p>
                <strong>Note:</strong> Make sure you have added your DATABASE_URL to your .env.local file.
              </p>
              <p>
                If you haven&apos;t set up your database yet, visit{' '}
                <a 
                  href="https://console.neon.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Neon Console
                </a>{' '}
                to create one.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}