/**
 * Test script for DeepSeek API route
 * Run with: node test-deepseek-api.js
 */

async function testDeepSeekAPI() {
  const testData = {
    mood: "bored",
    time: "1 hour",
    situation: "alone"
  };

  console.log('🧪 Testing DeepSeek API route...\n');
  console.log('📤 Sending request with data:', testData);

  try {
    const response = await fetch('http://localhost:3000/api/deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success!');
      console.log('\n📋 Response:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.data && data.data.recommendations) {
        console.log('\n🎬 Movie Recommendations:');
        data.data.recommendations.forEach((movie, index) => {
          console.log(`${index + 1}. ${movie.title} (${movie.genre})`);
          console.log(`   Reason: ${movie.reason}`);
          console.log(`   Mood Match: ${movie.mood_match}`);
          console.log(`   Time Suitable: ${movie.time_suitable}\n`);
        });
        
        console.log('📊 Overall Analysis:');
        console.log(data.data.overall_analysis);
      }
    } else {
      console.log('❌ Error:', data.error);
      console.log('Message:', data.message);
      
      if (data.required) {
        console.log('Required fields:', data.required);
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on http://localhost:3000');
  }
}

// Run the test
testDeepSeekAPI(); 