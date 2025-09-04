import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              About Restub
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Building the ultimate sports memory keeper for fans who never want to forget a game
            </p>
          </div>

          {/* Creator Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-white">TB</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Trevor Brown</h2>
                <p className="text-slate-600 dark:text-slate-400">Creator & Developer</p>
              </div>
            </div>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Hey! I&apos;m Trevor, a web developer passionate about building tools that help people preserve their memories. 
                As a lifelong sports fan, I&apos;ve attended countless games and always wished there was a better way to catalog 
                and remember each experience.
              </p>
              
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Restub was born from my own frustration of forgetting details about games I attended years ago. 
                What was the final score? Who did I go with? What made that particular game special? 
                This app is my solution to never losing those memories again.
              </p>

              <div className="flex items-center gap-4 mt-6">
                <a 
                  href="https://trevorthewebdeveloper.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Visit My Portfolio
                </a>
                <a 
                  href="https://github.com/tbrown034" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-700 dark:bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Built With Modern Tech</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">N</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Next.js 15</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">App Router + Server Actions</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">R</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">React 19</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Latest Features</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">TS</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">TypeScript</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Type Safety</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">TW</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Tailwind CSS</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Utility-First Styling</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">AI</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">GPT-5</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Game Search & Matching</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">V</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100">Vercel</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Deployment Platform</div>
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Roadmap & Coming Features</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">In Progress</h3>
                  <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-500">○</span> Database integration (Supabase/PostgreSQL)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-500">○</span> User authentication system
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-yellow-500">○</span> Photo upload for ticket stubs & memories
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Planned Features</h3>
                  <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> OCR ticket scanning for automatic data extraction
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> Email import from ticket providers (Ticketmaster, StubHub)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> Social features - share lists with friends
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> Stadium check-ins and seat views
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> Game highlights and box score integration
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">○</span> Export memories as PDF scrapbook
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Future Vision</h3>
                  <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">○</span> Mobile app (React Native)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">○</span> Concert & entertainment event support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">○</span> Team/player statistics and tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">○</span> Marketplace for vintage tickets
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">○</span> AI-generated game summaries and memories
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Want to Contribute or Provide Feedback?</h2>
            <p className="text-xl mb-6 opacity-90">
              This project is being built in public. Your ideas and feedback are welcome!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/tbrown034/restub" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-orange-600 font-semibold py-3 px-8 rounded-xl hover:bg-orange-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
              <Link 
                href="/assist"
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors"
              >
                Start Using Restub
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}