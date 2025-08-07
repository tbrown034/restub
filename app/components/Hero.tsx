import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-7xl mx-auto text-center">
        {/* Main heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-8 sm:mb-10 leading-tight tracking-tight">
          <span className="text-orange-600 block">ReStub</span>
          <span className="text-gray-800 block">Your Sports</span>
          <span className="text-blue-600 block">Memory Keeper</span>
        </h1>

        {/* Balanced Subtitle */}
        <div className="mb-10 max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl text-gray-600 leading-relaxed font-medium text-center">
            Never forget that incredible game experience.
            <a
              href="/log"
              className="text-orange-600 hover:text-orange-700 font-semibold border-b border-orange-300 hover:border-orange-500 transition-all duration-200 mx-1"
            >
              log the games
            </a>
            you attend,
            <a
              href="/catalog"
              className="text-blue-600 hover:text-blue-700 font-semibold border-b border-blue-300 hover:border-blue-500 transition-all duration-200 mx-1"
            >
              build your collection
            </a>
            and
            <a
              href="/memories"
              className="text-green-600 hover:text-green-700 font-semibold border-b border-green-300 hover:border-green-500 transition-all duration-200 mx-1"
            >
              preserve and share your stadium memories
            </a>
            in one place.
          </h2>
        </div>

        {/* CTA Buttons - Refined */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/track"
            className="group relative bg-orange-600 border border-orange-700 text-white font-semibold py-3 px-8 rounded-xl text-base transition-all duration-300 hover:bg-orange-700 hover:shadow-lg inline-block text-center"
          >
            <span className="relative z-10 flex items-center justify-center">
              Start Logging
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="/demo"
            className="group relative bg-white border border-gray-300 hover:border-purple-400 text-gray-700 hover:text-purple-700 font-semibold py-3 px-8 rounded-xl text-base transition-all duration-300 hover:shadow-lg hover:bg-purple-50"
          >
            <span className="flex items-center justify-center">
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              View Demo
            </span>
          </Link>
        </div>

        {/* Ticket-Style Feature Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Log Your Games Ticket */}
            <a
              href="/track"
              className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-orange-600 text-white px-6 py-2 text-xs font-bold tracking-wider">
                  RESTUB • LOG YOUR GAMES
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 bottom-0 w-8 bg-orange-50 border-l-2 border-dashed border-orange-300">
                  <div className="text-orange-600 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    001
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Log Your Games
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Record every stadium visit with detailed game info, scores, and memorable moments
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>ADMIT ONE</span>
                    <span>SECTION: TRACK</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Smart Memory Assistant */}
            <a
              href="/ai-help"
              className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-blue-600 text-white px-6 py-2 text-xs font-bold tracking-wider">
                  RESTUB • SMART MEMORY ASSISTANT
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 bottom-0 w-8 bg-blue-50 border-l-2 border-dashed border-blue-300">
                  <div className="text-blue-600 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    002
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Fill In The Gaps With AI
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Import game details from your email and get intelligent suggestions to enhance your memories
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>ADMIT ONE</span>
                    <span>SECTION: ENHANCE</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Organize & Share */}
            <a
              href="/login"
              className="group relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <div className="relative">
                {/* Header stripe */}
                <div className="bg-green-600 text-white px-6 py-2 text-xs font-bold tracking-wider">
                  RESTUB • ORGANIZE & SHARE
                </div>
                {/* Perforated edge effect */}
                <div className="absolute right-0 top-8 bottom-0 w-8 bg-green-50 border-l-2 border-dashed border-green-300">
                  <div className="text-green-600 transform rotate-90 text-xs font-mono mt-16 whitespace-nowrap">
                    003
                  </div>
                </div>
                <div className="p-6 pr-12">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Organize & Share
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Build your personal sports collection and share epic moments with fellow fans
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                    <span>ADMIT MANY</span>
                    <span>SECTION: CONNECT</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Stats/Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600 font-medium">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-3">
              <div className="w-8 h-8 bg-orange-500 border-2 border-orange-600 rounded-full"></div>
              <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded-full"></div>
              <div className="w-8 h-8 bg-purple-600 border-2 border-purple-700 rounded-full"></div>
            </div>
            <span>Join 10,000+ sports fans tracking games</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-500 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>4.9/5 from early users</span>
          </div>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-orange-500 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Stadium Memories Preserved</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
