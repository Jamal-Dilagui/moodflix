/**
 * Test real database connection and environment variables
 * Run with: node test-real-database.js
 */

// Load environment variables
require('dotenv').config();

console.log('🔍 Database Connection Test');
console.log('==========================\n');

// Check environment variables
console.log('📋 Environment Variables:');
const requiredVars = [
  'MONGO_DB_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅ SET' : '❌ MISSING';
  const displayValue = value ? 
    (varName.includes('SECRET') ? '***' : value.substring(0, 30) + '...') : 
    'undefined';
  console.log(`${status} ${varName}: ${displayValue}`);
});

console.log('\n🔗 Testing MongoDB Connection...');

// Test MongoDB connection
async function testMongoConnection() {
  try {
    const mongoose = require('mongoose');
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    console.log('\n🗄️ Testing Database Operations...');
    
    // Check if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections found:', collections.map(c => c.name));
    
    // Test Movie model
    const Movie = require('./app/models/Movie');
    const movieCount = await Movie.countDocuments();
    console.log(`Movies in database: ${movieCount}`);
    
    // Test Watchlist model
    const Watchlist = require('./app/models/Watchlist');
    const watchlistCount = await Watchlist.countDocuments();
    console.log(`Watchlist items in database: ${watchlistCount}`);
    
    // Test User model
    const User = require('./app/models/User');
    const userCount = await User.countDocuments();
    console.log(`Users in database: ${userCount}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

// Test if we can require the models
console.log('\n📦 Testing Model Imports...');
try {
  const Movie = require('./app/models/Movie');
  console.log('✅ Movie model imported successfully');
  
  const Watchlist = require('./app/models/Watchlist');
  console.log('✅ Watchlist model imported successfully');
  
  const User = require('./app/models/User');
  console.log('✅ User model imported successfully');
  
} catch (error) {
  console.error('❌ Model import failed:', error.message);
}

// Run the test
testMongoConnection().then(() => {
  console.log('\n✅ Database test completed!');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 