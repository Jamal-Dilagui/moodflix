/**
 * Comprehensive database debug script
 * Run with: node test-database-debug.js
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Test authentication
async function testAuthentication() {
  console.log('🔐 Testing Authentication...');
  
  try {
    const response = await fetch('/api/auth/session');
    console.log('Session API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Session data:', data);
      console.log('User authenticated:', !!data.user);
      return !!data.user;
    } else {
      const error = await response.json();
      console.log('Session API error:', error);
      return false;
    }
  } catch (error) {
    console.error('Authentication test failed:', error);
    return false;
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  
  try {
    const response = await fetch('/api/watchlist');
    console.log('Watchlist API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Watchlist data:', data);
      console.log('Watchlist items count:', data.watchlist?.length || 0);
    } else {
      const error = await response.json();
      console.log('Watchlist API error:', error);
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

// Test adding a movie
async function testAddMovie() {
  console.log('\n🎬 Testing Adding Movie...');
  
  const testMovie = {
    tmdb_id: 12345,
    title: 'Test Movie for Database',
    overview: 'This is a test movie to verify database functionality',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2024-01-01',
    runtime: 120,
    genres: ['Action', 'Adventure'],
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 85.5
  };
  
  try {
    console.log('Sending movie data:', testMovie);
    
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tmdbId: testMovie.tmdb_id,
        movieData: {
          title: testMovie.title,
          overview: testMovie.overview,
          poster_path: testMovie.poster_path,
          backdrop_path: testMovie.backdrop_path,
          release_date: testMovie.release_date,
          runtime: testMovie.runtime,
          genres: testMovie.genres,
          vote_average: testMovie.vote_average,
          vote_count: testMovie.vote_count,
          popularity: testMovie.popularity,
          source: 'debug-test'
        }
      })
    });
    
    console.log('Add movie response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Movie added successfully:', data);
    } else {
      const error = await response.json();
      console.log('❌ Add movie error:', error);
    }
  } catch (error) {
    console.error('❌ Add movie test failed:', error);
  }
}

// Test watchlist stats
async function testWatchlistStats() {
  console.log('\n📊 Testing Watchlist Stats...');
  
  try {
    const response = await fetch('/api/watchlist/stats');
    console.log('Stats API response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Watchlist stats:', data);
    } else {
      const error = await response.json();
      console.log('Stats API error:', error);
    }
  } catch (error) {
    console.error('Stats test failed:', error);
  }
}

// Mock responses for testing
fetch.mockImplementation((url, options) => {
  console.log(`🌐 Mock fetch called: ${url} ${options?.method || 'GET'}`);
  
  if (url.includes('/api/auth/session')) {
    // Simulate authenticated user
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        user: {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    });
  }
  
  if (url.includes('/api/watchlist/stats')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        total: 0,
        pending: 0,
        watching: 0,
        completed: 0,
        abandoned: 0,
        completedPercentage: 0
      })
    });
  }
  
  if (url.includes('/api/watchlist') && options?.method === 'GET') {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        watchlist: [] // Empty watchlist
      })
    });
  }
  
  if (url.includes('/api/watchlist') && options?.method === 'POST') {
    const body = JSON.parse(options.body);
    console.log('📝 Request body:', body);
    console.log('🎭 Movie data:', body.movieData);
    
    // Simulate successful movie addition
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        message: 'Movie added to watchlist',
        watchlistItem: {
          _id: 'test-watchlist-id',
          userId: 'test-user-id',
          movieId: {
            _id: 'test-movie-id',
            title: body.movieData.title,
            tmdbId: body.tmdbId
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      })
    });
  }
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
});

// Run comprehensive tests
async function runDebugTests() {
  console.log('🚀 Starting comprehensive database debug tests...\n');
  
  const isAuthenticated = await testAuthentication();
  console.log(`\n🔐 Authentication result: ${isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}`);
  
  await testDatabaseConnection();
  await testAddMovie();
  await testWatchlistStats();
  
  console.log('\n✅ All debug tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Check if authentication is working');
  console.log('- Check if database connection is established');
  console.log('- Check if movie addition is successful');
  console.log('- Check if watchlist stats are accessible');
}

runDebugTests(); 