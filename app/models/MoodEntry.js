import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Mood information
  mood: {
    type: String,
    required: [true, 'Mood is required'],
    enum: ['happy', 'sad', 'bored', 'motivated', 'romantic', 'adventurous', 'relaxing', 'inspiring', 'funny', 'dramatic', 'thrilling', 'mysterious', 'stressed', 'excited', 'melancholic', 'energetic']
  },

  // Intensity level (1-10)
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  // Situation context
  situation: {
    type: String,
    enum: ['alone', 'family', 'date', 'friends', 'party', 'workout', 'study', 'travel', 'dinner', 'weekend', 'weekday', 'work', 'vacation', 'holiday'],
    required: [true, 'Situation is required']
  },

  // Time available
  timeAvailable: {
    type: String,
    enum: ['30', '60', '120', '180', '240'], // minutes
    required: [true, 'Time available is required']
  },

  // Additional context
  weather: {
    type: String,
    enum: ['sunny', 'rainy', 'cloudy', 'snowy', 'stormy', 'clear', 'unknown']
  },

  // Time of day
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night', 'late-night']
  },

  // Day of week
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },

  // Energy level
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  // Stress level
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },

  // Social interaction preference
  socialPreference: {
    type: String,
    enum: ['alone', 'with-others', 'either'],
    default: 'either'
  },

  // Content type preference
  contentPreference: {
    type: String,
    enum: ['movies', 'tv-shows', 'documentaries', 'standup', 'either'],
    default: 'either'
  },

  // Genre preferences for this mood
  preferredGenres: [{
    type: String,
    enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western']
  }],

  // Notes about the mood
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },

  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],

  // Location (if user allows)
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },

  // Activity before mood entry
  previousActivity: {
    type: String,
    enum: ['work', 'exercise', 'social', 'rest', 'travel', 'study', 'entertainment', 'chores', 'other']
  },

  // Duration of mood (estimated)
  moodDuration: {
    type: Number, // in minutes
    min: 0
  },

  // Whether recommendations were requested
  recommendationsRequested: {
    type: Boolean,
    default: false
  },

  // Whether recommendations were helpful
  recommendationsHelpful: {
    type: Boolean
  },

  // Movies watched during this mood
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
moodEntrySchema.index({ userId: 1, createdAt: -1 });
moodEntrySchema.index({ userId: 1, mood: 1 });
moodEntrySchema.index({ userId: 1, situation: 1 });
moodEntrySchema.index({ mood: 1, situation: 1 });
moodEntrySchema.index({ createdAt: -1 });

// Virtual for time since entry
moodEntrySchema.virtual('timeSinceEntry').get(function() {
  const now = new Date();
  const diffInMinutes = Math.floor((now - this.createdAt) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`;
  return `${Math.floor(diffInMinutes / 10080)} weeks ago`;
});

// Virtual for mood description
moodEntrySchema.virtual('moodDescription').get(function() {
  const descriptions = {
    'happy': 'Feeling joyful and positive',
    'sad': 'Feeling down or melancholic',
    'bored': 'Looking for something engaging',
    'motivated': 'Feeling driven and energetic',
    'romantic': 'In a romantic mood',
    'adventurous': 'Craving excitement and adventure',
    'relaxing': 'Wanting to unwind and chill',
    'inspiring': 'Seeking motivation and inspiration',
    'funny': 'In the mood for humor',
    'dramatic': 'Wanting emotional depth',
    'thrilling': 'Seeking excitement and suspense',
    'mysterious': 'Interested in mystery and intrigue'
  };
  return descriptions[this.mood] || this.mood;
});

// Pre-save middleware to set day of week
moodEntrySchema.pre('save', function(next) {
  if (!this.dayOfWeek) {
    this.dayOfWeek = this.createdAt.toLocaleDateString('en-US', { weekday: 'lowercase' });
  }
  
  if (!this.timeOfDay) {
    const hour = this.createdAt.getHours();
    if (hour < 12) this.timeOfDay = 'morning';
    else if (hour < 17) this.timeOfDay = 'afternoon';
    else if (hour < 21) this.timeOfDay = 'evening';
    else this.timeOfDay = 'night';
  }
  
  next();
});

// Method to get mood trends
moodEntrySchema.statics.getMoodTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' },
        avgEnergy: { $avg: '$energyLevel' },
        avgStress: { $avg: '$stressLevel' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Method to get situation patterns
moodEntrySchema.statics.getSituationPatterns = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$situation',
        count: { $sum: 1 },
        moods: { $push: '$mood' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Method to get time patterns
moodEntrySchema.statics.getTimePatterns = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: '$timeOfDay',
        count: { $sum: 1 },
        avgMood: { $avg: { $indexOfArray: [['happy', 'sad', 'bored', 'motivated'], '$mood'] } }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Method to get recent moods
moodEntrySchema.statics.getRecentMoods = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('mood situation timeAvailable intensity createdAt');
};

// Method to find similar mood entries
moodEntrySchema.statics.findSimilarMoods = function(userId, mood, situation, limit = 5) {
  return this.find({
    userId,
    mood,
    situation
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('moviesWatched.movieId', 'title posterPath genres');
};

// Method to get mood statistics
moodEntrySchema.statics.getMoodStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalEntries: { $sum: 1 },
        uniqueMoods: { $addToSet: '$mood' },
        avgIntensity: { $avg: '$intensity' },
        avgEnergy: { $avg: '$energyLevel' },
        avgStress: { $avg: '$stressLevel' },
        mostCommonMood: { $max: '$mood' },
        mostCommonSituation: { $max: '$situation' }
      }
    }
  ]);
};

const MoodEntry = mongoose.models.MoodEntry || mongoose.model('MoodEntry', moodEntrySchema);

export default MoodEntry; 