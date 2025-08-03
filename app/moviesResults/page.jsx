"use client"; // Required for client-side interactivity

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBookmark, 
  faShare,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useTmdb, useMovieState } from '@/app/hooks/useTmdb';

const ResultsPage = () => {
  const [bookmarkedMovies, setBookmarkedMovies] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const [userPreferences, setUserPreferences] = useState(null);

  const { getRecommendations, loading, error } = useTmdb();
  const { movies, updateMovies } = useMovieState();

  // Get user preferences from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get('mood') || localStorage.getItem('userMood');
    const timeAvailable = urlParams.get('time') || localStorage.getItem('userTime');
    const situation = urlParams.get('situation') || localStorage.getItem('userSituation');

    if (mood && timeAvailable && situation) {
      setUserPreferences({ mood, timeAvailable, situation });
      fetchRecommendations(mood, timeAvailable, situation);
    }
  }, []);

  const fetchRecommendations = async (mood, timeAvailable, situation) => {
    try {
      const results = await getRecommendations(mood, timeAvailable, situation);
      updateMovies(results.results || [], results.page, results.totalPages, results.totalResults);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  // Generate mood reason based on user preferences
  const generateMoodReason = (movie, userMood) => {
    const moodReasons = {
      happy: `Perfect for lifting your spirits with its ${movie.overview?.toLowerCase().includes('comedy') ? 'humor' : 'uplifting story'}.`,
      sad: `A touching story that will resonate with your current mood and provide comfort.`,
      excited: `High-energy content that matches your excitement and keeps you engaged.`,
      relaxed: `A calming experience perfect for your relaxed state of mind.`,
      romantic: `Beautiful romance that will enhance your romantic mood.`,
      adventurous: `An exciting adventure that matches your adventurous spirit.`,
      nostalgic: `A story that will take you back and provide comforting nostalgia.`,
      inspired: `An inspiring tale that will motivate and uplift your spirits.`
    };
    
    return moodReasons[userMood] || "A great choice for your current mood and preferences.";
  };

  return (
    <>
      {/* Header Section */}
      <section className="gradient-bg text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Perfect Matches</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {userPreferences && (
                <>
                  <span className="bg-white/20 rounded-full px-4 py-2 text-sm capitalize">{userPreferences.mood}</span>
                  <span className="bg-white/20 rounded-full px-4 py-2 text-sm">{userPreferences.timeAvailable}</span>
                  <span className="bg-white/20 rounded-full px-4 py-2 text-sm capitalize">{userPreferences.situation}</span>
                </>
              )}
            </div>
            <p className="text-xl text-gray-100">Based on your mood and preferences, here are some great recommendations for you.</p>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-600 animate-spin mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300">Finding perfect movies for you...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-lg text-red-600 dark:text-red-400 mb-4">Failed to load recommendations</p>
              <button 
                onClick={() => userPreferences && fetchRecommendations(userPreferences.mood, userPreferences.timeAvailable, userPreferences.situation)}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">No movies found for your preferences</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {movies.map((movie, index) => (
                              <div 
                  key={movie.id || movie.title}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img 
                      src={imageErrors.has(movie.id) ? '/images/placeholder.svg' : movie.poster} 
                      alt={movie.title} 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        setImageErrors(prev => new Set([...prev, movie.id]));
                        e.target.src = '/images/placeholder.svg';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        className={`p-2 rounded-full transition-colors ${
                          bookmarkedMovies.has(movie.id)
                            ? 'text-yellow-400 bg-gray-800/90 hover:bg-gray-700/90'
                            : 'text-white/80 bg-gray-800/80 hover:bg-gray-700/80'
                        }`}
                        onClick={() => {
                          setBookmarkedMovies(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(movie.id)) {
                              newSet.delete(movie.id);
                            } else {
                              newSet.add(movie.id);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faBookmark} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          {movie.year && <span>{movie.year}</span>}
                          {movie.year && movie.duration && <span>•</span>}
                          {movie.duration && <span>{movie.duration}</span>}
                          {movie.duration && movie.rating && <span>•</span>}
                          {movie.rating && <span>⭐ {movie.rating.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{movie.overview || movie.description}</p>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        <strong>Why it fits your mood:</strong> {generateMoodReason(movie, userPreferences?.mood)}
                      </p>
                    </div>
                                      <div className="flex space-x-3">
                      <button 
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                          bookmarkedMovies.has(movie.id)
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        }`}
                        onClick={() => {
                          setBookmarkedMovies(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(movie.id)) {
                              newSet.delete(movie.id);
                            } else {
                              newSet.add(movie.id);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                        {bookmarkedMovies.has(movie.id) ? 'Saved!' : 'Save to Watchlist'}
                      </button>
                      <button 
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: movie.title,
                              text: `Check out ${movie.title} - ${movie.overview || movie.description}`,
                              url: window.location.href
                            });
                          } else {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(`${movie.title} - ${movie.overview || movie.description}`);
                            alert('Movie info copied to clipboard!');
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faShare} className="mr-2" />
                        Share
                      </button>
                    </div>
                                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Try Again Section */}
      <section className="py-12 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Not quite what you're looking for?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Try different mood, time, or situation combinations to discover more options.</p>
          <Link href="/" className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Try Again</span>
          </Link>
        </div>
      </section>
    </>
  );
};

export default ResultsPage;