# TMDb API Integration Setup Guide

This guide will help you set up The Movie Database (TMDb) API integration for your Moodflix project.

## 📋 Prerequisites

1. **TMDb API Key**: You need to get a free API key from [The Movie Database](https://www.themoviedb.org/settings/api)
2. **Next.js Project**: Your project should be running on Next.js 13+ with App Router

## 🔑 Getting Your TMDb API Key

1. Go to [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key for "Developer" use
5. Copy your API key

## ⚙️ Environment Setup

Create a `.env.local` file in your project root with the following variables:

```env
# TMDb API Configuration
TMDB_API_KEY=your_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

# Existing environment variables (add your actual values)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
MONGO_DB_URL=your_mongodb_url_here
```

## 🚀 Features Implemented

### 1. **Core TMDb API Functions** (`app/lib/tmdb.js`)
- ✅ Movie search functionality
- ✅ Popular movies fetching
- ✅ Movie details by ID
- ✅ Genre-based filtering
- ✅ Mood-based recommendations
- ✅ Image URL generation
- ✅ Data transformation utilities

### 2. **API Routes** (`app/api/movies/`)
- ✅ `/api/movies/search` - Search movies by query
- ✅ `/api/movies/popular` - Get popular movies
- ✅ `/api/movies/mood` - Get movies by mood
- ✅ `/api/movies/[id]` - Get movie details

### 3. **React Hooks** (`app/hooks/useTmdb.js`)
- ✅ `useTmdb()` - Main API interaction hook
- ✅ `useMovieState()` - Movie state management
- ✅ `useMovieSearch()` - Search with debouncing

### 4. **Updated Components**
- ✅ Movies Results Page - Now uses real TMDb data
- ✅ Dynamic movie cards with ratings
- ✅ Error handling and loading states
- ✅ Image fallback handling

## 🎯 API Endpoints

### Search Movies
```javascript
GET /api/movies/search?q=movie_title&page=1
```

### Popular Movies
```javascript
GET /api/movies/popular?page=1
```

### Movies by Mood
```javascript
GET /api/movies/mood?mood=happy&page=1
```

### Movie Details
```javascript
GET /api/movies/123
```

## 🎨 Image URLs

The integration uses TMDb's image service:
- **Poster URLs**: `https://image.tmdb.org/t/p/w500{poster_path}`
- **Backdrop URLs**: `https://image.tmdb.org/t/p/original{backdrop_path}`
- **Fallback**: `/images/placeholder.svg` for missing images

## 🔧 Usage Examples

### Basic Movie Search
```javascript
import { useTmdb } from '@/app/hooks/useTmdb';

const { searchMovies, loading, error } = useTmdb();

const handleSearch = async () => {
  const results = await searchMovies('Inception');
  console.log(results);
};
```

### Mood-Based Recommendations
```javascript
import { useTmdb } from '@/app/hooks/useTmdb';

const { getRecommendations } = useTmdb();

const getMoodMovies = async () => {
  const results = await getRecommendations('happy', '2 hours', 'alone');
  console.log(results);
};
```

### Movie State Management
```javascript
import { useMovieState } from '@/app/hooks/useTmdb';

const { movies, updateMovies, appendMovies } = useMovieState();

// Update movies
updateMovies(newMovies, page, totalPages, totalResults);

// Append more movies (for pagination)
appendMovies(moreMovies, nextPage);
```

## 🎭 Mood-to-Genre Mapping

The system maps user moods to appropriate movie genres:

| Mood | Genres |
|------|--------|
| Happy | Comedy, Family, Animation |
| Sad | Drama, Romance |
| Excited | Action, Adventure, Science Fiction |
| Relaxed | Fantasy, Animation, Family |
| Romantic | Romance, Drama |
| Adventurous | Adventure, Action, Fantasy |
| Nostalgic | Drama, History, Music |
| Inspired | Drama, Documentary, History |

## 🛠️ Error Handling

The integration includes comprehensive error handling:
- ✅ API key validation
- ✅ Network error handling
- ✅ Rate limiting protection
- ✅ Image loading fallbacks
- ✅ User-friendly error messages

## 🔄 Data Transformation

All TMDb data is transformed to match your app's format:

```javascript
{
  id: 123,
  title: "Movie Title",
  overview: "Movie description...",
  poster: "https://image.tmdb.org/t/p/w500/path.jpg",
  year: 2023,
  rating: 8.5,
  duration: "120 min",
  // ... more fields
}
```

## 🚀 Next Steps

1. **Test the Integration**: Start your development server and test the movie search
2. **Customize Mood Mapping**: Adjust the mood-to-genre mapping in `app/lib/tmdb.js`
3. **Add More Features**: Implement pagination, filters, or advanced search
4. **Optimize Performance**: Add caching for frequently accessed data
5. **Enhance UI**: Add more movie details, trailers, or cast information

## 📝 Notes

- The API key should be kept secure and never exposed to the client
- TMDb has rate limits (40 requests per 10 seconds for API key)
- All API calls are made server-side for security
- Image URLs are generated dynamically based on TMDb paths

## 🆘 Troubleshooting

### Common Issues:

1. **API Key Error**: Make sure your `.env.local` file has the correct API key
2. **CORS Issues**: All API calls are server-side, so CORS shouldn't be an issue
3. **Image Loading**: Check that the image paths are correct and the placeholder exists
4. **Rate Limiting**: If you hit rate limits, implement request throttling

### Debug Mode:
Add this to your `.env.local` for debugging:
```env
DEBUG_TMDB=true
```

This will log all API requests to the console.

---

🎬 **Happy coding!** Your Moodflix app now has real movie data from TMDb! 