import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Recommendation session
  sessionId: {
    type: String,
    required: [true, 'Session ID is required'],
    index: true
  },

  // Mood context
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['happy', 'sad', 'bored', 'motivated', 'romantic', 'adventurous', 'relaxing', 'inspiring', 'funny', 'dramatic', 'thrilling', 'mysterious', 'stressed', 'excited', 'melancholic', 'energetic']
  },

  // Situation context
  situation: {
    type: String,
    required: [true, 'Situation is required'],
    enum: ['alone', 'family', 'date', 'friends', 'party', 'workout', 'study', 'travel', 'dinner', 'weekend', 'weekday', 'work', 'vacation', 'holiday']
  },

  // Time available
  timeAvailable: {
    type: String,
    required: [true, 'Time available is required'],
    enum: ['30', '60', '120', '180', '240'] // minutes
  },

  // Additional context
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  // Recommended movies
  movies: [{
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    rank: {
      type: Number,
      required: true,
      min: 1
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    reason: {
      type: String,
      required: true,
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    tags: [{
      type: String,
      enum: ['mood_match', 'genre_match', 'time_match', 'popular', 'trending', 'personal_favorite', 'similar_to_watched']
    }],
    userFeedback: {
      viewed: {
        type: Boolean,
        default: false
      },
      clicked: {
        type: Boolean,
        default: false
      },
      addedToWatchlist: {
        type: Boolean,
        default: false
      },
      rated: {
        type: Number,
        min: 0,
        max: 10
      },
      helpful: {
        type: Boolean
      }
    }
  }],

  // Recommendation algorithm used
  algorithm: {
    type: String,
    enum: ['mood_based', 'collaborative', 'content_based', 'hybrid', 'popularity', 'trending'],
    required: [true, 'Algorithm is required']
  },

  // Recommendation parameters
  parameters: {
    moodWeight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.4
    },
    genreWeight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.3
    },
    timeWeight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.2
    },
    popularityWeight: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.1
    },
    includeWatched: {
      type: Boolean,
      default: false
    },
    maxResults: {
      type: Number,
      min: 1,
      max: 50,
      default: 10
    }
  },

  // User preferences at time of recommendation
  userPreferences: {
    favoriteGenres: [{
      type: String,
      enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']
    }],
    contentRating: {
      type: String,
      enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      default: 'PG-13'
    },
    preferredLanguages: [{
      type: String,
      enum: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic']
    }]
  },

  // Performance metrics
  performance: {
    generationTime: Number, // in milliseconds
    cacheHit: {
      type: Boolean,
      default: false
    },
    totalMoviesConsidered: Number,
    filtersApplied: [String]
  },

  // User feedback on overall recommendation
  userFeedback: {
    overallRating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: {
      type: Boolean
    },
    comments: {
      type: String,
      maxlength: [1000, 'Comments cannot exceed 1000 characters']
    },
    moviesWatched: [{
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
      },
      rating: {
        type: Number,
        min: 0,
        max: 10
      },
      helpful: {
        type: Boolean
      }
    }]
  },

  // Expiration
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'expired', 'archived'],
    default: 'active'
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

// Indexes for better query performance
recommendationSchema.index({ userId: 1, createdAt: -1 });
recommendationSchema.index({ sessionId: 1 });
recommendationSchema.index({ mood: 1, situation: 1 });
recommendationSchema.index({ algorithm: 1 });
recommendationSchema.index({ status: 1 });
recommendationSchema.index({ expiresAt: 1 });

// Virtual for recommendation summary
recommendationSchema.virtual('summary').get(function() {
  return `${this.movies.length} movies recommended for ${this.mood} mood in ${this.situation} situation`;
});

// Virtual for time since recommendation
recommendationSchema.virtual('timeSinceRecommendation').get(function() {
  const now = new Date();
  const diffInMinutes = Math.floor((now - this.createdAt) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
  return `${Math.floor(diffInMinutes / 10080)} weeks ago`;
});

// Virtual for engagement rate
recommendationSchema.virtual('engagementRate').get(function() {
  if (this.movies.length === 0) return 0;
  
  const totalInteractions = this.movies.reduce((sum, movie) => {
    return sum + (movie.userFeedback.clicked ? 1 : 0) + 
           (movie.userFeedback.addedToWatchlist ? 1 : 0) + 
           (movie.userFeedback.viewed ? 1 : 0);
  }, 0);
  
  return (totalInteractions / this.movies.length) * 100;
});

// Pre-save middleware to check expiration
recommendationSchema.pre('save', function(next) {
  if (this.expiresAt && new Date() > this.expiresAt) {
    this.status = 'expired';
  }
  next();
});

// Method to get active recommendations for user
recommendationSchema.statics.getActiveRecommendations = function(userId, limit = 10) {
  return this.find({
    userId,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('movies.movieId', 'title posterPath overview runtime releaseDate genres averageRating');
};

// Method to get recommendations by mood and situation
recommendationSchema.statics.getRecommendationsByContext = function(userId, mood, situation, limit = 5) {
  return this.find({
    userId,
    mood,
    situation,
    status: 'active',
    expiresAt: { $gt: new Date() }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('movies.movieId', 'title posterPath overview runtime releaseDate genres averageRating');
};

// Method to get recommendation history
recommendationSchema.statics.getRecommendationHistory = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    userId,
    createdAt: { $gte: startDate }
  })
  .sort({ createdAt: -1 })
  .populate('movies.movieId', 'title posterPath');
};

// Method to get recommendation statistics
recommendationSchema.statics.getRecommendationStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalRecommendations: { $sum: 1 },
        totalMoviesRecommended: { $sum: { $size: '$movies' } },
        uniqueMoods: { $addToSet: '$mood' },
        uniqueSituations: { $addToSet: '$situation' },
        avgEngagement: {
          $avg: {
            $divide: [
              {
                $reduce: {
                  input: '$movies',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      { $cond: ['$$this.userFeedback.clicked', 1, 0] },
                      { $cond: ['$$this.userFeedback.addedToWatchlist', 1, 0] },
                      { $cond: ['$$this.userFeedback.viewed', 1, 0] }
                    ]
                  }
                }
              },
              { $size: '$movies' }
            ]
          }
        }
      }
    }
  ]);
};

// Method to update movie feedback
recommendationSchema.methods.updateMovieFeedback = function(movieId, feedback) {
  const movie = this.movies.find(m => m.movieId.toString() === movieId.toString());
  if (movie) {
    Object.assign(movie.userFeedback, feedback);
    return this.save();
  }
  throw new Error('Movie not found in recommendation');
};

// Method to update overall feedback
recommendationSchema.methods.updateOverallFeedback = function(feedback) {
  Object.assign(this.userFeedback, feedback);
  return this.save();
};

// Method to add watched movie feedback
recommendationSchema.methods.addWatchedMovie = function(movieId, rating, helpful) {
  this.userFeedback.moviesWatched.push({
    movieId,
    rating,
    helpful
  });
  return this.save();
};

// Method to get recommendation effectiveness
recommendationSchema.methods.getEffectiveness = function() {
  const totalMovies = this.movies.length;
  if (totalMovies === 0) return 0;
  
  const clickedCount = this.movies.filter(m => m.userFeedback.clicked).length;
  const watchlistCount = this.movies.filter(m => m.userFeedback.addedToWatchlist).length;
  const viewedCount = this.movies.filter(m => m.userFeedback.viewed).length;
  
  return {
    clickRate: (clickedCount / totalMovies) * 100,
    watchlistRate: (watchlistCount / totalMovies) * 100,
    viewRate: (viewedCount / totalMovies) * 100,
    overallEngagement: ((clickedCount + watchlistCount + viewedCount) / (totalMovies * 3)) * 100
  };
};

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);

export default Recommendation; 