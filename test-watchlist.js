/**
 * Test script for watchlist functionality
 * Run with: node test-watchlist.js
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

// Import watchlist functions
const { 
  addToWatchlist, 
  removeFromWatchlist, 
  getWatchlist, 
  toggleWatched, 
  isInWatchlist, 
  getWatchlistStats,
  clearWatchlist 
} = require('./app/lib/watchlist.js');

async function testWatchlist() {
  console.log('🧪 Testing Watchlist Functionality...\n');

  try {
    // Test 1: Add movies to watchlist
    console.log('📝 Test 1: Adding movies to watchlist...');
    
    const movie1 = {
      tmdb_id: 123,
      title: 'Inception',
      poster_path: '/test1.jpg',
      release_date: '2010-07-16',
      vote_average: 8.8,
      runtime: 148,
      overview: 'A thief who steals corporate secrets...'
    };

    const movie2 = {
      tmdb_id: 456,
      title: 'Interstellar',
      poster_path: '/test2.jpg',
      release_date: '2014-11-07',
      vote_average: 8.6,
      runtime: 169,
      overview: 'A team of explorers travel through a wormhole...'
    };

    addToWatchlist(movie1);
    addToWatchlist(movie2);
    
    let watchlist = getWatchlist();
    console.log(`✅ Added ${watchlist.length} movies to watchlist`);
    console.log(`   Movies: ${watchlist.map(m => m.title).join(', ')}`);

    // Test 2: Check if movies are in watchlist
    console.log('\n🔍 Test 2: Checking watchlist status...');
    console.log(`   Inception in watchlist: ${isInWatchlist(123)}`);
    console.log(`   Interstellar in watchlist: ${isInWatchlist(456)}`);
    console.log(`   Non-existent movie in watchlist: ${isInWatchlist(999)}`);

    // Test 3: Toggle watched status
    console.log('\n👁️ Test 3: Toggling watched status...');
    toggleWatched(123);
    watchlist = getWatchlist();
    const inception = watchlist.find(m => m.tmdb_id === 123);
    console.log(`   Inception watched: ${inception.watched}`);

    // Test 4: Get statistics
    console.log('\n📊 Test 4: Getting watchlist statistics...');
    const stats = getWatchlistStats();
    console.log(`   Total movies: ${stats.total}`);
    console.log(`   Watched: ${stats.watched}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Watched percentage: ${stats.watchedPercentage}%`);

    // Test 5: Remove movie
    console.log('\n🗑️ Test 5: Removing movie from watchlist...');
    removeFromWatchlist(456);
    watchlist = getWatchlist();
    console.log(`   Movies after removal: ${watchlist.length}`);
    console.log(`   Remaining movies: ${watchlist.map(m => m.title).join(', ')}`);

    // Test 6: Clear watchlist
    console.log('\n🧹 Test 6: Clearing watchlist...');
    clearWatchlist();
    watchlist = getWatchlist();
    console.log(`   Movies after clear: ${watchlist.length}`);

    console.log('\n🎉 All watchlist tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testWatchlist(); 