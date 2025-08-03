import { NextResponse } from 'next/server';
import { getPopularMovies, transformSearchResults } from '@/app/lib/tmdb';

/**
 * GET /api/movies/popular
 * Get popular movies
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;

    const popularMovies = await getPopularMovies(page);
    const transformedResults = transformSearchResults(popularMovies);

    return NextResponse.json(transformedResults);
  } catch (error) {
    console.error('Popular movies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular movies', details: error.message },
      { status: 500 }
    );
  }
} 