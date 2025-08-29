import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 dark:text-slate-100 mb-8">
              Start Logging Your Games
            </h1>
            <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Choose your flow: Manual + AI Assist, Upload Ticket, or connect your email (coming soon).
            </p>
          </div>

          {/* Tracking Options */}
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Manual + AI Assist */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Manual + AI Assist</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300">You enter details, we match the game</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-orange-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Add what you remember
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-orange-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI searches and suggests exact matches
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-orange-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Perfect when you don’t have a ticket handy
                  </li>
                </ul>

                <Link
                  href="/catalog"
                  className="block w-full bg-orange-600 text-white text-center font-semibold py-4 px-8 rounded-xl hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 text-lg"
                >
                  Start Manual + AI Assist
                </Link>
              </div>
            </div>

            {/* Upload Ticket */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Upload Ticket</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300">Upload your physical or digital ticket and we’ll add the game</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Works with photos, PDFs, and screenshots
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    We extract the details automatically
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Fastest way to add past games
                  </li>
                </ul>

                <Link
                  href="/ticket-upload"
                  className="relative block w-full bg-blue-600/70 text-white text-center font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg"
                >
                  Upload Ticket
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
                </Link>
              </div>
            </div>

            {/* Connect Email (Coming Soon) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden">
              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Connect Your Email</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300">Search your inbox for tickets (coming soon)</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-slate-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Works with major providers
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-slate-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Secure, read-only access
                  </li>
                  <li className="flex items-center text-slate-600 dark:text-slate-300 text-lg">
                    <svg className="w-6 h-6 text-slate-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Automatically finds your game confirmations
                  </li>
                </ul>

                <button
                  disabled
                  className="block w-full bg-slate-400/60 text-white text-center font-semibold py-4 px-8 rounded-xl cursor-not-allowed text-lg"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-12">
            <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-12 text-center">Why Track Your Games?</h3>
            <div className="grid sm:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Build Your History</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Create a permanent record of every game you&apos;ve attended</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Preserve Memories</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Never forget those incredible moments and experiences</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Share With Friends</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Show off your sports journey and connect with fellow fans</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
