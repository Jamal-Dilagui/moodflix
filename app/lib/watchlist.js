/**
 * Watchlist Service
 * Handles saving, retrieving, and managing watchlist items
 * Supports both localStorage (unauthenticated) and database (authenticated) storage
 */

import { trackActivity, ACTIVITY_TYPES, ACTIVITY_DESCRIPTIONS } from './activity';

const WATCHLIST_STORAGE_KEY = 'moodflix_watchlist';

/**
 * Get all watchlist items from localStorage (for unauthenticated users)
 * @returns {Array} Array of watchlist items
 */
export function getLocalWatchlist() {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading watchlist from localStorage:', error);
    return [];
  }
}

/**
 * Save watchlist items to localStorage (for unauthenticated users)
 * @param {Array} items - Array of watchlist items
 */
export function saveLocalWatchlist(items) {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error);
  }
}

/**
 * Get all watchlist items from database (for authenticated users)
 * @returns {Promise<Array>} Promise resolving to array of watchlist items
 */
export async function getDatabaseWatchlist() {
  try {
    const response = await fetch('/api/watchlist');
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist');
    }
    const data = await response.json();
    return data.watchlist || [];
  } catch (error) {
    console.error('Error fetching watchlist from database:', error);
    return [];
  }
}

/**
 * Add a movie to the database watchlist (for authenticated users)
 * @param {Object} movie - Movie object to add
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function addToDatabaseWatchlist(movie) {
  try {
    console.log('Preparing to add movie to database:', movie);
    console.log('Movie genres:', movie.genres);
    console.log('Movie genres type:', typeof movie.genres);
    console.log('Movie genres is array:', Array.isArray(movie.genres));
    
    const requestBody = {
      tmdbId: movie.tmdb_id || movie.id,
      movieData: {
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        runtime: movie.runtime,
        genres: movie.genres,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        source: movie.source || 'manual'
      }
    };
    
    console.log('Request body:', requestBody);
    console.log('Request body genres:', requestBody.movieData.genres);
    
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      if (response.status === 409) {
        // Movie already in watchlist
        console.log('Movie already in watchlist');
        return true;
      }
      throw new Error(errorData.error || 'Failed to add to watchlist');
    }

    const responseData = await response.json();
    console.log('API success response:', responseData);
    return true;
  } catch (error) {
    console.error('Error adding movie to database watchlist:', error);
    return false;
  }
}

/**
 * Remove a movie from the database watchlist (for authenticated users)
 * @param {string} watchlistItemId - Watchlist item ID to remove
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function removeFromDatabaseWatchlist(watchlistItemId) {
  try {
    const response = await fetch(`/api/watchlist/${watchlistItemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove from watchlist');
    }

    return true;
  } catch (error) {
    console.error('Error removing movie from database watchlist:', error);
    return false;
  }
}

/**
 * Update a watchlist item in the database (for authenticated users)
 * @param {string} watchlistItemId - Watchlist item ID to update
 * @param {Object} updates - Updates to apply
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function updateDatabaseWatchlistItem(watchlistItemId, updates) {
  try {
    console.log('🔄 updateDatabaseWatchlistItem called with:', { watchlistItemId, updates });
    
    const response = await fetch(`/api/watchlist/${watchlistItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    console.log('📡 API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`Failed to update watchlist item: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ API response:', result);
    return true;
  } catch (error) {
    console.error('❌ Error updating database watchlist item:', error);
    return false;
  }
}

/**
 * Get watchlist statistics from database (for authenticated users)
 * @returns {Promise<Object>} Promise resolving to statistics object
 */
export async function getDatabaseWatchlistStats() {
  try {
    const response = await fetch('/api/watchlist/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch watchlist stats');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching watchlist stats from database:', error);
    return { total: 0, pending: 0, watching: 0, completed: 0, abandoned: 0, completedPercentage: 0 };
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} Promise resolving to authentication status
 */
export async function isAuthenticated() {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) return false;
    const session = await response.json();
    return !!session?.user?.id;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Get all watchlist items (automatically chooses storage method)
 * @returns {Promise<Array>} Promise resolving to array of watchlist items
 */
export async function getWatchlist() {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return await getDatabaseWatchlist();
  } else {
    return getLocalWatchlist();
  }
}

/**
 * Add a movie to the watchlist (automatically chooses storage method)
 * @param {Object} movie - Movie object to add
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function addToWatchlist(movie) {
  const authenticated = await isAuthenticated();
  console.log('Authentication status:', authenticated);
  console.log('Movie to add:', movie);
  
  if (authenticated) {
    console.log('Adding to database watchlist...');
    const result = await addToDatabaseWatchlist(movie);
    console.log('Database add result:', result);
    
    // Track activity for authenticated users
    if (result) {
      try {
        await trackActivity(
          ACTIVITY_TYPES.WATCHLIST_ADD,
          ACTIVITY_DESCRIPTIONS.ADD_TO_WATCHLIST(movie.title),
          null,
          movie.title
        );
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    }
    
    return result;
  } else {
    console.log('Adding to local watchlist...');
    try {
      const watchlist = getLocalWatchlist();
      
      // Check if movie already exists
      const existingIndex = watchlist.findIndex(item => item.tmdb_id === movie.tmdb_id);
      
      if (existingIndex !== -1) {
        // Movie already exists, update it
        watchlist[existingIndex] = {
          ...watchlist[existingIndex],
          ...movie,
          added_at: new Date().toISOString()
        };
      } else {
        // Add new movie
        watchlist.push({
          ...movie,
          added_at: new Date().toISOString(),
          watched: false
        });
      }
      
      saveLocalWatchlist(watchlist);
      console.log('Local watchlist updated:', watchlist);
      return true;
    } catch (error) {
      console.error('Error adding movie to local watchlist:', error);
      return false;
    }
  }
}

/**
 * Remove a movie from the watchlist (automatically chooses storage method)
 * @param {string|number} identifier - TMDb ID (localStorage) or watchlist item ID (database)
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function removeFromWatchlist(identifier) {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return await removeFromDatabaseWatchlist(identifier);
  } else {
    try {
      const watchlist = getLocalWatchlist();
      const filteredWatchlist = watchlist.filter(item => item.tmdb_id !== identifier);
      saveLocalWatchlist(filteredWatchlist);
      return true;
    } catch (error) {
      console.error('Error removing movie from local watchlist:', error);
      return false;
    }
  }
}

/**
 * Toggle watched status of a movie (automatically chooses storage method)
 * @param {string|number} identifier - TMDb ID (localStorage) or watchlist item ID (database)
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function toggleWatched(identifier) {
  const authenticated = await isAuthenticated();
  console.log('🔄 Toggle watched called with identifier:', identifier);
  console.log('🔐 Is authenticated:', authenticated);
  
  if (authenticated) {
    // For database, we need to find the watchlist item first
    const watchlist = await getDatabaseWatchlist();
    console.log('📋 Database watchlist items count:', watchlist.length);
    
    // Try to find the item by different methods
    let item = null;
    
    // Method 1: Check if identifier is a database _id
    if (typeof identifier === 'string' && identifier.length === 24) {
      item = watchlist.find(item => item._id.toString() === identifier);
      console.log('🔍 Method 1 (by _id):', !!item);
      if (item) {
        console.log('✅ Found item by _id:', {
          _id: item._id,
          status: item.status,
          movieId: item.movieId?.tmdbId || item.movieId,
          tmdbId: item.tmdbId
        });
      }
    }
    
    // Method 2: Check if the movieId has tmdbId field (populated movie data)
    if (!item) {
      item = watchlist.find(item => {
        if (item.movieId && typeof item.movieId === 'object' && item.movieId.tmdbId) {
          return item.movieId.tmdbId.toString() === identifier.toString();
        }
        return false;
      });
      console.log('🔍 Method 2 (by movieId.tmdbId):', !!item);
    }
    
    // Method 3: Fallback: check if the item itself has tmdbId
    if (!item) {
      item = watchlist.find(item => item.tmdbId && item.tmdbId.toString() === identifier.toString());
      console.log('🔍 Method 3 (by item.tmdbId):', !!item);
    }
    
    if (item) {
      console.log('✅ Found item:', {
        _id: item._id,
        status: item.status,
        movieId: item.movieId?.tmdbId || item.movieId,
        tmdbId: item.tmdbId
      });
      
      const newStatus = item.status === 'completed' ? 'pending' : 'completed';
      console.log('🔄 Changing status from', item.status, 'to', newStatus);
      
      const result = await updateDatabaseWatchlistItem(item._id, { status: newStatus });
      console.log('✅ Update result:', result);
      return result;
    }
    
    console.log('❌ Item not found for identifier:', identifier);
    return false;
  } else {
    try {
      const watchlist = getLocalWatchlist();
      const movieIndex = watchlist.findIndex(item => item.tmdb_id === identifier);
      
      if (movieIndex !== -1) {
        watchlist[movieIndex].watched = !watchlist[movieIndex].watched;
        watchlist[movieIndex].watched_at = watchlist[movieIndex].watched ? new Date().toISOString() : null;
        saveLocalWatchlist(watchlist);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling watched status:', error);
      return false;
    }
  }
}

/**
 * Check if a movie is in the watchlist (automatically chooses storage method)
 * @param {string|number} tmdbId - TMDb ID of the movie
 * @returns {Promise<boolean>} Promise resolving to whether the movie is in watchlist
 */
export async function isInWatchlist(tmdbId) {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    const watchlist = await getDatabaseWatchlist();
    return watchlist.some(item => {
      // Check if the movieId has tmdbId field (populated movie data)
      if (item.movieId && typeof item.movieId === 'object' && item.movieId.tmdbId) {
        return item.movieId.tmdbId === tmdbId;
      }
      // Fallback: check if the item itself has tmdbId (for backward compatibility)
      return item.tmdbId === tmdbId;
    });
  } else {
    try {
      const watchlist = getLocalWatchlist();
      return watchlist.some(item => item.tmdb_id === tmdbId);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }
}

/**
 * Get watchlist statistics (automatically chooses storage method)
 * @returns {Promise<Object>} Promise resolving to statistics object
 */
export async function getWatchlistStats() {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    return await getDatabaseWatchlistStats();
  } else {
    try {
      const watchlist = getLocalWatchlist();
      const total = watchlist.length;
      const watched = watchlist.filter(item => item.watched).length;
      const pending = total - watched;
      
      return {
        total,
        watched,
        pending,
        watching: 0,
        abandoned: 0,
        completedPercentage: total > 0 ? Math.round((watched / total) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting local watchlist stats:', error);
      return { total: 0, watched: 0, pending: 0, watching: 0, abandoned: 0, completedPercentage: 0 };
    }
  }
}

/**
 * Clear all watchlist items (automatically chooses storage method)
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function clearWatchlist() {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear watchlist');
      }

      return true;
    } catch (error) {
      console.error('Error clearing database watchlist:', error);
      return false;
    }
  } else {
    try {
      localStorage.removeItem(WATCHLIST_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing local watchlist:', error);
      return false;
    }
  }
}

/**
 * Export watchlist data (automatically chooses storage method)
 * @returns {Promise<Object>} Promise resolving to export data
 */
export async function exportWatchlist() {
  const authenticated = await isAuthenticated();
  if (authenticated) {
    const watchlist = await getDatabaseWatchlist();
    const stats = await getDatabaseWatchlistStats();
    
    return {
      watchlist,
      stats,
      exported_at: new Date().toISOString(),
      version: '2.0'
    };
  } else {
    try {
      const watchlist = getLocalWatchlist();
      const stats = getWatchlistStats();
      
      return {
        watchlist,
        stats,
        exported_at: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Error exporting local watchlist:', error);
      return null;
    }
  }
} 