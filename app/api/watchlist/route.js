import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectMongoDb } from '@/app/lib/mongodb';
import Watchlist from '@/app/models/Watchlist';
import Movie from '@/app/models/Movie';

// GET /api/watchlist - Get user's watchlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDb();
    
    const watchlist = await Watchlist.getUserWatchlist(session.user.id);
    
    return NextResponse.json({ watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/watchlist - Add movie to watchlist
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tmdbId, movieData } = body;

    if (!tmdbId) {
      return NextResponse.json({ error: 'TMDb ID is required' }, { status: 400 });
    }

    await connectMongoDb();

    // Check if movie exists in database, if not create it
    let movie = await Movie.findOne({ tmdbId });
    
    if (!movie && movieData) {
      // Convert genres from TMDb format to Movie model format
      let genres = [];
      if (movieData.genres && Array.isArray(movieData.genres)) {
        // Handle both array of strings and array of objects with name property
        genres = movieData.genres.map(genre => {
          if (typeof genre === 'string') {
            return genre;
          } else if (genre && typeof genre === 'object' && genre.name) {
            return genre.name;
          }
          return null;
        }).filter(genre => genre !== null);
      }

      // Map TMDb genres to our enum values
      const genreMapping = {
        'Action': 'Action',
        'Adventure': 'Adventure',
        'Animation': 'Animation',
        'Comedy': 'Comedy',
        'Crime': 'Crime',
        'Documentary': 'Documentary',
        'Drama': 'Drama',
        'Family': 'Family',
        'Fantasy': 'Fantasy',
        'Horror': 'Horror',
        'Mystery': 'Mystery',
        'Romance': 'Romance',
        'Science Fiction': 'Sci-Fi',
        'Sci-Fi': 'Sci-Fi',
        'Thriller': 'Thriller',
        'War': 'War',
        'Western': 'Western'
      };

      const mappedGenres = genres
        .map(genre => genreMapping[genre])
        .filter(genre => genre) // Remove unmapped genres
        .slice(0, 3); // Limit to 3 genres

      movie = await Movie.create({
        tmdbId,
        title: movieData.title || 'Unknown Title',
        overview: movieData.overview || 'No overview available',
        posterPath: movieData.poster_path || '/images/placeholder.svg',
        backdropPath: movieData.backdrop_path || '/images/placeholder.svg',
        releaseDate: movieData.release_date ? new Date(movieData.release_date) : new Date(),
        runtime: movieData.runtime || 90,
        genres: mappedGenres.length > 0 ? mappedGenres : ['Drama'], // Default to Drama if no genres
        averageRating: movieData.vote_average || 0,
        voteCount: movieData.vote_count || 0,
        popularity: movieData.popularity || 0,
        country: movieData.production_countries?.[0]?.name || 'Unknown',
        language: movieData.original_language || 'en',
        contentRating: 'PG-13', // Default, could be enhanced
        status: 'Released'
      });
    }

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Check if already in watchlist
    const existingWatchlistItem = await Watchlist.findOne({
      userId: session.user.id,
      movieId: movie._id
    });

    if (existingWatchlistItem) {
      return NextResponse.json({ 
        error: 'Movie already in watchlist',
        watchlistItem: existingWatchlistItem 
      }, { status: 409 });
    }

    // Add to watchlist
    const watchlistItem = await Watchlist.create({
      userId: session.user.id,
      movieId: movie._id,
      status: 'pending',
      source: movieData?.source || 'manual'
    });

    await watchlistItem.populate('movieId');

    // Track activity
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'watchlist',
          description: `Added "${movie.title}" to watchlist`,
          movieId: movie._id,
          movieTitle: movie.title
        })
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }

    return NextResponse.json({ 
      message: 'Movie added to watchlist',
      watchlistItem 
    });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/watchlist - Clear all watchlist items for the user
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDb();
    
    // Delete all watchlist items for the user
    const result = await Watchlist.deleteMany({ userId: session.user.id });
    
    console.log(`Deleted ${result.deletedCount} watchlist items for user ${session.user.id}`);
    
    return NextResponse.json({ 
      message: 'Watchlist cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 