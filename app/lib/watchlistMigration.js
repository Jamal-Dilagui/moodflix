/**
 * Watchlist Migration Utility
 * Helps migrate localStorage watchlist data to database when users sign in
 */

import { getLocalWatchlist, saveLocalWatchlist } from './watchlist';

/**
 * Migrate localStorage watchlist to database
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Migration result
 */
export async function migrateWatchlistToDatabase(userId) {
  try {
    const localWatchlist = getLocalWatchlist();
    
    if (!localWatchlist || localWatchlist.length === 0) {
      return {
        success: true,
        migrated: 0,
        message: 'No local watchlist items to migrate'
      };
    }

    let migrated = 0;
    let errors = 0;

    for (const item of localWatchlist) {
      try {
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tmdbId: item.tmdb_id,
            movieData: {
              title: item.title,
              overview: item.overview,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              release_date: item.release_date,
              runtime: item.runtime,
              genres: item.genres,
              vote_average: item.vote_average,
              vote_count: item.vote_count,
              popularity: item.popularity,
              source: 'migration'
            }
          })
        });

        if (response.ok) {
          migrated++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error('Error migrating item:', error);
        errors++;
      }
    }

    // Clear localStorage after successful migration
    if (migrated > 0) {
      saveLocalWatchlist([]);
    }

    return {
      success: true,
      migrated,
      errors,
      total: localWatchlist.length,
      message: `Successfully migrated ${migrated} items to database`
    };
  } catch (error) {
    console.error('Error during watchlist migration:', error);
    return {
      success: false,
      migrated: 0,
      errors: 1,
      message: 'Failed to migrate watchlist'
    };
  }
}

/**
 * Check if user has local watchlist data to migrate
 * @returns {boolean} Whether there's local data to migrate
 */
export function hasLocalWatchlistData() {
  try {
    const localWatchlist = getLocalWatchlist();
    return localWatchlist && localWatchlist.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Get local watchlist count
 * @returns {number} Number of local watchlist items
 */
export function getLocalWatchlistCount() {
  try {
    const localWatchlist = getLocalWatchlist();
    return localWatchlist ? localWatchlist.length : 0;
  } catch (error) {
    return 0;
  }
} 