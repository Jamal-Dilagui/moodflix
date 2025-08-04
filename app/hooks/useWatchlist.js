import { useState, useEffect, useCallback } from 'react';
import { 
  getWatchlist, 
  addToWatchlist, 
  removeFromWatchlist, 
  toggleWatched, 
  isInWatchlist, 
  getWatchlistStats,
  clearWatchlist 
} from '@/app/lib/watchlist';

/**
 * Custom hook for managing watchlist state and operations
 * @returns {Object} Watchlist state and functions
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    watched: 0, 
    pending: 0, 
    watching: 0,
    abandoned: 0,
    completedPercentage: 0 
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, []);

  // Load watchlist data
  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading watchlist...');
      
      const items = await getWatchlist();
      console.log('📋 Loaded watchlist items:', items);
      console.log('📊 Items count:', items.length);
      
      if (items.length > 0) {
        console.log('🎬 First item:', items[0]);
        console.log('🎬 First item status:', items[0].status);
        console.log('🎬 First item movieId:', items[0].movieId);
      }
      
      const watchlistStats = await getWatchlistStats();
      console.log('📊 Loaded watchlist stats:', watchlistStats);
      
      setWatchlist(items);
      setStats(watchlistStats);
      
      // Check authentication status
      const authStatus = await checkAuthStatus();
      console.log('🔐 Authentication status:', authStatus);
      setIsAuthenticated(authStatus);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (!response.ok) return false;
      const session = await response.json();
      return !!session?.user?.id;
    } catch (error) {
      return false;
    }
  }, []);

  // Add movie to watchlist
  const addMovie = useCallback(async (movie) => {
    try {
      const success = await addToWatchlist(movie);
      if (success) {
        await loadWatchlist(); // Reload to get updated data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      return false;
    }
  }, [loadWatchlist]);

  // Remove movie from watchlist
  const removeMovie = useCallback(async (identifier) => {
    try {
      const success = await removeFromWatchlist(identifier);
      if (success) {
        await loadWatchlist(); // Reload to get updated data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      return false;
    }
  }, [loadWatchlist]);

  // Toggle watched status
  const toggleMovieWatched = useCallback(async (identifier) => {
    try {
      console.log('🔄 useWatchlist: toggleMovieWatched called with identifier:', identifier);
      const success = await toggleWatched(identifier);
      console.log('✅ useWatchlist: toggleWatched result:', success);
      
      if (success) {
        console.log('🔄 useWatchlist: Reloading watchlist after successful toggle');
        await loadWatchlist(); // Reload to get updated data
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ useWatchlist: Error toggling watched status:', error);
      return false;
    }
  }, [loadWatchlist]);

  // Check if movie is in watchlist
  const checkIsInWatchlist = useCallback(async (tmdbId) => {
    try {
      return await isInWatchlist(tmdbId);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }, []);

  // Clear all watchlist items
  const clearAll = useCallback(async () => {
    try {
      const success = await clearWatchlist();
      if (success) {
        setWatchlist([]);
        setStats({ 
          total: 0, 
          watched: 0, 
          pending: 0, 
          watching: 0,
          abandoned: 0,
          completedPercentage: 0 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      return false;
    }
  }, []);

  // Filter watchlist items
  const getFilteredItems = useCallback((filter = 'all') => {
    console.log('🔍 Filtering watchlist with filter:', filter);
    console.log('🔍 Watchlist items count:', watchlist.length);
    console.log('🔍 Is authenticated:', isAuthenticated);
    
    if (watchlist.length > 0) {
      console.log('🔍 First item structure:', watchlist[0]);
      console.log('🔍 First item status:', watchlist[0].status);
      console.log('🔍 First item watched:', watchlist[0].watched);
    }
    
    let filteredItems;
    
    switch (filter) {
      case 'watched':
      case 'completed':
        filteredItems = watchlist.filter(item => 
          isAuthenticated ? item.status === 'completed' : item.watched
        );
        console.log('✅ Completed/Watched items:', filteredItems.length);
        break;
      case 'pending':
        filteredItems = watchlist.filter(item => 
          isAuthenticated ? item.status === 'pending' : !item.watched
        );
        console.log('⏳ Pending items:', filteredItems.length);
        break;
      case 'watching':
        filteredItems = watchlist.filter(item => 
          isAuthenticated ? item.status === 'watching' : false
        );
        console.log('▶️ Watching items:', filteredItems.length);
        break;
      case 'abandoned':
        filteredItems = watchlist.filter(item => 
          isAuthenticated ? item.status === 'abandoned' : false
        );
        console.log('❌ Abandoned items:', filteredItems.length);
        break;
      case 'recent':
        filteredItems = watchlist
          .sort((a, b) => {
            const dateA = isAuthenticated ? new Date(a.createdAt) : new Date(a.added_at);
            const dateB = isAuthenticated ? new Date(b.createdAt) : new Date(b.added_at);
            return dateB - dateA;
          })
          .slice(0, 10);
        console.log('🕒 Recent items:', filteredItems.length);
        break;
      default:
        filteredItems = watchlist;
        console.log('📋 All items:', filteredItems.length);
    }
    
    return filteredItems;
  }, [watchlist, isAuthenticated]);

  // Get movies by genre
  const getMoviesByGenre = useCallback((genre) => {
    return watchlist.filter(item => {
      const movie = isAuthenticated ? item.movieId : item;
      return movie.genres && movie.genres.some(g => 
        g.toLowerCase().includes(genre.toLowerCase())
      );
    });
  }, [watchlist, isAuthenticated]);

  // Get recently added movies
  const getRecentlyAdded = useCallback((limit = 5) => {
    return watchlist
      .sort((a, b) => {
        const dateA = isAuthenticated ? new Date(a.createdAt) : new Date(a.added_at);
        const dateB = isAuthenticated ? new Date(b.createdAt) : new Date(b.added_at);
        return dateB - dateA;
      })
      .slice(0, limit);
  }, [watchlist, isAuthenticated]);

  // Get recently watched movies
  const getRecentlyWatched = useCallback((limit = 5) => {
    return watchlist
      .filter(item => {
        if (isAuthenticated) {
          return item.status === 'completed' && item.completedAt;
        } else {
          return item.watched && item.watched_at;
        }
      })
      .sort((a, b) => {
        const dateA = isAuthenticated ? new Date(a.completedAt) : new Date(a.watched_at);
        const dateB = isAuthenticated ? new Date(b.completedAt) : new Date(b.watched_at);
        return dateB - dateA;
      })
      .slice(0, limit);
  }, [watchlist, isAuthenticated]);

  // Get movie data consistently
  const getMovieData = useCallback((item) => {
    if (isAuthenticated) {
      const movieData = item.movieId || item;
      
      // Ensure we have the correct field mappings for database items
      if (movieData && typeof movieData === 'object') {
        return {
          ...movieData,
          // Map TMDb fields to database fields for consistency
          tmdbId: movieData.tmdbId || movieData.id,
          posterPath: movieData.posterPath || movieData.poster_path,
          backdropPath: movieData.backdropPath || movieData.backdrop_path,
          releaseDate: movieData.releaseDate || movieData.release_date,
          averageRating: movieData.averageRating || movieData.vote_average,
          voteCount: movieData.voteCount || movieData.vote_count,
          overview: movieData.overview || movieData.overview,
          title: movieData.title || movieData.title,
          runtime: movieData.runtime || movieData.runtime,
          genres: movieData.genres || movieData.genres || []
        };
      }
      return movieData;
    } else {
      return item;
    }
  }, [isAuthenticated]);

  return {
    // State
    watchlist,
    stats,
    loading,
    isAuthenticated,
    
    // Actions
    addMovie,
    removeMovie,
    toggleMovieWatched,
    checkIsInWatchlist,
    clearAll,
    loadWatchlist,
    
    // Filters and queries
    getFilteredItems,
    getMoviesByGenre,
    getRecentlyAdded,
    getRecentlyWatched,
    getMovieData
  };
} 