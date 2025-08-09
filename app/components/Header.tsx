"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Log Games" },
    { href: "/profile", label: "My Profile" },
    { href: "/demo", label: "Demo" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-orange-200 dark:border-orange-900/50"
            : "bg-gradient-to-r from-orange-50/90 to-blue-50/90 dark:from-slate-900/90 dark:to-slate-800/90 backdrop-blur-sm border-b border-orange-100 dark:border-slate-700"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                {/* Subtle pulse indicator */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl opacity-20 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors leading-tight">
                  Restub
                </h1>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block lg:text-sm">
                  Your Sports Memory Keeper
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive(link.href)
                      ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20"
                      : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/catalog"
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />

              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                }`}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-6 h-6 relative">
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 top-3" : "top-1.5"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 top-3 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 top-3" : "top-[18px]"
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Mobile Menu Panel */}
          <div
            className="absolute top-16 right-0 left-0 bg-gradient-to-b from-orange-50/95 to-blue-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-md border-b border-orange-200/50 dark:border-slate-700/50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="px-4 py-6 space-y-1 max-w-md mx-auto">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 shadow-sm border border-orange-200 dark:border-orange-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-orange-600 dark:hover:text-orange-400"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>{link.label}</span>
                  {isActive(link.href) && (
                    <div className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></div>
                  )}
                </Link>
              ))}

              {/* Additional Mobile Menu Items */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Quick Actions
                  </p>
                </div>
                <Link
                  href="/track"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <span className="text-xl w-8 text-center">📍</span>
                  <span>Track Game</span>
                </Link>
                <Link
                  href="/catalog"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <span className="text-xl w-8 text-center">📝</span>
                  <span>Add Experience</span>
                </Link>
              </div>

              {/* Sign In / Get Started */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <Link
                  href="/login"
                  className="block text-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-4 py-3 rounded-xl font-medium hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/catalog"
                  className="block text-center bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;