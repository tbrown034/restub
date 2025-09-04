import Link from "next/link";
import FunInteractives from "./FunInteractives";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center py-16 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/10 dark:to-orange-800/5 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/10 dark:to-blue-800/5 rounded-full blur-3xl opacity-60"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center w-full">
        {/* Main heading with better typography */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              ReStub
            </span>
          </h1>
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100">
              Your Sports
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 bg-clip-text text-transparent">
                Memory Keeper
              </span>
            </h3>
          </div>
        </div>

        {/* Cleaner subtitle */}
        <div className="mb-12 max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Never forget that incredible game experience.
          </p>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-3">
            Log the games you attend • Build your collection • Preserve your stadium memories
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
          <Link
            href="/track"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Games
          </Link>
          
          <Link
            href="/about"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:border-orange-500 dark:hover:border-orange-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </Link>
        </div>

        {/* Ticket-Style Feature Cards - RESTORED */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4">
            {/* Log Your Games Ticket */}
            <Link
              href="/track"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • LOG YOUR GAMES
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-10 bottom-0 w-8 bg-gray-50 dark:bg-gray-900/20 border-l-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-gray-400 dark:text-gray-500 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    001
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Log Your Games
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                    Record every stadium visit with detailed game info, scores, and memorable moments
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span>ADMIT ONE</span>
                    <span className="hidden sm:inline">SECTION: TRACK</span>
                    <span className="sm:hidden">TRACK</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Smart Memory Assistant */}
            <Link
              href="/assist"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • SMART TRACKING
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-10 bottom-0 w-8 bg-gray-50 dark:bg-gray-900/20 border-l-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-gray-400 dark:text-gray-500 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    002
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Fill In The Gaps
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                    Get intelligent suggestions and automatically fill in game details to enhance your memories
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span>ADMIT ONE</span>
                    <span className="hidden sm:inline">SECTION: ENHANCE</span>
                    <span className="sm:hidden">ENHANCE</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Organize & Share */}
            <Link
              href="/profile"
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • ORGANIZE & SHARE
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-10 bottom-0 w-8 bg-gray-50 dark:bg-gray-900/20 border-l-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-gray-400 dark:text-gray-500 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    003
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                    Organize & Share
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4 leading-relaxed">
                    Build your personal sports collection and share epic moments with fellow fans
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
                    <span>ADMIT MANY</span>
                    <span className="hidden sm:inline">SECTION: CONNECT</span>
                    <span className="sm:hidden">CONNECT</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Tech Stack - Simple and Clean */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-500 dark:text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Built with Next.js 15</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>React 19 + TypeScript</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
      
      <FunInteractives />
    </section>
  );
};

export default Hero;