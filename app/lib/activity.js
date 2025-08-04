// Track user activity
export async function trackActivity(type, description, movieId = null, movieTitle = null) {
  try {
    const response = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        description,
        movieId,
        movieTitle
      })
    });

    if (!response.ok) {
      console.error('Failed to track activity:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error tracking activity:', error);
    return false;
  }
}

// Activity types
export const ACTIVITY_TYPES = {
  WATCHLIST_ADD: 'watchlist',
  WATCHLIST_REMOVE: 'watchlist_remove',
  MOVIE_WATCHED: 'watched',
  MOVIE_RATED: 'rated',
  MOOD_TRACKED: 'mood',
  RECOMMENDATION_GOT: 'recommendation',
  PROFILE_UPDATED: 'profile'
};

// Predefined activity descriptions
export const ACTIVITY_DESCRIPTIONS = {
  ADD_TO_WATCHLIST: (movieTitle) => `Added "${movieTitle}" to watchlist`,
  REMOVE_FROM_WATCHLIST: (movieTitle) => `Removed "${movieTitle}" from watchlist`,
  WATCHED_MOVIE: (movieTitle) => `Watched "${movieTitle}"`,
  RATED_MOVIE: (movieTitle, rating) => `Rated "${movieTitle}" ${rating}/5 stars`,
  TRACKED_MOOD: (mood) => `Tracked mood as "${mood}"`,
  GOT_RECOMMENDATIONS: (mood) => `Got recommendations for "${mood}" mood`,
  UPDATED_PROFILE: () => 'Updated profile information'
}; 