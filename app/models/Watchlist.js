import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Movie reference
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required'],
    index: true
  },

  // Watch status
  status: {
    type: String,
    enum: ['pending', 'watching', 'completed', 'abandoned'],
    default: 'pending'
  },

  // User's personal rating
  userRating: {
    type: Number,
    min: 0,
    max: 10
  },

  // User's review/notes
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },

  // Watch progress (for partial watching)
  watchProgress: {
    type: Number,
    min: 0,
    max: 100, // percentage
    default: 0
  },

  // Watch history
  watchHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      min: 0,
      max: 100
    },
    duration: {
      type: Number, // in minutes
      min: 0
    }
  }],

  // Completion date
  completedAt: {
    type: Date
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // Tags for personal organization
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  // Reminder settings
  reminder: {
    enabled: {
      type: Boolean,
      default: false
    },
    date: Date,
    message: String
  },

  // Source of recommendation
  source: {
    type: String,
    enum: ['manual', 'recommendation', 'friend', 'search', 'trending', 'popular'],
    default: 'manual'
  },

  // Mood when added
  moodWhenAdded: {
    type: String,
    enum: ['happy', 'sad', 'bored', 'motivated', 'romantic', 'adventurous', 'relaxing', 'inspiring', 'funny', 'dramatic', 'thrilling', 'mysterious']
  },

  // Situation when added
  situationWhenAdded: {
    type: String,
    enum: ['alone', 'family', 'date', 'friends', 'party', 'workout', 'study', 'travel', 'dinner', 'weekend', 'weekday']
  },

  // Time available when added
  timeAvailable: {
    type: String,
    enum: ['30', '60', '120', '180', '240'] // minutes
  },

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

// Compound index for unique user-movie combination
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// Indexes for better query performance
watchlistSchema.index({ userId: 1, status: 1 });
watchlistSchema.index({ userId: 1, priority: 1 });
watchlistSchema.index({ userId: 1, createdAt: -1 });
watchlistSchema.index({ status: 1 });
watchlistSchema.index({ priority: 1 });

// Virtual for time since added
watchlistSchema.virtual('timeSinceAdded').get(function() {
  const now = new Date();
  const diffInDays = Math.floor((now - this.createdAt) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Virtual for time since completed
watchlistSchema.virtual('timeSinceCompleted').get(function() {
  if (!this.completedAt) return null;
  
  const now = new Date();
  const diffInDays = Math.floor((now - this.completedAt) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
});

// Pre-save middleware to update completion date
watchlistSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

// Method to update watch progress
watchlistSchema.methods.updateProgress = function(progress, duration = 0) {
  this.watchProgress = progress;
  
  // Add to watch history
  this.watchHistory.push({
    date: new Date(),
    progress: progress,
    duration: duration
  });
  
  // Update status based on progress
  if (progress >= 90) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (progress > 0) {
    this.status = 'watching';
  }
  
  return this.save();
};

// Method to mark as completed
watchlistSchema.methods.markAsCompleted = function(rating = null, notes = null) {
  this.status = 'completed';
  this.watchProgress = 100;
  this.completedAt = new Date();
  
  if (rating !== null) this.userRating = rating;
  if (notes !== null) this.notes = notes;
  
  return this.save();
};

// Method to mark as abandoned
watchlistSchema.methods.markAsAbandoned = function(notes = null) {
  this.status = 'abandoned';
  if (notes !== null) this.notes = notes;
  
  return this.save();
};

// Static method to get user's watchlist
watchlistSchema.statics.getUserWatchlist = function(userId, status = null, limit = 20, skip = 0) {
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('movieId', 'title posterPath overview runtime releaseDate genres averageRating')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get user's completed movies
watchlistSchema.statics.getUserCompleted = function(userId, limit = 20, skip = 0) {
  return this.find({ userId, status: 'completed' })
    .populate('movieId', 'title posterPath overview runtime releaseDate genres averageRating')
    .sort({ completedAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get user's watching movies
watchlistSchema.statics.getUserWatching = function(userId) {
  return this.find({ userId, status: 'watching' })
    .populate('movieId', 'title posterPath overview runtime releaseDate genres averageRating')
    .sort({ updatedAt: -1 });
};

// Static method to check if movie is in user's watchlist
watchlistSchema.statics.isInWatchlist = function(userId, movieId) {
  return this.findOne({ userId, movieId }).select('_id status');
};

// Static method to get watchlist statistics
watchlistSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        watching: { $sum: { $cond: [{ $eq: ['$status', 'watching'] }, 1, 0] } },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        abandoned: { $sum: { $cond: [{ $eq: ['$status', 'abandoned'] }, 1, 0] } }
      }
    }
  ]);
};

const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);

export default Watchlist; 