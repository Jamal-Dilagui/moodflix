"use client"; // Required for interactivity and hooks

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faSun, faMoon, faBars, faTimes, faHome, faHeart, faUser, faBookmark } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const { data: session, status } = useSession();
  
  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <nav className="top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Link href="/">
                  <FontAwesomeIcon icon={faFilm} className="w-4 h-4 text-white" />
                </Link>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoodFlix
              </span>
            </div>
            
            {/* Loading indicator */}
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Get watchlist count
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const watchlist = localStorage.getItem('moodflix_watchlist');
        if (watchlist) {
          const items = JSON.parse(watchlist);
          setWatchlistCount(items.length);
        }
      } catch (error) {
        console.error('Error reading watchlist count:', error);
      }
    }
  }, []);
 
  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedMode !== null) {
        setDarkMode(JSON.parse(savedMode));
      } else if (prefersDark) {
        setDarkMode(true);
      }
    }
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Link href="/">
                <FontAwesomeIcon icon={faFilm} className="w-4 h-4 text-white" />
              </Link>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoodFlix
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              href="/recommend" 
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
              <span>Recommendations</span>
            </Link>
            {session && (
              <>
                            <Link 
              href="/watchlist" 
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative"
            >
              <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </Link>
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* Right side - Dark mode toggle and auth */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              <FontAwesomeIcon 
                icon={darkMode ? faSun : faMoon} 
                className="w-5 h-5" 
              />
            </button>
            
            {session ? (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Welcome, {session.user?.firstName || session.user?.name?.split(' ')[0] || 'User'} {session.user?.lastName || session.user?.name?.split(' ').slice(1).join(' ') || ''}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon 
                icon={isMenuOpen ? faTimes : faBars} 
                className="w-5 h-5" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 rounded-lg mt-2 shadow-lg">
              <Link 
                href="/" 
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                href="/recommend" 
                className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={closeMenu}
              >
                <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                <span>Recommendations</span>
              </Link>
              {session && (
                <>
                  <Link 
                    href="/watchlist" 
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors relative"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
                    <span>Watchlist</span>
                    {watchlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-1">
                        {watchlistCount > 99 ? '99+' : watchlistCount}
                      </span>
                    )}
                  </Link>
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                      Welcome, {session.user?.firstName || session.user?.name?.split(' ')[0] || 'User'} {session.user?.lastName || session.user?.name?.split(' ').slice(1).join(' ') || ''}
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        closeMenu();
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
              {!session && (
                <Link
                  href="/login"
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;