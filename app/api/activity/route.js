import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectMongoDb } from '@/app/lib/mongodb';
import Activity from '@/app/models/Activity';
import Movie from '@/app/models/Movie';

// POST /api/activity - Create a new activity
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, description, movieId, movieTitle } = body;

    if (!type || !description) {
      return NextResponse.json({ error: 'Type and description are required' }, { status: 400 });
    }

    await connectMongoDb();

    // Find movie if movieId is provided
    let movie = null;
    if (movieId) {
      movie = await Movie.findById(movieId);
    }

    // Create activity
    const activity = await Activity.create({
      userId: session.user.id,
      type,
      description,
      movieId: movie?._id || null,
      metadata: {
        movieTitle: movieTitle || movie?.title || 'Unknown Movie'
      }
    });

    await activity.populate('movieId', 'title posterPath');

    return NextResponse.json({ 
      message: 'Activity created successfully',
      activity 
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/activity - Get user activities
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;

    await connectMongoDb();

    const activities = await Activity.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('movieId', 'title posterPath');

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 