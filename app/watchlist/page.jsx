"use client"; // Required for client-side interactivity

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCheckCircle, 
  faList, 
  faEye, 
  faClock, 
  faTrash, 
  faShare,
  faCalendarAlt,
  faStar,
  faPlay,
  faPause
} from '@fortawesome/free-solid-svg-icons';
import { useWatchlist } from '@/app/hooks/useWatchlist';

const WatchlistPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [imageErrors, setImageErrors] = useState(new Set());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Use watchlist hook
  const { 
    watchlist, 
    stats, 
    loading, 
    removeMovie, 
    toggleMovieWatched, 
    clearAll,
    getFilteredItems,
    isAuthenticated,
    getMovieData
  } = useWatchlist();

  const filteredItems = getFilteredItems(activeFilter);
  
  // Debug logging
  console.log('🔍 Watchlist Page Debug:', {
    activeFilter,
    totalItems: watchlist.length,
    filteredItemsCount: filteredItems.length,
    isAuthenticated,
    stats
  });

  const handleClearWatchlist = () => {
    if (showConfirmClear) {
      clearAll();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
    }
  };

  // Get status display info
  const getStatusInfo = (item) => {
    if (isAuthenticated) {
      switch (item.status) {
        case 'completed':
          return { text: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: faCheckCircle };
        case 'watching':
          return { text: 'Watching', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: faPlay };
        case 'pending':
          return { text: 'To Watch', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: faClock };
        case 'abandoned':
          return { text: 'Abandoned', color: 'text-red-600', bgColor: 'bg-red-100', icon: faPause };
        default:
          return { text: 'To Watch', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: faClock };
      }
    } else {
      return item.watched 
        ? { text: 'Watched', color: 'text-green-600', bgColor: 'bg-green-100', icon: faCheckCircle }
        : { text: 'To Watch', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: faClock };
    }
  };

  // Get date info
  const getDateInfo = (item) => {
    if (isAuthenticated) {
      return {
        added: item.createdAt,
        completed: item.completedAt,
        status: item.status
      };
    } else {
      return {
        added: item.added_at,
        completed: item.watched_at,
        status: item.watched ? 'watched' : 'pending'
      };
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="gradient-bg text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Watchlist</h1>
            <p className="text-xl text-gray-100">
              {isAuthenticated 
                ? 'Your saved movies and shows synced across devices' 
                : 'Your saved movies and shows for later viewing'
              }
            </p>
            {!isAuthenticated && (
              <p className="text-sm text-gray-200 mt-2">
                <Link href="/login" className="underline hover:text-white">
                  Sign in to sync your watchlist across devices
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Watchlist Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="mb-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faList} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
                <p className="text-gray-600 dark:text-gray-400">Total Saved</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isAuthenticated ? stats.completed : stats.watched}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isAuthenticated ? 'Completed' : 'Watched'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</h3>
                <p className="text-gray-600 dark:text-gray-400">To Watch</p>
              </div>
              {isAuthenticated && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FontAwesomeIcon icon={faPlay} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.watching}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Watching</p>
                </div>
              )}
            </div>
          </div>

          {/* Filter Tabs and Actions */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
                             <button 
                 className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                   activeFilter === 'all' 
                     ? 'bg-purple-600 text-white' 
                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                 }`}
                 onClick={() => {
                   console.log('🔘 Clicked All Items filter');
                   setActiveFilter('all');
                 }}
               >
                 All Items
               </button>
                             <button 
                 className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                   activeFilter === 'watched' 
                     ? 'bg-purple-600 text-white' 
                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                 }`}
                 onClick={() => {
                   console.log('🔘 Clicked Watched/Completed filter');
                   setActiveFilter('watched');
                 }}
               >
                 {isAuthenticated ? 'Completed' : 'Watched'}
               </button>
                             <button 
                 className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                   activeFilter === 'pending' 
                     ? 'bg-purple-600 text-white' 
                     : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                 }`}
                 onClick={() => {
                   console.log('🔘 Clicked Pending filter');
                   setActiveFilter('pending');
                 }}
               >
                 To Watch
               </button>
              {isAuthenticated && (
                <>
                                     <button 
                     className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                       activeFilter === 'watching' 
                         ? 'bg-purple-600 text-white' 
                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                     }`}
                     onClick={() => {
                       console.log('🔘 Clicked Watching filter');
                       setActiveFilter('watching');
                     }}
                   >
                     Watching
                   </button>
                                     <button 
                     className={`filter-tab px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                       activeFilter === 'abandoned' 
                         ? 'bg-purple-600 text-white' 
                         : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                     }`}
                     onClick={() => {
                       console.log('🔘 Clicked Abandoned filter');
                       setActiveFilter('abandoned');
                     }}
                   >
                     Abandoned
                   </button>
                </>
              )}
            </div>
            
            {/* Clear Watchlist Button */}
            {stats.total > 0 && (
              <div className="text-center">
                <button 
                  onClick={handleClearWatchlist}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    showConfirmClear 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {showConfirmClear ? 'Click again to confirm' : 'Clear Watchlist'}
                </button>
                {showConfirmClear && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    This will permanently delete all your saved movies
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Watchlist Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your watchlist...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => {
                const movie = getMovieData(item);
                const statusInfo = getStatusInfo(item);
                const dateInfo = getDateInfo(item);
                const identifier = isAuthenticated ? item._id : item.tmdb_id;
                
                return (
                  <div key={identifier} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={imageErrors.has(movie.tmdbId || movie.tmdb_id) ? '/images/placeholder.svg' : 
                             movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 
                             '/images/placeholder.svg'} 
                        alt={movie.title} 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          setImageErrors(prev => new Set([...prev, movie.tmdbId || movie.tmdb_id]));
                          e.target.src = '/images/placeholder.svg';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <FontAwesomeIcon icon={statusInfo.icon} className="text-sm" />
                      </div>
                      <div className="absolute top-2 left-2">
                        <button 
                          onClick={() => removeMovie(identifier)}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                          title="Remove from watchlist"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{movie.title}</h3>
                      
                      {/* Status badge */}
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <FontAwesomeIcon icon={statusInfo.icon} className="mr-1" />
                        {statusInfo.text}
                      </div>
                      
                      {/* Movie details */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {movie.releaseDate && (
                          <span>{new Date(movie.releaseDate).getFullYear()}</span>
                        )}
                        {movie.releaseDate && movie.runtime && <span>•</span>}
                        {movie.runtime && <span>{movie.runtime} min</span>}
                        {movie.runtime && movie.averageRating && <span>•</span>}
                        {movie.averageRating && (
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                            {movie.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      
                      {/* Added date */}
                      {dateInfo.added && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                          Added {new Date(dateInfo.added).toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Completed date */}
                      {dateInfo.completed && (
                        <div className="flex items-center text-xs text-green-600 dark:text-green-400 mb-3">
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                          Completed {new Date(dateInfo.completed).toLocaleDateString()}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            console.log('🔘 Toggle watched button clicked');
                            console.log('🎬 Movie data:', movie);
                            console.log('📋 Item data:', item);
                            console.log('🔐 Is authenticated:', isAuthenticated);
                            console.log('🆔 Identifier:', identifier);
                            
                            // For authenticated users, we need to pass the database _id
                            // For unauthenticated users, pass the identifier (tmdb_id)
                            const toggleIdentifier = isAuthenticated ? item._id : identifier;
                            console.log('🔄 Calling toggleMovieWatched with:', toggleIdentifier);
                            
                            toggleMovieWatched(toggleIdentifier);
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors duration-300 ${
                            (isAuthenticated ? item.status === 'completed' : item.watched)
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {(isAuthenticated ? item.status === 'completed' : item.watched) 
                            ? 'Rewatch' 
                            : 'Mark as Watched'
                          }
                        </button>
                        <button 
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: movie.title,
                                text: `Check out ${movie.title} - ${movie.overview || 'A great movie!'}`,
                                url: window.location.href
                              });
                            } else {
                              navigator.clipboard.writeText(`${movie.title} - ${movie.overview || 'A great movie!'}`);
                              alert('Movie info copied to clipboard!');
                            }
                          }}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          title="Share movie"
                        >
                          <FontAwesomeIcon icon={faShare} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faList} className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your watchlist is empty</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Start saving movies and shows to your watchlist to see them here.</p>
              <Link 
                href="/" 
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