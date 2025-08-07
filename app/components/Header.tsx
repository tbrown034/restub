"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-purple-200/60 dark:border-gray-700/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm border border-orange-700">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                Restub
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                Home
              </Link>
              <Link href="/catalog" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                Log Games
              </Link>
              <Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                My Profile
              </Link>
              <Link href="/demo" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                Demo
              </Link>
              <div className="ml-4 flex items-center space-x-2">
                <ThemeToggle />
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                  Sign In
                </Link>
                <Link href="/catalog" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 relative">
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'}`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out translate-y-2 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 translate-y-2' : 'translate-y-4'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-6 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl mt-2 border border-purple-200/50 dark:border-gray-700/50 shadow-xl">
            <Link href="/" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg text-base font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
              Home
            </Link>
            <Link href="/catalog" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg text-base font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
              Log Games
            </Link>
            <Link href="/profile" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg text-base font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
              My Profile
            </Link>
            <Link href="/demo" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg text-base font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
              Demo
            </Link>
            <div className="border-t border-purple-200 dark:border-gray-700 pt-4 mt-4">
              <Link href="/login" className="block text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-lg text-base font-semibold hover:bg-purple-50 dark:hover:bg-gray-800 transition-all duration-200">
                Sign In
              </Link>
              <Link href="/catalog" className="block w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg text-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;