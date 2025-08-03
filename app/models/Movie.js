import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  tagline: {
    type: String,
    maxlength: [500, 'Tagline cannot exceed 500 characters']
  },
  overview: {
    type: String,
    required: [true, 'Movie overview is required'],
    maxlength: [2000, 'Overview cannot exceed 2000 characters']
  },

  // Media
  posterPath: {
    type: String,
    required: [true, 'Poster path is required']
  },
  backdropPath: String,
  trailerUrl: String,
  runtime: {
    type: Number,
    min: [1, 'Runtime must be at least 1 minute']
  },

  // Release Information
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required']
  },

  // Classification
  genres: [{
    type: String,
    enum: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'],
    required: true
  }],
  contentRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
    required: true
  },

  // Ratings and Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  userRating: {
    type: Number,
    min: 0,
    max: 10
  },

  // Mood and Situation Tags
  moodTags: [{
    type: String,
    enum: ['happy', 'sad', 'bored', 'motivated', 'romantic', 'adventurous', 'relaxing', 'inspiring', 'funny', 'dramatic', 'thrilling', 'mysterious']
  }],
  situationTags: [{
    type: String,
    enum: ['alone', 'family', 'date', 'friends', 'party', 'workout', 'study', 'travel', 'dinner', 'weekend', 'weekday']
  }],
  timeTags: [{
    type: String,
    enum: ['30', '60', '120', '180', '240'] // minutes
  }],

  // Cast and Crew
  director: {
    type: String,
    trim: true
  },
  cast: [{
    name: {
      type: String,
      required: true
    },
    character: String,
    order: Number
  }],
  crew: [{
    name: {
      type: String,
      required: true
    },
    job: {
      type: String,
      required: true
    },
    department: String
  }],

  // Awards and Recognition
  awards: [{
    name: String,
    category: String,
    year: Number,
    won: Boolean
  }],
  nominations: [{
    name: String,
    category: String,
    year: Number
  }],

  // Financial Information
  budget: Number,
  revenue: Number,
  productionCompanies: [{
    name: String,
    country: String
  }],

  // Technical Details
  aspectRatio: String,
  colorInfo: String,
  soundMix: [String],
  negativeFormat: String,
  cinematographicProcess: String,

  // External IDs
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Status
  status: {
    type: String,
    enum: ['Released', 'Post Production', 'In Production', 'Planned', 'Canceled'],
    default: 'Released'
  },

  // Popularity Metrics
  popularity: {
    type: Number,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
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

// Virtual for formatted runtime
movieSchema.virtual('formattedRuntime').get(function() {
  if (!this.runtime) return null;
  const hours = Math.floor(this.runtime / 60);
  const minutes = this.runtime % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Virtual for year
movieSchema.virtual('year').get(function() {
  return this.releaseDate ? this.releaseDate.getFullYear() : null;
});

// Virtual for age rating
movieSchema.virtual('ageRating').get(function() {
  const ratings = {
    'G': 'All Ages',
    'PG': 'Parental Guidance',
    'PG-13': 'Teens and Up',
    'R': 'Adults Only',
    'NC-17': 'Adults Only'
  };
  return ratings[this.contentRating] || this.contentRating;
});

// Indexes for better query performance
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ averageRating: -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ moodTags: 1 });
movieSchema.index({ situationTags: 1 });
movieSchema.index({ timeTags: 1 });

// Method to update average rating
movieSchema.methods.updateAverageRating = function() {
  // This would typically be called after adding/updating a rating
  // Implementation depends on your rating system
};

// Method to get movie recommendations based on mood
movieSchema.statics.findByMood = function(mood, limit = 10) {
  return this.find({
    moodTags: mood,
    status: 'Released'
  })
  .sort({ averageRating: -1, popularity: -1 })
  .limit(limit);
};

// Method to get movies by situation
movieSchema.statics.findBySituation = function(situation, limit = 10) {
  return this.find({
    situationTags: situation,
    status: 'Released'
  })
  .sort({ averageRating: -1, popularity: -1 })
  .limit(limit);
};

// Method to get movies by time duration
movieSchema.statics.findByTime = function(maxMinutes, limit = 10) {
  return this.find({
    runtime: { $lte: maxMinutes },
    status: 'Released'
  })
  .sort({ averageRating: -1, popularity: -1 })
  .limit(limit);
};

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie; 