"use client";

import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Icon from "../components/Icon";
import { useState } from "react";

export default function TrackPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <Icon name="sparkles" className="text-orange-600 dark:text-orange-400" size="sm" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Choose Your Method</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4">
              How would you like to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400">
                add your games?
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've made it easy to log your stadium memories. Pick the method that works best for you.
            </p>
          </div>

          {/* Three Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {/* AI Assist Option */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600 overflow-hidden">
                {/* Recommended Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold">
                    <Icon name="rocket" size="xs" />
                    RECOMMENDED
                  </span>
                </div>
                
                <div className="p-8 pb-32">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon name="sparkles" className="text-white" size="lg" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    AI Assist
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Tell us what you remember and our AI will find the exact game
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Works with partial memories</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Finds scores & stats automatically</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">No ticket needed</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent">
                  <Link
                    href="/assist"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Icon name="sparkles" size="sm" />
                    Start with AI
                  </Link>
                </div>
              </div>
            </div>

            {/* Upload Ticket Option */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden">
                <div className="p-8 pb-32">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Upload Ticket
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Snap a photo or upload your ticket stub for instant game detection
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Physical or digital tickets</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">OCR text extraction</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Bulk upload multiple tickets</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent">
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-400 dark:bg-gray-600 text-white font-semibold rounded-xl cursor-not-allowed opacity-75"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>

            {/* Email Connect Option */}
            <div 
              className="group relative"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden">
                <div className="p-8 pb-32">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Connect Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Auto-import games from your email ticket confirmations
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gmail, Outlook, Yahoo support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Secure OAuth connection</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="check" className="text-green-500 mt-0.5 flex-shrink-0" size="sm" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Auto-sync new tickets</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent">
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-400 dark:bg-gray-600 text-white font-semibold rounded-xl cursor-not-allowed opacity-75"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Why log your games?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Every game tells a story. Start building your personal sports history today.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Icon name="trophy" className="text-orange-600 dark:text-orange-400" size="md" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Milestones</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">First games, championships, historic moments</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Icon name="stadium" className="text-blue-600 dark:text-blue-400" size="md" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Stadium Collection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Build your map of visited venues</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Icon name="sparkles" className="text-purple-600 dark:text-purple-400" size="md" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share Memories</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Relive games with friends and family</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}