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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 animate-fade-in">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Test Database Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
              <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100 text-center">
                Test Database Connection
              </h2>
              <form action={create} className="space-y-6">
                <div>
                  <label htmlFor="comment" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Your Comment
                  </label>
                  <input 
                    type="text" 
                    id="comment"
                    placeholder="Write a test comment..." 
                    name="comment"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] hover:shadow-lg"
                >
                  Submit Test
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
