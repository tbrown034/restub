import { neon } from '@neondatabase/serverless';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AdminPage() {
  async function testConnection() {
    'use server';
    
    try {
      if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL not configured');
        redirect('/admin?error=no-database-url');
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
      redirect('/admin?error=connection-failed');
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Database Test Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Database Connection Test
              </h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">What this test does:</h3>
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
                    Test Database Connection
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
            
            {/* Quick Links Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Quick Links
              </h2>
              
              <div className="space-y-4">
                <Link 
                  href="/dashboard" 
                  className="block w-full px-6 py-3 bg-green-600 text-white text-center font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  User Management Dashboard
                </Link>
                
                <a 
                  href="https://console.neon.tech" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-6 py-3 bg-purple-600 text-white text-center font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Open Neon Console →
                </a>
                
                <Link 
                  href="/assist" 
                  className="block w-full px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Experience Catalog
                </Link>
                
                <Link 
                  href="/profile" 
                  className="block w-full px-6 py-3 bg-indigo-600 text-white text-center font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  User Profile
                </Link>
              </div>
            </div>
          </div>
          
          {/* System Information */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Environment:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {process.env.NODE_ENV || 'development'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Database URL:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {process.env.DATABASE_URL ? 'Configured' : 'Not Configured'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Build Mode:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {process.env.NEXT_PUBLIC_BUILD_MODE || 'Standard'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}