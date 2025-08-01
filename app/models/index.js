// Export all models for easy importing
export { default as User } from './User.js';
export { default as Movie } from './Movie.js';
export { default as Watchlist } from './Watchlist.js';
export { default as MoodEntry } from './MoodEntry.js';
export { default as Activity } from './Activity.js';
export { default as Recommendation } from './Recommendation.js';

// Database connection utility
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Database disconnection utility
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

// Health check utility
export const checkDBHealth = async () => {
  try {
    const status = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: statusMap[status] || 'unknown',
      readyState: status,
      healthy: status === 1
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      healthy: false
    };
  }
};

// Model validation utilities
export const validateModel = (model, data) => {
  try {
    const instance = new model(data);
    const validationError = instance.validateSync();
    return {
      isValid: !validationError,
      errors: validationError ? validationError.errors : null
    };
  } catch (error) {
    return {
      isValid: false,
      errors: { general: error.message }
    };
  }
};

// Bulk operations utility
export const bulkOperations = {
  // Bulk insert with validation
  bulkInsert: async (model, documents) => {
    try {
      const validatedDocs = documents.map(doc => {
        const instance = new model(doc);
        instance.validateSync();
        return instance.toObject();
      });
      
      const result = await model.insertMany(validatedDocs);
      return {
        success: true,
        insertedCount: result.length,
        documents: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Bulk update
  bulkUpdate: async (model, filter, update, options = {}) => {
    try {
      const result = await model.updateMany(filter, update, options);
      return {
        success: true,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Bulk delete
  bulkDelete: async (model, filter) => {
    try {
      const result = await model.deleteMany(filter);
      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Data aggregation utilities
export const aggregationUtils = {
  // Get user statistics
  getUserStats: async (userId) => {
    try {
      const [user, watchlistStats, moodStats, activityStats] = await Promise.all([
        User.findById(userId).select('moviesWatched totalWatchTime watchlistCount lastActive'),
        Watchlist.getUserStats(userId),
        MoodEntry.getMoodStats(userId),
        Activity.getUserActivitySummary(userId)
      ]);

      return {
        user: user || {},
        watchlist: watchlistStats[0] || {},
        mood: moodStats[0] || {},
        activity: activityStats[0] || {}
      };
    } catch (error) {
      throw new Error(`Error getting user stats: ${error.message}`);
    }
  },

  // Get recommendation insights
  getRecommendationInsights: async (userId, days = 30) => {
    try {
      const [recommendationStats, moodTrends, genrePreferences] = await Promise.all([
        Recommendation.getRecommendationStats(userId, days),
        MoodEntry.getMoodTrends(userId, days),
        Watchlist.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId) } },
          { $lookup: { from: 'movies', localField: 'movieId', foreignField: '_id', as: 'movie' } },
          { $unwind: '$movie' },
          {
            $group: {
              _id: '$movie.genres',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ])
      ]);

      return {
        recommendations: recommendationStats[0] || {},
        moodTrends: moodTrends || [],
        genrePreferences: genrePreferences || []
      };
    } catch (error) {
      throw new Error(`Error getting recommendation insights: ${error.message}`);
    }
  }
};

// Export default for convenience
export default {
  User,
  Movie,
  Watchlist,
  MoodEntry,
  Activity,
  Recommendation,
  connectDB,
  disconnectDB,
  checkDBHealth,
  validateModel,
  bulkOperations,
  aggregationUtils
}; 