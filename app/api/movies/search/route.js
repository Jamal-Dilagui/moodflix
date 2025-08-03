import { NextResponse } from 'next/server';
import { searchMovies, transformSearchResults } from '@/app/lib/tmdb';

/**
 * GET /api/movies/search
 * Search movies by query
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page')) || 1;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const searchResults = await searchMovies(query, page);
    const transformedResults = transformSearchResults(searchResults);

    return NextResponse.json(transformedResults);
  } catch (error) {
    console.error('Movie search error:', error);
    return NextResponse.json(
      { error: 'Failed to search movies', details: error.message },
      { status: 500 }
    );
  }
} 