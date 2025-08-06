"use client";

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-transparent backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-sm border border-orange-700">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold text-orange-600">
                Restub
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <Link href="/" className="text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all duration-200">
                Home
              </Link>
              <Link href="/catalog" className="text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all duration-200">
                Log Games
              </Link>
              <Link href="/profile" className="text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all duration-200">
                My Profile
              </Link>
              <Link href="/demo" className="text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all duration-200">
                Demo
              </Link>
              <div className="ml-4 flex items-center space-x-2">
                <Link href="/login" className="text-slate-600 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all duration-200">
                  Sign In
                </Link>
                <Link href="/catalog" className="bg-orange-600 border-2 border-orange-700 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
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

        {/* Mobile dropdown menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-6 space-y-1 bg-white/95 backdrop-blur-md rounded-xl mt-2 border border-slate-200/50 shadow-xl">
            <Link href="/" className="block text-slate-600 hover:text-orange-600 px-4 py-3 rounded-lg text-base font-semibold hover:bg-orange-50 transition-all duration-200">
              Home
            </Link>
            <Link href="/catalog" className="block text-slate-600 hover:text-orange-600 px-4 py-3 rounded-lg text-base font-semibold hover:bg-orange-50 transition-all duration-200">
              Log Games
            </Link>
            <Link href="/profile" className="block text-slate-600 hover:text-orange-600 px-4 py-3 rounded-lg text-base font-semibold hover:bg-orange-50 transition-all duration-200">
              My Profile
            </Link>
            <Link href="/demo" className="block text-slate-600 hover:text-orange-600 px-4 py-3 rounded-lg text-base font-semibold hover:bg-orange-50 transition-all duration-200">
              Demo
            </Link>
            <div className="border-t border-slate-200 pt-4 mt-4">
              <Link href="/login" className="block text-slate-600 hover:text-orange-600 px-4 py-3 rounded-lg text-base font-semibold hover:bg-orange-50 transition-all duration-200">
                Sign In
              </Link>
              <Link href="/catalog" className="block w-full mt-2 bg-orange-600 border-2 border-orange-700 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-orange-700 transition-all duration-200 shadow-lg text-center">
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