import Link from "next/link";
import FunInteractives from "./FunInteractives";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center py-8 sm:py-20 px-4 sm:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Simple background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-orange-200 dark:bg-orange-500/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-200 dark:bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center w-full">
        {/* Main heading */}
        <div className="mb-12">
          <h1 className="text-6xl sm:text-8xl font-bold mb-4">
            <span className="text-orange-600">ReStub</span>
          </h1>
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            Your Sports
          </h2>
          <h3 className="text-3xl sm:text-5xl font-bold text-blue-600">
            Memory Keeper
          </h3>
        </div>

        {/* Subtitle */}
        <div className="mb-16 max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 px-4">
            Never forget that incredible game experience. 
            <span className="text-orange-600 font-semibold"> Log the games</span> you attend, 
            <span className="text-blue-600 font-semibold"> build your collection</span>, and 
            <span className="text-green-600 font-semibold"> preserve your stadium memories</span> in one place.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
          <Link
            href="/track"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:scale-105 transition-all flex items-center justify-center"
          >
            Start Logging
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

        </div>

        {/* Ticket-Style Feature Cards */}
        <div className="max-w-7xl mx-auto mb-12 sm:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4">
            {/* Log Your Games Ticket */}
            <Link
              href="/track"
              className="group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-slate-700/60 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 active:scale-100 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • LOG YOUR GAMES
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 sm:top-10 bottom-0 w-6 sm:w-8 bg-orange-50 dark:bg-orange-900/10 border-l-2 border-dashed border-orange-300 dark:border-orange-700">
                  <div className="text-orange-600 dark:text-orange-400 transform rotate-90 text-xs font-mono mt-12 sm:mt-16 whitespace-nowrap">
                    001
                  </div>
                </div>
                <div className="p-4 sm:p-6 pr-8 sm:pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">
                    Log Your Games
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
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
              href="/catalog"
              className="group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 active:scale-100 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • SMART TRACKING
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 sm:top-10 bottom-0 w-6 sm:w-8 bg-blue-50 dark:bg-blue-900/10 border-l-2 border-dashed border-blue-300 dark:border-blue-700">
                  <div className="text-blue-600 dark:text-blue-400 transform rotate-90 text-xs font-mono mt-12 sm:mt-16 whitespace-nowrap">
                    002
                  </div>
                </div>
                <div className="p-4 sm:p-6 pr-8 sm:pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">
                    Fill In The Gaps
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
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
              className="group relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-slate-700/60 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 active:scale-100 overflow-hidden transform hover:-translate-y-1"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold tracking-wider">
                  RESTUB • ORGANIZE & SHARE
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 sm:top-10 bottom-0 w-6 sm:w-8 bg-green-50 dark:bg-green-900/10 border-l-2 border-dashed border-green-300 dark:border-green-700">
                  <div className="text-green-600 dark:text-green-400 transform rotate-90 text-xs font-mono mt-12 sm:mt-16 whitespace-nowrap">
                    003
                  </div>
                </div>
                <div className="p-4 sm:p-6 pr-8 sm:pr-12">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 sm:mb-3">
                    Organize & Share
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm sm:text-base mb-4 leading-relaxed">
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

        {/* Stats/Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-600 dark:text-slate-400">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Built with Next.js 15</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">React 19 + TypeScript</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-semibold">GPT-5 Powered</span>
          </div>
        </div>
      </div>
      
      <FunInteractives />
    </section>
  );
};

export default Hero;
