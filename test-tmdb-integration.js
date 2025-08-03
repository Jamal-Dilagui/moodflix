/**
 * Test script for TMDb + DeepSeek integration
 * Run with: node test-tmdb-integration.js
 */

async function testTMDBIntegration() {
  console.log('🧪 Testing TMDb + DeepSeek integration...\n');

  try {
    // Test the integrated API
    console.log('📤 Sending request to DeepSeek + TMDb API...');
    const response = await fetch('http://localhost:3001/api/deepseek', {
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

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success!');
      console.log('\n📋 Response Summary:');
      console.log(`- Total recommendations: ${data.data.total_results}`);
      console.log(`- AI Source: ${data.data.ai_source}`);
      console.log(`- TMDb Integration: ${data.data.tmdb_integration}`);
      
      console.log('\n🎬 Movie Recommendations:');
      data.data.recommendations.forEach((movie, index) => {
        console.log(`\n${index + 1}. ${movie.title}`);
        console.log(`   TMDb ID: ${movie.tmdb_id || 'Not found'}`);
        console.log(`   Rating: ⭐ ${movie.vote_average || 'N/A'}/10`);
        console.log(`   Year: ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}`);
        console.log(`   Duration: ${movie.runtime || 'N/A'} min`);
        console.log(`   Genres: ${movie.genres?.join(', ') || movie.genre || 'N/A'}`);
        console.log(`   Search Confidence: ${Math.round((movie.search_confidence || 0) * 100)}%`);
        console.log(`   AI Reason: ${movie.ai_recommendation?.reason}`);
        
        if (movie.poster_path) {
          console.log(`   Poster: https://image.tmdb.org/t/p/w500${movie.poster_path}`);
        }
      });
      
      console.log('\n📊 Overall Analysis:');
      console.log(data.data.overall_analysis);
      
    } else {
      console.log('❌ Error:', data.error);
      console.log('Message:', data.message);
      
      if (data.raw_response) {
        console.log('\nRaw AI Response:', data.raw_response);
      }
    }

  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on http://localhost:3001');
  }
}

// Run the test
testTMDBIntegration(); 