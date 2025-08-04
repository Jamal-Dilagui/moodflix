import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectMongoDb } from '@/app/lib/mongodb';
import Watchlist from '@/app/models/Watchlist';

// GET /api/watchlist/stats - Get user's watchlist statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDb();
    
    const stats = await Watchlist.getUserStats(session.user.id);
    
    // If no stats found, return default values
    if (!stats || stats.length === 0) {
      return NextResponse.json({
        total: 0,
        pending: 0,
        watching: 0,
        completed: 0,
        abandoned: 0,
        completedPercentage: 0
      });
    }

    const userStats = stats[0];
    const total = userStats.total;
    const completed = userStats.completed;
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return NextResponse.json({
      total: userStats.total,
      pending: userStats.pending,
      watching: userStats.watching,
      completed: userStats.completed,
      abandoned: userStats.abandoned,
      completedPercentage
    });
  } catch (error) {
    console.error('Error fetching watchlist stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 