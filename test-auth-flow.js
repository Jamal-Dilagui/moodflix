/**
 * Test authentication flow
 * Run with: node test-auth-flow.js
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Test the complete authentication and watchlist flow
async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');
  
  // Step 1: Check if user is authenticated
  console.log('1️⃣ Checking authentication status...');
  const authResponse = await fetch('/api/auth/session');
  console.log('Auth response status:', authResponse.status);
  
  if (authResponse.ok) {
    const authData = await authResponse.json();
    console.log('Auth data:', authData);
    
    if (authData.user) {
      console.log('✅ User is authenticated:', authData.user.name);
      
      // Step 2: Try to get watchlist
      console.log('\n2️⃣ Getting user watchlist...');
      const watchlistResponse = await fetch('/api/watchlist');
      console.log('Watchlist response status:', watchlistResponse.status);
      
      if (watchlistResponse.ok) {
        const watchlistData = await watchlistResponse.json();
        console.log('Watchlist data:', watchlistData);
        console.log('Watchlist items:', watchlistData.watchlist?.length || 0);
      } else {
        const error = await watchlistResponse.json();
        console.log('❌ Watchlist error:', error);
      }
      
      // Step 3: Try to add a movie
      console.log('\n3️⃣ Adding a test movie...');
      const addMovieResponse = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tmdbId: 99999,
          movieData: {
            title: 'Test Movie for Auth Flow',
            overview: 'Testing authentication flow',
            poster_path: '/test.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2024-01-01',
            runtime: 120,
            genres: ['Action'],
            vote_average: 8.0,
            vote_count: 100,
            popularity: 80.0,
            source: 'auth-test'
          }
        })
      });
      
      console.log('Add movie response status:', addMovieResponse.status);
      
      if (addMovieResponse.ok) {
        const addMovieData = await addMovieResponse.json();
        console.log('✅ Movie added successfully:', addMovieData);
      } else {
        const error = await addMovieResponse.json();
        console.log('❌ Add movie error:', error);
      }
      
    } else {
      console.log('❌ User is not authenticated');
    }
  } else {
    console.log('❌ Authentication check failed');
  }
}

// Mock responses
fetch.mockImplementation((url, options) => {
  console.log(`🌐 Mock fetch: ${url} ${options?.method || 'GET'}`);
  
  if (url.includes('/api/auth/session')) {
    // Simulate unauthenticated user
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ user: null })
    });
  }
  
  if (url.includes('/api/watchlist') && options?.method === 'GET') {
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
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
});

// Run the test
async function runAuthTest() {
  console.log('🚀 Starting authentication flow test...\n');
  await testAuthFlow();
  console.log('\n✅ Authentication flow test completed!');
  console.log('\n📋 Analysis:');
  console.log('- If user is not authenticated, movies will be saved to localStorage');
  console.log('- If user is authenticated but getting 401 errors, there might be a session issue');
  console.log('- If user is authenticated and getting 200 responses, the flow should work');
}

runAuthTest(); 