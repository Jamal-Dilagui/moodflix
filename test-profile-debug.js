// Test script to debug profile page data
console.log('🔍 Testing Profile Page Data Flow...');

// Mock the session data
const mockSession = {
  user: {
    id: '507f1f77bcf86cd799439011', // Example MongoDB ObjectId
    name: 'Test User',
    email: 'test@example.com'
  }
};

console.log('📋 Mock Session:', mockSession);

// Test the profile stats API call
async function testProfileStatsAPI() {
  try {
    console.log('\n1️⃣ Testing /api/profile/stats...');
    const response = await fetch('/api/profile/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile stats data:', data);
      console.log('📊 Stats breakdown:', {
        moviesWatched: data.stats?.moviesWatched,
        watchlistCount: data.stats?.watchlistCount,
        moodsTracked: data.stats?.moodsTracked,
        totalWatchTime: data.stats?.totalWatchTime
      });
    } else {
      const errorData = await response.json();
      console.log('❌ Error response:', errorData);
    }
  } catch (error) {
    console.error('❌ Error testing profile stats API:', error);
  }
}

// Test the profile API call
async function testProfileAPI() {
  try {
    console.log('\n2️⃣ Testing /api/profile...');
    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile data:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Error response:', errorData);
    }
  } catch (error) {
    console.error('❌ Error testing profile API:', error);
  }
}

// Test authentication
async function testAuth() {
  try {
    console.log('\n3️⃣ Testing /api/auth/session...');
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Session data:', data);
    } else {
      const errorData = await response.json();
      console.log('❌ Error response:', errorData);
    }
  } catch (error) {
    console.error('❌ Error testing auth:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Profile Debug Tests...\n');
  
  await testAuth();
  await testProfileAPI();
  await testProfileStatsAPI();
  
  console.log('\n✅ All tests completed!');
}

// Mock fetch for testing
global.fetch = async (url, options = {}) => {
  console.log(`🌐 Mock fetch: ${url}`);
  console.log('Options:', options);
  
  // Simulate different responses based on URL
  if (url === '/api/auth/session') {
    return {
      ok: true,
      status: 200,
      json: async () => ({ user: null }) // No authenticated user
    };
  }
  
  if (url === '/api/profile') {
    return {
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' })
    };
  }
  
  if (url === '/api/profile/stats') {
    return {
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' })
    };
  }
  
  return {
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' })
  };
};

runTests(); 