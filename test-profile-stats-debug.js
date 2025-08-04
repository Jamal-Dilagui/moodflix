require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Watchlist = require('./app/models/Watchlist.js');
const User = require('./app/models/User.js');
const MoodEntry = require('./app/models/MoodEntry.js');
const Activity = require('./app/models/Activity.js');

async function testDatabaseConnection() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if we have any users
    const users = await User.find().limit(5);
    console.log(`👥 Found ${users.length} users:`, users.map(u => ({ id: u._id, name: u.firstName || u.name, email: u.email })));

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    const userId = users[0]._id;
    console.log(`\n🔍 Testing with user ID: ${userId}`);

    // Test Watchlist.getUserStats
    console.log('\n📊 Testing Watchlist.getUserStats...');
    const watchlistStats = await Watchlist.getUserStats(userId);
    console.log('Raw watchlist stats:', watchlistStats);
    
    // The issue: getUserStats returns an array, but we're accessing properties directly
    if (watchlistStats.length > 0) {
      console.log('✅ Watchlist stats found:', watchlistStats[0]);
    } else {
      console.log('❌ No watchlist stats found (empty array)');
    }

    // Check actual watchlist items
    console.log('\n📋 Checking actual watchlist items...');
    const watchlistItems = await Watchlist.find({ userId });
    console.log(`Found ${watchlistItems.length} watchlist items:`, watchlistItems.map(item => ({
      id: item._id,
      status: item.status,
      movieId: item.movieId
    })));

    // Check mood entries
    console.log('\n😊 Checking mood entries...');
    const moodEntries = await MoodEntry.find({ userId });
    console.log(`Found ${moodEntries.length} mood entries:`, moodEntries.map(entry => ({
      mood: entry.mood,
      createdAt: entry.createdAt
    })));

    // Check activities
    console.log('\n📝 Checking activities...');
    const activities = await Activity.find({ userId });
    console.log(`Found ${activities.length} activities:`, activities.map(activity => ({
      type: activity.type,
      description: activity.description,
      createdAt: activity.createdAt
    })));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testDatabaseConnection(); 