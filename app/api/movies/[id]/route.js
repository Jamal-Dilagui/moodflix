import { NextResponse } from 'next/server';
import { getMovieDetails, transformMovieData } from '@/app/lib/tmdb';

/**
 * GET /api/movies/[id]
 * Get movie details by ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const movieId = parseInt(id);

    if (!movieId || isNaN(movieId)) {
      return NextResponse.json(
        { error: 'Valid movie ID is required' },
        { status: 400 }
      );
    }

    const movieDetails = await getMovieDetails(movieId);
    const transformedMovie = transformMovieData(movieDetails);

    // Add additional details from the full movie object
    const enhancedMovie = {
      ...transformedMovie,
      runtime: movieDetails.runtime,
      budget: movieDetails.budget,
      revenue: movieDetails.revenue,
      status: movieDetails.status,
      tagline: movieDetails.tagline,
      credits: movieDetails.credits,
      videos: movieDetails.videos,
      similar: movieDetails.similar,
    };

    return NextResponse.json(enhancedMovie);
  } catch (error) {
    console.error('Movie details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details', details: error.message },
      { status: 500 }
    );
  }
} 