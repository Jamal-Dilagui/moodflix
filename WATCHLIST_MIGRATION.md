# Watchlist Migration Feature

## Overview

The watchlist system has been updated to support both localStorage (for unauthenticated users) and database storage (for authenticated users). This allows for seamless migration of user data when they sign in.

## Features

### Dual Storage Support
- **Unauthenticated users**: Watchlist data is stored in localStorage
- **Authenticated users**: Watchlist data is stored in the database
- **Automatic detection**: The system automatically detects authentication status and uses the appropriate storage method

### Migration System
- **Automatic detection**: When users sign in, the system checks for localStorage watchlist data
- **Migration prompt**: Users are prompted to migrate their local data to the database
- **Seamless migration**: Local data is transferred to the database and localStorage is cleared
- **Error handling**: Failed migrations are handled gracefully with user feedback

### Enhanced Database Features
- **Status tracking**: Movies can have statuses like 'pending', 'watching', 'completed', 'abandoned'
- **Rich metadata**: Support for ratings, notes, watch progress, and more
- **Cross-device sync**: Watchlist data is synced across all devices when signed in

## API Endpoints

### GET /api/watchlist
Retrieves the user's watchlist from the database.

**Response:**
```json
{
  "watchlist": [
    {
      "_id": "watchlist_item_id",
      "userId": "user_id",
      "movieId": {
        "_id": "movie_id",
        "title": "Movie Title",
        "tmdbId": 123,
        "posterPath": "/path/to/poster.jpg",
        "overview": "Movie description",
        "releaseDate": "2024-01-01T00:00:00.000Z",
        "runtime": 120,
        "genres": ["Action", "Adventure"],
        "averageRating": 8.5
      },
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/watchlist
Adds a movie to the user's watchlist.

**Request:**
```json
{
  "tmdbId": 123,
  "movieData": {
    "title": "Movie Title",
    "overview": "Movie description",
    "poster_path": "/path/to/poster.jpg",
    "backdrop_path": "/path/to/backdrop.jpg",
    "release_date": "2024-01-01",
    "runtime": 120,
    "genres": [{"name": "Action"}, {"name": "Adventure"}],
    "vote_average": 8.5,
    "vote_count": 1000,
    "popularity": 85.5,
    "source": "manual"
  }
}
```

### DELETE /api/watchlist/[id]
Removes a movie from the user's watchlist.

### PATCH /api/watchlist/[id]
Updates a watchlist item.

**Request:**
```json
{
  "status": "completed",
  "userRating": 9,
  "notes": "Great movie!",
  "watchProgress": 100,
  "priority": "high"
}
```

### GET /api/watchlist/stats
Retrieves watchlist statistics.

**Response:**
```json
{
  "total": 10,
  "pending": 5,
  "watching": 2,
  "completed": 3,
  "abandoned": 0,
  "completedPercentage": 30
}
```

## Database Schema

### Watchlist Model
```javascript
{
  userId: ObjectId,           // Reference to User
  movieId: ObjectId,          // Reference to Movie
  status: String,             // 'pending', 'watching', 'completed', 'abandoned'
  userRating: Number,         // 0-10
  notes: String,              // User's notes
  watchProgress: Number,      // 0-100 percentage
  priority: String,           // 'low', 'medium', 'high', 'urgent'
  tags: [String],             // User-defined tags
  reminder: {
    enabled: Boolean,
    date: Date,
    message: String
  },
  moodWhenAdded: String,      // Mood when movie was added
  situationWhenAdded: String, // Situation when movie was added
  timeAvailable: String,      // Time available when added
  watchHistory: [{
    date: Date,
    progress: Number,
    duration: Number
  }],
  completedAt: Date,          // When movie was completed
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Model
```javascript
{
  title: String,
  tmdbId: Number,             // TMDb ID
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  runtime: Number,
  genres: [String],
  averageRating: Number,
  voteCount: Number,
  popularity: Number,
  // ... additional fields
}
```

## Migration Process

1. **Detection**: When a user signs in, the system checks for localStorage watchlist data
2. **Prompt**: If local data exists, a migration prompt is shown to the user
3. **Migration**: User can choose to migrate their data to the database
4. **Processing**: Each movie is added to the database via the API
5. **Cleanup**: After successful migration, localStorage is cleared
6. **Feedback**: User receives confirmation of migration results

## Usage Examples

### Adding a movie to watchlist
```javascript
import { addToWatchlist } from '@/app/lib/watchlist';

const movie = {
  tmdb_id: 123,
  title: 'Inception',
  overview: 'A thief who steals corporate secrets...',
  poster_path: '/inception.jpg',
  // ... other movie data
};

const success = await addToWatchlist(movie);
```

### Checking if movie is in watchlist
```javascript
import { isInWatchlist } from '@/app/lib/watchlist';

const inWatchlist = await isInWatchlist(123);
```

### Getting watchlist statistics
```javascript
import { getWatchlistStats } from '@/app/lib/watchlist';

const stats = await getWatchlistStats();
console.log(`Total: ${stats.total}, Completed: ${stats.completed}`);
```

## Benefits

1. **Seamless Experience**: Users can continue using the app without authentication
2. **Data Persistence**: Authenticated users have their data synced across devices
3. **Enhanced Features**: Database storage enables advanced features like status tracking
4. **Migration Path**: Easy migration from localStorage to database
5. **Backward Compatibility**: Existing localStorage data is preserved and can be migrated

## Security Considerations

- All API endpoints require authentication
- User data is isolated by userId
- Input validation is performed on all endpoints
- Error handling prevents data loss during migration

## Testing

Run the migration tests:
```bash
node test-watchlist-migration.js
```

## Future Enhancements

- Bulk operations for watchlist management
- Export/import functionality
- Advanced filtering and sorting
- Social features (sharing watchlists)
- Recommendation engine integration 