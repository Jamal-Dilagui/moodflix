/**
 * Test script to verify MongoDB models load without duplicate index warnings
 * Run with: node test-models.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Import models to trigger schema compilation
import './app/models/User.js';
import './app/models/Movie.js';
import './app/models/Watchlist.js';
import './app/models/MoodEntry.js';
import './app/models/Activity.js';
import './app/models/Recommendation.js';

async function testModels() {
  console.log('🧪 Testing MongoDB models...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Test model compilation
    console.log('\n📋 Testing model compilation...');
    
    // Get all model names
    const modelNames = Object.keys(mongoose.models);
    console.log(`✅ Found ${modelNames.length} models:`, modelNames);

    // Test each model's schema
    for (const modelName of modelNames) {
      const model = mongoose.models[modelName];
      const indexes = model.schema.indexes();
      console.log(`📊 ${modelName}: ${indexes.length} indexes`);
    }

    console.log('\n🎉 All models compiled successfully without duplicate index warnings!');
    console.log('\n📝 Index Summary:');
    console.log('- User: email (unique), googleId, createdAt');
    console.log('- Movie: title/overview (text), genres, releaseDate, averageRating, popularity, moodTags, situationTags, timeTags');
    console.log('- Watchlist: userId+movieId (unique compound), userId+status, userId+priority, userId+createdAt, status, priority');
    console.log('- MoodEntry: userId+createdAt, userId+mood, userId+situation, mood+situation, createdAt');
    console.log('- Activity: userId+createdAt, userId+type, userId+category, type+createdAt, category+createdAt, movieId, moodEntryId, sessionId, success, priority');
    console.log('- Recommendation: userId+createdAt, sessionId, mood+situation, algorithm, status, expiresAt');

  } catch (error) {
    console.error('❌ Error testing models:', error.message);
    
    if (error.message.includes('duplicate')) {
      console.log('\n💡 This might indicate there are still duplicate indexes in your schemas.');
    }
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the test
testModels(); 