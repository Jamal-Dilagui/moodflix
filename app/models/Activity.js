import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Activity type
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: [
      'login', 'logout', 'signup',
      'mood_entry', 'mood_update', 'mood_delete',
      'movie_search', 'movie_view', 'movie_rate', 'movie_review',
      'watchlist_add', 'watchlist_remove', 'watchlist_update',
      'recommendation_request', 'recommendation_view', 'recommendation_feedback',
      'profile_update', 'settings_change',
      'share_movie', 'share_profile',
      'friend_add', 'friend_remove',
      'subscription_upgrade', 'subscription_downgrade',
      'notification_read', 'notification_click',
      'error_occurred', 'support_request'
    ]
  },

  // Activity category
  category: {
    type: String,
    enum: ['authentication', 'mood', 'movie', 'watchlist', 'recommendation', 'profile', 'social', 'subscription', 'notification', 'system'],
    required: [true, 'Activity category is required']
  },

  // Activity description
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Related data (flexible object for different activity types)
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Related movie (if applicable)
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },

  // Related mood entry (if applicable)
  moodEntryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MoodEntry'
  },

  // Related watchlist item (if applicable)
  watchlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watchlist'
  },

  // Session information
  sessionId: {
    type: String
  },

  // Device information
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'tv', 'unknown']
    },
    browser: String,
    os: String,
    userAgent: String
  },

  // Location information (if available)
  location: {
    country: String,
    region: String,
    city: String,
    ip: String
  },

  // Performance metrics
  performance: {
    loadTime: Number, // in milliseconds
    responseTime: Number, // in milliseconds
    errorOccurred: {
      type: Boolean,
      default: false
    },
    errorMessage: String
  },

  // User agent string
  userAgent: String,

  // IP address
  ipAddress: String,

  // Referrer information
  referrer: {
    url: String,
    domain: String,
    source: String
  },

  // Page/route information
  page: {
    url: String,
    title: String,
    route: String
  },

  // Success/failure status
  success: {
    type: Boolean,
    default: true
  },

  // Error information (if applicable)
  error: {
    code: String,
    message: String,
    stack: String
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, type: 1 });
activitySchema.index({ userId: 1, category: 1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ category: 1, createdAt: -1 });
activitySchema.index({ movieId: 1 });
activitySchema.index({ moodEntryId: 1 });
activitySchema.index({ sessionId: 1 });
activitySchema.index({ success: 1 });
activitySchema.index({ priority: 1 });

// Virtual for time since activity
activitySchema.virtual('timeSinceActivity').get(function() {
  const now = new Date();
  const diffInMinutes = Math.floor((now - this.createdAt) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
  return `${Math.floor(diffInMinutes / 10080)} weeks ago`;
});

// Virtual for activity summary
activitySchema.virtual('activitySummary').get(function() {
  const summaries = {
    'login': 'User logged in',
    'logout': 'User logged out',
    'signup': 'User created account',
    'mood_entry': 'User recorded mood',
    'movie_search': 'User searched for movies',
    'movie_view': 'User viewed movie details',
    'movie_rate': 'User rated a movie',
    'watchlist_add': 'User added movie to watchlist',
    'watchlist_remove': 'User removed movie from watchlist',
    'recommendation_request': 'User requested recommendations',
    'profile_update': 'User updated profile',
    'share_movie': 'User shared a movie'
  };
  return summaries[this.type] || this.description;
});

// Pre-save middleware to set category based on type
activitySchema.pre('save', function(next) {
  if (!this.category) {
    const categoryMap = {
      'login': 'authentication',
      'logout': 'authentication',
      'signup': 'authentication',
      'mood_entry': 'mood',
      'mood_update': 'mood',
      'mood_delete': 'mood',
      'movie_search': 'movie',
      'movie_view': 'movie',
      'movie_rate': 'movie',
      'movie_review': 'movie',
      'watchlist_add': 'watchlist',
      'watchlist_remove': 'watchlist',
      'watchlist_update': 'watchlist',
      'recommendation_request': 'recommendation',
      'recommendation_view': 'recommendation',
      'recommendation_feedback': 'recommendation',
      'profile_update': 'profile',
      'settings_change': 'profile',
      'share_movie': 'social',
      'share_profile': 'social',
      'friend_add': 'social',
      'friend_remove': 'social',
      'subscription_upgrade': 'subscription',
      'subscription_downgrade': 'subscription',
      'notification_read': 'notification',
      'notification_click': 'notification',
      'error_occurred': 'system',
      'support_request': 'system'
    };
    this.category = categoryMap[this.type] || 'system';
  }
  next();
});

// Method to get user activity summary
activitySchema.statics.getUserActivitySummary = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalActivities: { $sum: 1 },
        uniqueTypes: { $addToSet: '$type' },
        uniqueCategories: { $addToSet: '$category' },
        successfulActivities: { $sum: { $cond: ['$success', 1, 0] } },
        failedActivities: { $sum: { $cond: ['$success', 0, 1] } }
      }
    }
  ]);
};

// Method to get activity by type
activitySchema.statics.getActivityByType = function(userId, type, limit = 20, skip = 0) {
  return this.find({ userId, type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('movieId', 'title posterPath')
    .populate('moodEntryId', 'mood situation');
};

// Method to get recent activities
activitySchema.statics.getRecentActivities = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('movieId', 'title posterPath')
    .populate('moodEntryId', 'mood situation');
};

// Method to get activity trends
activitySchema.statics.getActivityTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 },
        types: { $addToSet: '$type' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Method to get most common activities
activitySchema.statics.getMostCommonActivities = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        lastOccurrence: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Method to get error activities
activitySchema.statics.getErrorActivities = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    userId,
    success: false,
    createdAt: { $gte: startDate }
  })
  .sort({ createdAt: -1 })
  .select('type description error createdAt');
};

// Method to track movie interaction
activitySchema.statics.trackMovieInteraction = function(userId, type, movieId, data = {}) {
  const descriptions = {
    'movie_view': 'Viewed movie details',
    'movie_rate': 'Rated a movie',
    'movie_review': 'Reviewed a movie',
    'movie_search': 'Searched for movies'
  };
  
  return this.create({
    userId,
    type,
    movieId,
    description: descriptions[type] || 'Movie interaction',
    data,
    category: 'movie'
  });
};

// Method to track mood interaction
activitySchema.statics.trackMoodInteraction = function(userId, type, moodEntryId, data = {}) {
  const descriptions = {
    'mood_entry': 'Recorded mood entry',
    'mood_update': 'Updated mood entry',
    'mood_delete': 'Deleted mood entry'
  };
  
  return this.create({
    userId,
    type,
    moodEntryId,
    description: descriptions[type] || 'Mood interaction',
    data,
    category: 'mood'
  });
};

const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

export default Activity; 