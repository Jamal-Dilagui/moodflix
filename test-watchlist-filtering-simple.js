// Simple test for watchlist filtering logic
console.log('🔍 Testing Watchlist Filtering Logic...');

// Mock data for authenticated users
const mockAuthenticatedData = [
  {
    _id: '1',
    status: 'completed',
    movieId: { title: 'Movie 1', tmdbId: 1 }
  },
  {
    _id: '2', 
    status: 'pending',
    movieId: { title: 'Movie 2', tmdbId: 2 }
  },
  {
    _id: '3',
    status: 'watching', 
    movieId: { title: 'Movie 3', tmdbId: 3 }
  },
  {
    _id: '4',
    status: 'abandoned',
    movieId: { title: 'Movie 4', tmdbId: 4 }
  }
];

// Mock data for unauthenticated users
const mockUnauthenticatedData = [
  {
    tmdb_id: 1,
    watched: true,
    title: 'Movie 1'
  },
  {
    tmdb_id: 2,
    watched: false,
    title: 'Movie 2'
  },
  {
    tmdb_id: 3,
    watched: true,
    title: 'Movie 3'
  }
];

// Test filtering function
function testFiltering(watchlist, isAuthenticated, filter) {
  console.log(`\n🔍 Testing filter: "${filter}" (Authenticated: ${isAuthenticated})`);
  
  let filteredItems;
  
  switch (filter) {
    case 'watched':
    case 'completed':
      filteredItems = watchlist.filter(item => 
        isAuthenticated ? item.status === 'completed' : item.watched
      );
      break;
    case 'pending':
      filteredItems = watchlist.filter(item => 
        isAuthenticated ? item.status === 'pending' : !item.watched
      );
      break;
    case 'watching':
      filteredItems = watchlist.filter(item => 
        isAuthenticated ? item.status === 'watching' : false
      );
      break;
    case 'abandoned':
      filteredItems = watchlist.filter(item => 
        isAuthenticated ? item.status === 'abandoned' : false
      );
      break;
    default:
      filteredItems = watchlist;
  }
  
  console.log(`✅ Filter "${filter}" returned ${filteredItems.length} items`);
  
  if (filteredItems.length > 0) {
    console.log('📋 Items:');
    filteredItems.forEach((item, index) => {
      if (isAuthenticated) {
        console.log(`  ${index + 1}. ${item.movieId.title} (${item.status})`);
      } else {
        console.log(`  ${index + 1}. ${item.title} (${item.watched ? 'watched' : 'not watched'})`);
      }
    });
  }
  
  return filteredItems;
}

// Test all filters for authenticated users
console.log('\n=== AUTHENTICATED USER TESTS ===');
const authFilters = ['all', 'completed', 'pending', 'watching', 'abandoned'];
authFilters.forEach(filter => {
  testFiltering(mockAuthenticatedData, true, filter);
});

// Test all filters for unauthenticated users
console.log('\n=== UNAUTHENTICATED USER TESTS ===');
const unauthFilters = ['all', 'watched', 'pending'];
unauthFilters.forEach(filter => {
  testFiltering(mockUnauthenticatedData, false, filter);
});

console.log('\n✅ All filtering tests completed!'); 