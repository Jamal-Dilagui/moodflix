/**
 * Debug script for DeepSeek API issues
 * Run with: node test-deepseek-debug.js
 */

async function testDeepSeekAPI() {
  console.log('🔍 Testing DeepSeek API connection...\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connection...');
    const serverResponse = await fetch('http://localhost:3000/api/deepseek');
    
    if (!serverResponse.ok) {
      console.log('❌ Server not responding properly');
      console.log('Status:', serverResponse.status);
      return;
    }
    
    const serverData = await serverResponse.json();
    console.log('✅ Server is running');
    console.log('Response:', serverData);

    // Test 2: Test with actual data
    console.log('\n2️⃣ Testing with sample data...');
    const testResponse = await fetch('http://localhost:3000/api/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood: 'bored',
        time: '1 hour',
        situation: 'alone'
      })
    });

    const testData = await testResponse.json();
    console.log('Status:', testResponse.status);
    console.log('Response:', JSON.stringify(testData, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Make sure your Next.js server is running:');
      console.log('   npm run dev');
    }
  }
}

// Run the test
testDeepSeekAPI(); 