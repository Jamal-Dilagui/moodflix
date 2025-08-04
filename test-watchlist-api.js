/**
 * Test script for watchlist API endpoints
 * Run with: node test-watchlist-api.js
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Test GET /api/watchlist
async function testGetWatchlist() {
  console.log('Testing GET /api/watchlist...');
  
  try {
    const response = await fetch('/api/watchlist');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Watchlist data:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Test POST /api/watchlist
async function testPostWatchlist() {
  console.log('Testing POST /api/watchlist...');
  
  const movieData = {
    tmdbId: 123,
    movieData: {
      title: 'Test Movie',
      overview: 'A test movie',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2024-01-01',
      runtime: 120,
      genres: ['Action', 'Adventure'],
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 85.5,
      source: 'test'
    }
  };
  
  try {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData)
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Test GET /api/watchlist/stats
async function testGetWatchlistStats() {
  console.log('Testing GET /api/watchlist/stats...');
  
  try {
    const response = await fetch('/api/watchlist/stats');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Stats data:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Test GET /api/auth/session
async function testSession() {
  console.log('Testing GET /api/auth/session...');
  
  try {
    const response = await fetch('/api/auth/session');
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Session data:', data);
    } else {
      const error = await response.json();
      console.log('Error:', error);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Mock responses
fetch.mockImplementation((url, options) => {
  console.log('Mock fetch called:', url, options?.method || 'GET');
  
  if (url.includes('/api/auth/session')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ user: null })
    });
  }
  
  if (url.includes('/api/watchlist/stats')) {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' })
    });
  }
  
  if (url.includes('/api/watchlist') && options?.method === 'POST') {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' })
    });
  }
  
  if (url.includes('/api/watchlist') && options?.method === 'GET') {
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

// Run tests
async function runTests() {
  console.log('Starting watchlist API tests...\n');
  
  await testSession();
  console.log('\n---\n');
  
  await testGetWatchlist();
  console.log('\n---\n');
  
  await testPostWatchlist();
  console.log('\n---\n');
  
  await testGetWatchlistStats();
  console.log('\n---\n');
  
  console.log('API tests completed!');
}

runTests(); 