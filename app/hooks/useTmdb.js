import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for TMDb API interactions
 * Provides clean, reusable functions for movie data fetching
 */
export function useTmdb() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generic API call function with error handling
   */
  const apiCall = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search movies by query
   */
  const searchMovies = useCallback(async (query, page = 1) => {
    const url = `/api/movies/search?q=${encodeURIComponent(query)}&page=${page}`;
    return apiCall(url);
  }, [apiCall]);

  /**
   * Get popular movies
   */
  const getPopularMovies = useCallback(async (page = 1) => {
    const url = `/api/movies/popular?page=${page}`;
    return apiCall(url);
  }, [apiCall]);

  /**
   * Get movies by mood
   */
  const getMoviesByMood = useCallback(async (mood, page = 1) => {
    const url = `/api/movies/mood?mood=${encodeURIComponent(mood)}&page=${page}`;
    return apiCall(url);
  }, [apiCall]);

  /**
   * Get movie details by ID
   */
  const getMovieDetails = useCallback(async (movieId) => {
    const url = `/api/movies/${movieId}`;
    return apiCall(url);
  }, [apiCall]);

  /**
   * Get movie recommendations based on mood and preferences
   */
  const getRecommendations = useCallback(async (mood, timeAvailable, situation, page = 1) => {
    // Combine mood with time and situation for better recommendations
    let enhancedMood = mood;
    
    if (timeAvailable === 'short' && mood === 'excited') {
      enhancedMood = 'action'; // Prefer action movies for short time
    } else if (timeAvailable === 'long' && mood === 'relaxed') {
      enhancedMood = 'drama'; // Prefer drama for longer sessions
    }

    const url = `/api/movies/mood?mood=${encodeURIComponent(enhancedMood)}&page=${page}`;
    return apiCall(url);
  }, [apiCall]);

  return {
    loading,
    error,
    searchMovies,
    getPopularMovies,
    getMoviesByMood,
    getMovieDetails,
    getRecommendations,
  };
}

/**
 * Hook for managing movie state
 */
export function useMovieState() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const updateMovies = useCallback((newMovies, page = 1, totalPages = 0, totalResults = 0) => {
    setMovies(newMovies);
    setCurrentPage(page);
    setTotalPages(totalPages);
    setTotalResults(totalResults);
  }, []);

  const appendMovies = useCallback((newMovies, page = 1) => {
    setMovies(prev => [...prev, ...newMovies]);
    setCurrentPage(page);
  }, []);

  const clearMovies = useCallback(() => {
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
  }, []);

  return {
    movies,
    currentPage,
    totalPages,
    totalResults,
    updateMovies,
    appendMovies,
    clearMovies,
  };
}

/**
 * Hook for movie search with debouncing
 */
export function useMovieSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const { searchMovies } = useTmdb();

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(null);

      try {
        const results = await searchMovies(searchQuery);
        setSearchResults(results.results || []);
      } catch (err) {
        setSearchError(err.message);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchMovies]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    searchError,
  };
} 