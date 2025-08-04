/**
 * Test script for movie creation with different genre formats
 * Run with: node test-movie-creation.js
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Test movie data from deepseek API
const testMovies = [
  {
    tmdb_id: 123,
    title: 'Test Movie 1',
    overview: 'A test movie with string genres',
    poster_path: '/test1.jpg',
    backdrop_path: '/backdrop1.jpg',
    release_date: '2024-01-01',
    runtime: 120,
    genres: ['Action', 'Adventure'], // String array format
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 85.5
  },
  {
    tmdb_id: 456,
    title: 'Test Movie 2',
    overview: 'A test movie with object genres',
    poster_path: '/test2.jpg',
    backdrop_path: '/backdrop2.jpg',
    release_date: '2024-01-02',
    runtime: 90,
    genres: [
      { name: 'Comedy' },
      { name: 'Drama' }
    ], // Object array format from TMDb
    vote_average: 7.5,
    vote_count: 500,
    popularity: 75.5
  },
  {
    tmdb_id: 789,
    title: 'Test Movie 3',
    overview: 'A test movie with mixed genres',
    poster_path: '/test3.jpg',
    backdrop_path: '/backdrop3.jpg',
    release_date: '2024-01-03',
    runtime: 150,
    genres: ['Action', { name: 'Sci-Fi' }, 'Thriller'], // Mixed format
    vote_average: 9.0,
    vote_count: 2000,
    popularity: 95.5
  }
];

// Test adding movies to watchlist
async function testAddMovies() {
  console.log('Testing movie creation with different genre formats...\n');
  
  for (let i = 0; i < testMovies.length; i++) {
    const movie = testMovies[i];
    console.log(`\n--- Test Movie ${i + 1} ---`);
    console.log('Movie:', movie);
    console.log('Genres:', movie.genres);
    console.log('Genres type:', typeof movie.genres);
    console.log('Is array:', Array.isArray(movie.genres));
    
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tmdbId: movie.tmdb_id,
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
            source: 'test'
          }
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Success:', data.message);
      } else {
        const error = await response.json();
        console.log('❌ Error:', error);
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}

// Mock responses
fetch.mockImplementation((url, options) => {
  console.log('Mock fetch called:', url, options?.method || 'GET');
  
  if (url.includes('/api/watchlist') && options?.method === 'POST') {
    const body = JSON.parse(options.body);
    console.log('Request body:', body);
    console.log('Genres in request:', body.movieData.genres);
    
    // Simulate successful response
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ 
        message: 'Movie added to watchlist',
        watchlistItem: { id: 'test-id' }
      })
    });
  }
  
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
});

// Run test
async function runTest() {
  console.log('Starting movie creation tests...\n');
  await testAddMovies();
  console.log('\nTests completed!');
}

runTest(); 