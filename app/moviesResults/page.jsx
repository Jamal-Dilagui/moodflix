"use client"; // Required for client-side interactivity

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faBookmark, 
  faShare 
} from '@fortawesome/free-solid-svg-icons';

const ResultsPage = () => {
  const [bookmarkedMovies, setBookmarkedMovies] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());

  // Static movie data
  const recommendations = [
    {
      title: "The Secret Life of Walter Mitty",
      genre: "Adventure",
      year: "2013",
      duration: "125 min",
      poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
      description: "A daydreaming office worker embarks on a real adventure.",
      moodReason: "Perfect for lifting your spirits with its inspiring journey and beautiful cinematography."
    },
    {
      title: "La La Land",
      genre: "Musical",
      year: "2016",
      duration: "128 min",
      poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
      description: "A musical romance about dreams and love in Los Angeles.",
      moodReason: "Uplifting musical numbers and feel-good romance to match your happy mood."
    },
    {
      title: "The Grand Budapest Hotel",
      genre: "Comedy",
      year: "2014",
      duration: "99 min",
      poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop",
      description: "A whimsical comedy about a legendary concierge.",
      moodReason: "Witty humor and charming characters that will keep your spirits high."
    }
  ];

  return (
    <>
      {/* Header Section */}
      <section className="gradient-bg text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Perfect Matches</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm">Happy</span>
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm">1 hour</span>
              <span className="bg-white/20 rounded-full px-4 py-2 text-sm">Alone</span>
            </div>
            <p className="text-xl text-gray-100">Based on your mood and preferences, here are some great recommendations for you.</p>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((movie, index) => (
              <div 
                key={movie.title}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={imageErrors.has(movie.title) ? '/images/placeholder.svg' : movie.poster} 
                    alt={movie.title} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      setImageErrors(prev => new Set([...prev, movie.title]));
                      e.target.src = '/images/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        bookmarkedMovies.has(movie.title)
                          ? 'text-yellow-400 bg-gray-800/90 hover:bg-gray-700/90'
                          : 'text-white/80 bg-gray-800/80 hover:bg-gray-700/80'
                      }`}
                      onClick={() => {
                        setBookmarkedMovies(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(movie.title)) {
                            newSet.delete(movie.title);
                          } else {
                            newSet.add(movie.title);
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
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                        <span>•</span>
                        <span>{movie.genre}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{movie.description}</p>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      <strong>Why it fits your mood:</strong> {movie.moodReason}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        bookmarkedMovies.has(movie.title)
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      }`}
                      onClick={() => {
                        setBookmarkedMovies(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(movie.title)) {
                            newSet.delete(movie.title);
                          } else {
                            newSet.add(movie.title);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faBookmark} className="mr-2" />
                      {bookmarkedMovies.has(movie.title) ? 'Saved!' : 'Save to Watchlist'}
                    </button>
                    <button 
                      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: movie.title,
                            text: `Check out ${movie.title} - ${movie.description}`,
                            url: window.location.href
                          });
                        } else {
                          // Fallback: copy to clipboard
                          navigator.clipboard.writeText(`${movie.title} - ${movie.description}`);
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