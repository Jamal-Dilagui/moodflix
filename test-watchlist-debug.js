/**
 * Debug script for watchlist functionality
 * Run with: node test-watchlist-debug.js
 */

// Mock localStorage for testing
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Mock fetch for testing
global.fetch = jest.fn();

// Import the functions we want to test
const { 
  getLocalWatchlist, 
  saveLocalWatchlist, 
  addToWatchlist, 
  isInWatchlist,
  getWatchlistStats 
} = require('./app/lib/watchlist');

describe('Watchlist Debug Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.data = {};
    fetch.mockClear();
  });

  test('should add movie to local watchlist', async () => {
    const movie = {
      tmdb_id: 123,
      title: 'Test Movie',
      overview: 'A test movie',
      poster_path: '/test.jpg',
      release_date: '2024-01-01',
      runtime: 120,
      vote_average: 8.5,
      genres: ['Action', 'Adventure']
    };

    const result = await addToWatchlist(movie);
    expect(result).toBe(true);

    const watchlist = getLocalWatchlist();
    expect(watchlist).toHaveLength(1);
    expect(watchlist[0].tmdb_id).toBe(123);
    expect(watchlist[0].title).toBe('Test Movie');
  });

  test('should check if movie is in watchlist', async () => {
    // Add a movie first
    const movie = {
      tmdb_id: 456,
      title: 'Another Test Movie',
      overview: 'Another test movie',
      poster_path: '/test2.jpg',
      release_date: '2024-01-02',
      runtime: 90,
      vote_average: 7.5,
      genres: ['Comedy']
    };

    await addToWatchlist(movie);

    // Check if it's in watchlist
    const isInWatchlist = await isInWatchlist(456);
    expect(isInWatchlist).toBe(true);

    // Check if non-existent movie is in watchlist
    const notInWatchlist = await isInWatchlist(999);
    expect(notInWatchlist).toBe(false);
  });

  test('should get watchlist statistics', async () => {
    // Add some movies
    const movies = [
      {
        tmdb_id: 111,
        title: 'Movie 1',
        overview: 'First movie',
        poster_path: '/movie1.jpg',
        release_date: '2024-01-01',
        runtime: 120,
        vote_average: 8.0,
        genres: ['Action']
      },
      {
        tmdb_id: 222,
        title: 'Movie 2',
        overview: 'Second movie',
        poster_path: '/movie2.jpg',
        release_date: '2024-01-02',
        runtime: 90,
        vote_average: 7.5,
        genres: ['Comedy']
      }
    ];

    for (const movie of movies) {
      await addToWatchlist(movie);
    }

    const stats = await getWatchlistStats();
    expect(stats.total).toBe(2);
    expect(stats.watched).toBe(0);
    expect(stats.pending).toBe(2);
  });

  test('should handle movie data structure variations', async () => {
    // Test with different field names
    const movieWithId = {
      id: 789,
      title: 'Movie with id field',
      overview: 'Test movie',
      poster_path: '/test.jpg',
      release_date: '2024-01-01',
      runtime: 120,
      vote_average: 8.0,
      genres: ['Drama']
    };

    const result = await addToWatchlist(movieWithId);
    expect(result).toBe(true);

    const watchlist = getLocalWatchlist();
    expect(watchlist).toHaveLength(1);
    expect(watchlist[0].tmdb_id).toBe(789);
  });

  console.log('Watchlist debug tests completed successfully!');
}); 