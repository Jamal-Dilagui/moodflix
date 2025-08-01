"use client"; // Required for client-side interactivity

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheckCircle, faList, faEye, faClock } from '@fortawesome/free-solid-svg-icons';

const WatchlistPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Sample data - replace with your actual data fetching logic
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setWatchlistItems([
        { id: 1, title: 'Inception', year: 2010, watched: true, image: '/images/placeholder.svg' },
        { id: 2, title: 'Interstellar', year: 2014, watched: false, image: '/images/placeholder.svg' },
        { id: 3, title: 'The Dark Knight', year: 2008, watched: true, image: '/images/placeholder.svg' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredItems = watchlistItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'watched') return item.watched;
    if (activeFilter === 'pending') return !item.watched;
    return true;
  });

  const totalCount = watchlistItems.length;
  const watchedCount = watchlistItems.filter(item => item.watched).length;
  const pendingCount = totalCount - watchedCount;

  return (
    <>
      {/* Header Section */}
      <section className="gradient-bg text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Watchlist</h1>
            <p className="text-xl text-gray-100">Your saved movies and shows for later viewing</p>
          </div>
        </div>
      </section>

      {/* Watchlist Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="mb-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faList} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalCount}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Saved</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{watchedCount}</h3>
                <p className="text-gray-600 dark:text-gray-400">Watched</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</h3>
                <p className="text-gray-600 dark:text-gray-400">To Watch</p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('all')}
              >
                All Items
              </button>
              <button 
                className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === 'watched' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('watched')}
              >
                Watched
              </button>
              <button 
                className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === 'pending' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFilter('pending')}
              >
                To Watch
              </button>
            </div>
          </div>

          {/* Watchlist Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your watchlist...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={imageErrors.has(item.id) ? '/images/placeholder.svg' : item.image} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        setImageErrors(prev => new Set([...prev, item.id]));
                        e.target.src = '/images/placeholder.svg';
                      }}
                    />
                    {item.watched && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.year}</p>
                    <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors duration-300">
                      {item.watched ? 'Rewatch' : 'Mark as Watched'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faList} className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your watchlist is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Start saving movies and shows to your watchlist to see them here.</p>
              <Link 
                href="/recommendations" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Get Recommendations</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default WatchlistPage;