"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
export default function AddMethodsPage() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section - More Compact */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3">
              How would you like to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400">
                add your games?
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pick the method that works best for you
            </p>
          </div>

          {/* Three Options Grid - Smaller, More Consistent */}
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mb-16 max-w-5xl mx-auto">
            {/* AI Assist Option */}
            <div className="group relative">
              <div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-400 dark:hover:border-orange-500 overflow-hidden">
                {/* Recommended Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold">
                    RECOMMENDED
                  </span>
                </div>
                
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Icon name="sparkles" className="text-white" size="md" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    AI Assist
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Tell us what you remember and our AI finds the game
                  </p>
                  
                  {/* Features - Compact */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Works with partial memories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Auto-fills game details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">No ticket needed</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    href="/assist"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <Icon name="sparkles" size="xs" />
                    Tell Us What You Know
                  </Link>
                </div>
              </div>
            </div>

            {/* Upload Ticket Option */}
            <div className="group relative">
              <div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 overflow-hidden">
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Upload Ticket
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Snap a photo of your ticket for instant detection
                  </p>
                  
                  {/* Features - Compact */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Physical or digital tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">OCR text extraction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Bulk upload support</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-400 dark:bg-gray-600 text-white text-sm font-semibold rounded-lg cursor-not-allowed opacity-75"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            {/* Email Connect Option */}
            <div className="group relative">
              <div className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-400/50 dark:hover:border-orange-500/50 overflow-hidden">
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Connect Email
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Auto-import games from ticket confirmations
                  </p>
                  
                  {/* Features - Compact */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Gmail, Outlook, Yahoo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Secure OAuth connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-500 flex-shrink-0" size="xs" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Auto-sync new tickets</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-400 dark:bg-gray-600 text-white text-sm font-semibold rounded-lg cursor-not-allowed opacity-75"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section - More Compact */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Why log your games?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Every game tells a story. Start building your personal sports history.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Icon name="trophy" className="text-orange-600 dark:text-orange-400" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Track Milestones</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">First games, championships, historic moments</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gray-100 dark:bg-gray-800/30 flex items-center justify-center">
                  <Icon name="stadium" className="text-gray-600 dark:text-gray-400" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Stadium Collection</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Build your map of visited venues</p>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Icon name="sparkles" className="text-orange-600 dark:text-orange-400" size="sm" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">Share Memories</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Relive games with friends and family</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}