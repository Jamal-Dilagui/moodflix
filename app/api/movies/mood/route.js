import { NextResponse } from 'next/server';
import { getMoviesByMood, transformSearchResults } from '@/app/lib/tmdb';

/**
 * GET /api/movies/mood
 * Get movies filtered by mood
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood');
    const page = parseInt(searchParams.get('page')) || 1;

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood parameter is required' },
        { status: 400 }
      );
    }

    const moodMovies = await getMoviesByMood(mood, page);
    const transformedResults = transformSearchResults(moodMovies);

    return NextResponse.json(transformedResults);
  } catch (error) {
    console.error('Mood movies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies by mood', details: error.message },
      { status: 500 }
    );
  }
} 