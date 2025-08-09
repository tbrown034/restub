import { neon } from '@neondatabase/serverless';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function Home() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Step 5: Test form from Neon instructions */}
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Test Neon Database</h2>
            <form action={create} className="space-y-4">
              <input 
                type="text" 
                placeholder="write a comment" 
                name="comment"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
