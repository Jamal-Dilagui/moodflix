/**
 * TMDb API Integration
 * Clean JavaScript implementation following best practices
 */

// API Configuration
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

/**
 * Generic API request function with error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
async function tmdbRequest(endpoint, params = {}) {
  try {
    // Validate API key
    if (!TMDB_API_KEY) {
      throw new Error('TMDb API key is not configured');
    }

    // Build URL with parameters
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);
    url.searchParams.append('language', 'en-US');
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    // Make request
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TMDb API request failed:', error);
    throw error;
  }
}

/**
 * Get movie poster URL
 * @param {string} posterPath - Poster path from TMDb
 * @param {string} size - Image size (default: w500)
 * @returns {string} Full poster URL
 */
function getPosterUrl(posterPath, size = 'w500') {
  if (!posterPath) {
    return '/images/placeholder.svg';
  }
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

/**
 * Get backdrop URL
 * @param {string} backdropPath - Backdrop path from TMDb
 * @param {string} size - Image size (default: original)
 * @returns {string} Full backdrop URL
 */
function getBackdropUrl(backdropPath, size = 'original') {
  if (!backdropPath) {
    return '/images/placeholder.svg';
  }
  return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
}

/**
 * Search movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Search results
 */
async function searchMovies(query, page = 1) {
  return tmdbRequest('/search/movie', {
    query,
    page,
    include_adult: false,
  });
}

/**
 * Get movie details by ID
 * @param {number} movieId - TMDb movie ID
 * @returns {Promise<Object>} Movie details
 */
async function getMovieDetails(movieId) {
  return tmdbRequest(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar',
  });
}

/**
 * Get popular movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Popular movies
 */
async function getPopularMovies(page = 1) {
  return tmdbRequest('/movie/popular', { page });
}

/**
 * Get top rated movies
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Top rated movies
 */
async function getTopRatedMovies(page = 1) {
  return tmdbRequest('/movie/top_rated', { page });
}

/**
 * Get movies by genre
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Movies by genre
 */
async function getMoviesByGenre(genreId, page = 1) {
  return tmdbRequest('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc',
  });
}

/**
 * Get movie recommendations
 * @param {number} movieId - TMDb movie ID
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Movie recommendations
 */
async function getMovieRecommendations(movieId, page = 1) {
  return tmdbRequest(`/movie/${movieId}/recommendations`, { page });
}

/**
 * Get genres list
 * @returns {Promise<Object>} Available genres
 */
async function getGenres() {
  return tmdbRequest('/genre/movie/list');
}

/**
 * Get movies by mood (custom function for your app)
 * @param {string} mood - User's mood
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Object>} Movies filtered by mood
 */
async function getMoviesByMood(mood, page = 1) {
  // Map moods to genres
  const moodToGenres = {
    happy: [35, 10751, 16], // Comedy, Family, Animation
    sad: [18, 10749], // Drama, Romance
    excited: [28, 12, 878], // Action, Adventure, Science Fiction
    relaxed: [14, 16, 10751], // Fantasy, Animation, Family
    romantic: [10749, 18], // Romance, Drama
    adventurous: [12, 28, 14], // Adventure, Action, Fantasy
    nostalgic: [18, 36, 10402], // Drama, History, Music
    inspired: [18, 99, 36], // Drama, Documentary, History
  };

  const genreIds = moodToGenres[mood.toLowerCase()] || [35]; // Default to comedy
  const genreIdString = genreIds.join('|');

  return tmdbRequest('/discover/movie', {
    with_genres: genreIdString,
    page,
    sort_by: 'popularity.desc',
    'vote_average.gte': 6.0, // Only movies with good ratings
  });
}

/**
 * Transform TMDb movie data to your app's format
 * @param {Object} tmdbMovie - Raw TMDb movie data
 * @returns {Object} Transformed movie data
 */
function transformMovieData(tmdbMovie) {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    originalTitle: tmdbMovie.original_title,
    overview: tmdbMovie.overview,
    poster: getPosterUrl(tmdbMovie.poster_path),
    backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
    releaseDate: tmdbMovie.release_date,
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : null,
    duration: tmdbMovie.runtime ? `${tmdbMovie.runtime} min` : null,
    rating: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.join(', ') : null,
    popularity: tmdbMovie.popularity,
    adult: tmdbMovie.adult,
    video: tmdbMovie.video,
  };
}

/**
 * Transform TMDb search results to your app's format
 * @param {Object} searchResults - Raw TMDb search results
 * @returns {Object} Transformed search results
 */
function transformSearchResults(searchResults) {
  return {
    page: searchResults.page,
    totalPages: searchResults.total_pages,
    totalResults: searchResults.total_results,
    results: searchResults.results.map(transformMovieData),
  };
}

// Export all functions
export {
  tmdbRequest,
  getPosterUrl,
  getBackdropUrl,
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getMovieRecommendations,
  getGenres,
  getMoviesByMood,
  transformMovieData,
  transformSearchResults,
}; 