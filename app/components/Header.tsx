"use client";

import { useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Restub
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <a href="#" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all duration-200">
                Home
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all duration-200">
                My Events
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all duration-200">
                Discover
              </a>
              <div className="ml-4 flex items-center space-x-2">
                <button className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-all duration-200">
                  Sign In
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
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
          <div className="px-2 pt-2 pb-6 space-y-1 bg-white/95 backdrop-blur-md rounded-xl mt-2 border border-gray-200/50 shadow-xl">
            <a href="#" className="block text-gray-600 hover:text-purple-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 transition-all duration-200">
              Home
            </a>
            <a href="#" className="block text-gray-600 hover:text-purple-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 transition-all duration-200">
              My Events
            </a>
            <a href="#" className="block text-gray-600 hover:text-purple-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 transition-all duration-200">
              Discover
            </a>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <a href="#" className="block text-gray-600 hover:text-purple-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-50 transition-all duration-200">
                Sign In
              </a>
              <button className="w-full mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;