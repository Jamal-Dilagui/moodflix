/**
 * Test script for database connection and authentication
 * Run with: node test-database-connection.js
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const response = await fetch('/api/watchlist');
    console.log('Watchlist API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Watchlist data:', data);
    } else {
      const error = await response.json();
      console.log('Watchlist API error:', error);
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

// Test authentication
async function testAuthentication() {
  console.log('Testing authentication...');
  
  try {
    const response = await fetch('/api/auth/session');
    console.log('Session API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Session data:', data);
      console.log('User authenticated:', !!data.user);
    } else {
      const error = await response.json();
      console.log('Session API error:', error);
    }
  } catch (error) {
    console.error('Authentication test failed:', error);
  }
}

// Test adding a movie to watchlist
async function testAddMovie() {
  console.log('Testing adding movie to watchlist...');
  
  const mockMovie = {
    tmdb_id: 123,
    title: 'Test Movie',
    overview: 'A test movie for database testing',
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2024-01-01',
    runtime: 120,
    genres: ['Action', 'Adventure'],
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 85.5
  };
  
  try {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tmdbId: mockMovie.tmdb_id,
        movieData: {
          title: mockMovie.title,
          overview: mockMovie.overview,
          poster_path: mockMovie.poster_path,
          backdrop_path: mockMovie.backdrop_path,
          release_date: mockMovie.release_date,
          runtime: mockMovie.runtime,
          genres: mockMovie.genres,
          vote_average: mockMovie.vote_average,
          vote_count: mockMovie.vote_count,
          popularity: mockMovie.popularity,
          source: 'test'
        }
      })
    });
    
    console.log('Add movie API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Add movie success:', data);
    } else {
      const error = await response.json();
      console.log('Add movie error:', error);
    }
  } catch (error) {
    console.error('Add movie test failed:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting database and authentication tests...\n');
  
  await testAuthentication();
  console.log('\n---\n');
  
  await testDatabaseConnection();
  console.log('\n---\n');
  
  await testAddMovie();
  console.log('\n---\n');
  
  console.log('Tests completed!');
}

// Mock fetch responses for testing
fetch.mockImplementation((url) => {
  console.log('Mock fetch called with URL:', url);
  
  if (url.includes('/api/auth/session')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: null }) // No user logged in
    });
  }
  
  if (url.includes('/api/watchlist')) {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' })
    });
  }
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
});

runTests(); 