import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectMongoDb } from '@/app/lib/mongodb';
import Watchlist from '@/app/models/Watchlist';
import Movie from '@/app/models/Movie';

// DELETE /api/watchlist/[id] - Remove movie from watchlist
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Watchlist item ID is required' }, { status: 400 });
    }

    await connectMongoDb();

    // Find the watchlist item and ensure it belongs to the user
    const watchlistItem = await Watchlist.findOne({
      _id: id,
      userId: session.user.id
    });

    if (!watchlistItem) {
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
    }

    await Watchlist.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/watchlist/[id] - Update watchlist item
export async function PATCH(request, { params }) {
  try {
    console.log('🔄 PATCH /api/watchlist/[id] called');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('❌ Unauthorized - no session user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    
    console.log('📋 PATCH request details:', {
      id,
      body,
      userId: session.user.id
    });
    
    if (!id) {
      console.log('❌ No watchlist item ID provided');
      return NextResponse.json({ error: 'Watchlist item ID is required' }, { status: 400 });
    }

    await connectMongoDb();

    // Find the watchlist item and ensure it belongs to the user
    const watchlistItem = await Watchlist.findOne({
      _id: id,
      userId: session.user.id
    });

    console.log('🔍 Found watchlist item:', watchlistItem ? {
      _id: watchlistItem._id,
      status: watchlistItem.status,
      userId: watchlistItem.userId
    } : 'Not found');

    if (!watchlistItem) {
      console.log('❌ Watchlist item not found');
      return NextResponse.json({ error: 'Watchlist item not found' }, { status: 404 });
    }

    // Update allowed fields
    const allowedUpdates = [
      'status', 'userRating', 'notes', 'watchProgress', 
      'priority', 'tags', 'reminder', 'moodWhenAdded', 
      'situationWhenAdded', 'timeAvailable'
    ];

    const updates = {};
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    console.log('🔄 Updates to apply:', updates);

    // Handle status changes
    if (updates.status === 'completed' && !watchlistItem.completedAt) {
      updates.completedAt = new Date();
      console.log('✅ Added completedAt timestamp');
    }

    // Update the watchlist item
    const updatedWatchlistItem = await Watchlist.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate('movieId');

    console.log('✅ Updated watchlist item:', {
      _id: updatedWatchlistItem._id,
      status: updatedWatchlistItem.status,
      completedAt: updatedWatchlistItem.completedAt
    });

    return NextResponse.json({ 
      message: 'Watchlist item updated',
      watchlistItem: updatedWatchlistItem 
    });
  } catch (error) {
    console.error('❌ Error updating watchlist item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 