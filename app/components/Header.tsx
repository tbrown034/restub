"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icon";

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
    { href: "/assist", label: "Log Games" },
    { href: "/profile", label: "My Profile" },
    { href: "/about", label: "About" },
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
        <div className="mx-4 sm:mx-6 lg:mx-8">
          <div className="flex items-center h-14 sm:h-16">
            {/* Logo - Fixed Width */}
            <div className="flex-shrink-0">
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
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2 py-1 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions - Fixed Width */}
            <div className="flex-shrink-0 hidden md:flex items-center gap-3">
              <ThemeToggle />
              {/* Sign In button - commented out for now
              <button
                disabled
                className="relative text-slate-400 dark:text-slate-500 px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                Sign In
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">Soon</span>
              </button>
              */}
              {/* Add Game button - hidden on medium, shown on large */}
              <Link
                href="/assist"
                className="hidden lg:block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                Add Game
              </Link>
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="flex items-center gap-3 md:hidden">
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
            className="absolute top-12 sm:top-14 right-0 left-0 bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="px-4 py-4 space-y-1 max-w-md mx-auto">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-orange-600 dark:hover:text-orange-400"
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
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="px-3 py-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
                    Quick Actions
                  </p>
                </div>
                <Link
                  href="/add-methods"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <Icon name="pin" className="text-orange-500" size="sm" />
                  <span>Add Methods</span>
                </Link>
                <Link
                  href="/assist"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  <Icon name="document" className="text-blue-500" size="sm" />
                  <span>Add Experience</span>
                </Link>
              </div>

              {/* Add Game CTA */}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                {/* Sign In link - commented out for now
                <Link
                  href="/login"
                  className="block text-center text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  Sign In
                </Link>
                */}
                <Link
                  href="/assist"
                  className="block text-center bg-orange-600 hover:bg-orange-700 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
                >
                  Add Game
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