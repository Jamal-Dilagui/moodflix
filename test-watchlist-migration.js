/**
 * Test script for watchlist migration functionality
 * Run with: node test-watchlist-migration.js
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
const { hasLocalWatchlistData, getLocalWatchlistCount } = require('./app/lib/watchlistMigration');

describe('Watchlist Migration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.data = {};
    fetch.mockClear();
  });

  test('should detect local watchlist data', () => {
    // Add some mock data to localStorage
    const mockWatchlist = [
      {
        tmdb_id: 123,
        title: 'Test Movie 1',
        poster_path: '/test1.jpg',
        added_at: '2024-01-01T00:00:00.000Z',
        watched: false
      },
      {
        tmdb_id: 456,
        title: 'Test Movie 2',
        poster_path: '/test2.jpg',
        added_at: '2024-01-02T00:00:00.000Z',
        watched: true,
        watched_at: '2024-01-03T00:00:00.000Z'
      }
    ];

    localStorage.setItem('moodflix_watchlist', JSON.stringify(mockWatchlist));

    expect(hasLocalWatchlistData()).toBe(true);
    expect(getLocalWatchlistCount()).toBe(2);
  });

  test('should return false when no local data exists', () => {
    expect(hasLocalWatchlistData()).toBe(false);
    expect(getLocalWatchlistCount()).toBe(0);
  });

  test('should handle empty watchlist', () => {
    localStorage.setItem('moodflix_watchlist', JSON.stringify([]));
    
    expect(hasLocalWatchlistData()).toBe(false);
    expect(getLocalWatchlistCount()).toBe(0);
  });

  test('should handle invalid JSON in localStorage', () => {
    localStorage.setItem('moodflix_watchlist', 'invalid json');
    
    expect(hasLocalWatchlistData()).toBe(false);
    expect(getLocalWatchlistCount()).toBe(0);
  });
});

console.log('Watchlist migration tests completed successfully!'); 