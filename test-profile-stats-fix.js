require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Watchlist = require('./app/models/Watchlist.js');
const User = require('./app/models/User.js');
const MoodEntry = require('./app/models/MoodEntry.js');
const Activity = require('./app/models/Activity.js');

async function testProfileStatsFix() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if we have any users
    const users = await User.find().limit(1);
    if (users.length === 0) {
      console.log('❌ No users found. Please run test-add-sample-data.js first.');
      return;
    }

    const userId = users[0]._id;
    console.log(`\n🔍 Testing with user ID: ${userId}`);

    // Test the fixed getUserStats method
    console.log('\n📊 Testing Watchlist.getUserStats (FIXED)...');
    const watchlistStatsResult = await Watchlist.getUserStats(userId);
    console.log('Raw result:', watchlistStatsResult);
    
    const watchlistStats = watchlistStatsResult.length > 0 ? watchlistStatsResult[0] : { total: 0, completed: 0, pending: 0, watching: 0, abandoned: 0 };
    console.log('Processed stats:', watchlistStats);

    // Test mood entries
    console.log('\n😊 Testing mood entries...');
    const recentMoods = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('mood createdAt');
    console.log(`Found ${recentMoods.length} mood entries`);

    // Test activities
    console.log('\n📝 Testing activities...');
    const recentActivities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    console.log(`Found ${recentActivities.length} activities`);

    // Test watchlist items
    console.log('\n📋 Testing watchlist items...');
    const watchlistItems = await Watchlist.find({ userId })
      .populate('movieId', 'title genres');
    console.log(`Found ${watchlistItems.length} watchlist items:`, watchlistItems.map(item => ({
      status: item.status,
      movieTitle: item.movieId?.title || 'Unknown'
    })));

    // Simulate the profile stats API response
    console.log('\n🎯 Simulating Profile Stats API Response...');
    const profileStats = {
      user: {
        name: `${users[0].firstName} ${users[0].lastName}`,
        email: users[0].email,
        memberSince: users[0].createdAt
      },
      stats: {
        moviesWatched: watchlistStats.completed || 0,
        watchlistCount: watchlistStats.total || 0,
        moodsTracked: recentMoods.length,
        totalWatchTime: 0, // Would be calculated from completed movies
        monthlyWatchTime: 0,
        weeklyWatchTime: 0,
        dailyAverage: 0
      },
      recentMoods: recentMoods.map(entry => ({
        mood: entry.mood,
        date: entry.createdAt,
        timeAgo: 'recent'
      })),
      favoriteGenres: [],
      recentActivities: recentActivities.map(activity => ({
        type: activity.type,
        description: activity.description,
        movieTitle: activity.movieTitle || 'Unknown Movie',
        date: activity.createdAt,
        timeAgo: 'recent'
      }))
    };

    console.log('\n📊 FINAL PROFILE STATS:');
    console.log('Movies Watched:', profileStats.stats.moviesWatched);
    console.log('Watchlist Count:', profileStats.stats.watchlistCount);
    console.log('Moods Tracked:', profileStats.stats.moodsTracked);
    console.log('Recent Moods:', profileStats.recentMoods.length);
    console.log('Recent Activities:', profileStats.recentActivities.length);

    if (profileStats.stats.moviesWatched > 0 || profileStats.stats.watchlistCount > 0 || profileStats.stats.moodsTracked > 0) {
      console.log('\n✅ SUCCESS: Profile stats are showing real data!');
    } else {
      console.log('\n❌ ISSUE: Profile stats are still showing 0. Check if data exists in database.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testProfileStatsFix(); 