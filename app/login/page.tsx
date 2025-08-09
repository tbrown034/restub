import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Login Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Welcome Back
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Sign in to access your sports memory collection
                </p>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="button"
                  className="w-full bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Sign In (Coming Soon)
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Sign up (Coming Soon)
                  </a>
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div>
              <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                Why Create an Account?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-10">
                Unlock the full power of ReStub by saving your sports memories to the cloud.
              </p>

              <div className="space-y-8">
                {/* Rank Your Events */}
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mr-5 mt-1">
                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Rank Your Events</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Rate and rank every game you&apos;ve attended. Create your personal &ldquo;best games ever&rdquo; list and compare experiences over time.
                    </p>
                  </div>
                </div>

                {/* Add Rich Memories */}
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-5 mt-1">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Add Rich Memories</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Write detailed notes, add photos, record who you went with, and capture all the emotions and moments that made each game special.
                    </p>
                  </div>
                </div>

                {/* Share Your Journey */}
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mr-5 mt-1">
                    <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Share Your Journey</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Share your favorite games and memories with friends, compare experiences, and build a community of fellow sports fans.
                    </p>
                  </div>
                </div>

                {/* Sync Across Devices */}
                <div className="flex items-start">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-5 mt-1">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Sync Across Devices</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Access your sports memory collection from any device. Your experiences are safely stored in the cloud and always available.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Preview */}
              <div className="mt-10 bg-gradient-to-r from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                <h4 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center">What You&apos;ll Get</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">∞</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Games Tracked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">4+</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Major Sports</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">Free</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Always Free</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">AI</div>
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Powered</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/track"
                  className="text-orange-600 hover:text-orange-700 font-semibold text-lg inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Try it out first without an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}