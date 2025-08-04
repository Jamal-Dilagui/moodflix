require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('./app/models/User.js');
const Movie = require('./app/models/Movie.js');
const Watchlist = require('./app/models/Watchlist.js');
const MoodEntry = require('./app/models/MoodEntry.js');
const Activity = require('./app/models/Activity.js');

async function addSampleData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if we already have users
    const existingUsers = await User.find();
    console.log(`👥 Found ${existingUsers.length} existing users`);

    let testUser;
    
    if (existingUsers.length === 0) {
      // Create a test user
      console.log('\n👤 Creating test user...');
      testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        favoriteGenres: ['Action', 'Drama', 'Comedy']
      });
      await testUser.save();
      console.log('✅ Test user created:', testUser._id);
    } else {
      testUser = existingUsers[0];
      console.log('✅ Using existing user:', testUser._id);
    }

    // Create sample movies
    console.log('\n🎬 Creating sample movies...');
    const sampleMovies = [
      {
        title: 'The Shawshank Redemption',
        overview: 'Two imprisoned men bond over a number of years...',
        posterPath: '/sample1.jpg',
        runtime: 142,
        releaseDate: new Date('1994-09-22'),
        genres: ['Drama'],
        averageRating: 9.3,
        tmdbId: 278
      },
      {
        title: 'The Godfather',
        overview: 'The aging patriarch of an organized crime dynasty...',
        posterPath: '/sample2.jpg',
        runtime: 175,
        releaseDate: new Date('1972-03-14'),
        genres: ['Crime', 'Drama'],
        averageRating: 9.2,
        tmdbId: 238
      },
      {
        title: 'Pulp Fiction',
        overview: 'The lives of two mob hitmen, a boxer, a gangster...',
        posterPath: '/sample3.jpg',
        runtime: 154,
        releaseDate: new Date('1994-10-14'),
        genres: ['Crime', 'Drama'],
        averageRating: 8.9,
        tmdbId: 680
      }
    ];

    const createdMovies = [];
    for (const movieData of sampleMovies) {
      const existingMovie = await Movie.findOne({ tmdbId: movieData.tmdbId });
      if (!existingMovie) {
        const movie = new Movie(movieData);
        await movie.save();
        createdMovies.push(movie);
        console.log(`✅ Created movie: ${movie.title}`);
      } else {
        createdMovies.push(existingMovie);
        console.log(`✅ Found existing movie: ${existingMovie.title}`);
      }
    }

    // Create sample watchlist items
    console.log('\n📋 Creating sample watchlist items...');
    const watchlistItems = [
      { movieId: createdMovies[0]._id, status: 'completed', userRating: 9 },
      { movieId: createdMovies[1]._id, status: 'watching', watchProgress: 60 },
      { movieId: createdMovies[2]._id, status: 'pending' }
    ];

    for (const itemData of watchlistItems) {
      const existingItem = await Watchlist.findOne({ 
        userId: testUser._id, 
        movieId: itemData.movieId 
      });
      
      if (!existingItem) {
        const watchlistItem = new Watchlist({
          userId: testUser._id,
          ...itemData
        });
        await watchlistItem.save();
        console.log(`✅ Added to watchlist: ${createdMovies.find(m => m._id.equals(itemData.movieId)).title} (${itemData.status})`);
      } else {
        console.log(`✅ Watchlist item already exists: ${createdMovies.find(m => m._id.equals(itemData.movieId)).title}`);
      }
    }

    // Create sample mood entries
    console.log('\n😊 Creating sample mood entries...');
    const moodEntries = [
      { mood: 'happy', notes: 'Feeling great today!' },
      { mood: 'sad', notes: 'Need something uplifting' },
      { mood: 'excited', notes: 'Ready for an adventure!' }
    ];

    for (const moodData of moodEntries) {
      const moodEntry = new MoodEntry({
        userId: testUser._id,
        ...moodData
      });
      await moodEntry.save();
      console.log(`✅ Created mood entry: ${moodData.mood}`);
    }

    // Create sample activities
    console.log('\n📝 Creating sample activities...');
    const activities = [
      { type: 'watchlist', description: 'Added "The Shawshank Redemption" to watchlist', movieId: createdMovies[0]._id, movieTitle: 'The Shawshank Redemption' },
      { type: 'watched', description: 'Watched "The Shawshank Redemption"', movieId: createdMovies[0]._id, movieTitle: 'The Shawshank Redemption' },
      { type: 'mood', description: 'Tracked mood as "happy"' }
    ];

    for (const activityData of activities) {
      const activity = new Activity({
        userId: testUser._id,
        ...activityData
      });
      await activity.save();
      console.log(`✅ Created activity: ${activityData.description}`);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log(`👤 User ID: ${testUser._id}`);
    console.log(`📋 Watchlist items: ${await Watchlist.countDocuments({ userId: testUser._id })}`);
    console.log(`😊 Mood entries: ${await MoodEntry.countDocuments({ userId: testUser._id })}`);
    console.log(`📝 Activities: ${await Activity.countDocuments({ userId: testUser._id })}`);

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

addSampleData(); 