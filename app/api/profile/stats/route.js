import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { connectMongoDb } from '@/app/lib/mongodb';
import Watchlist from '@/app/models/Watchlist';
import User from '@/app/models/User';
import MoodEntry from '@/app/models/MoodEntry';
import Activity from '@/app/models/Activity';
import Movie from '@/app/models/Movie';

// GET /api/profile/stats - Get user profile statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDb();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get watchlist statistics
    const watchlistStatsResult = await Watchlist.getUserStats(session.user.id);
    const watchlistStats = watchlistStatsResult.length > 0 ? watchlistStatsResult[0] : { total: 0, completed: 0, pending: 0, watching: 0, abandoned: 0 };
    
    console.log('🔍 Profile Stats Debug:', {
      userId: session.user.id,
      watchlistStatsResult,
      watchlistStats
    });
    
    // Get mood history (last 10 entries)
    const recentMoods = await MoodEntry.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('mood createdAt');

    // Get recent activities (last 10 entries)
    const recentActivities = await Activity.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('movieId', 'title posterPath');

    // Calculate favorite genres from watchlist
    const watchlistItems = await Watchlist.find({ userId: session.user.id })
      .populate('movieId', 'genres');

    const genreCounts = {};
    let totalMovies = 0;

    watchlistItems.forEach(item => {
      if (item.movieId && item.movieId.genres) {
        item.movieId.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
        totalMovies++;
      }
    });

    // Convert to percentages and sort
    const favoriteGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        percentage: totalMovies > 0 ? Math.round((count / totalMovies) * 100) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Calculate watch time (estimated based on completed movies)
    const completedMovies = await Watchlist.find({ 
      userId: session.user.id, 
      status: 'completed' 
    }).populate('movieId', 'runtime');

    const totalWatchTime = completedMovies.reduce((total, item) => {
      return total + (item.movieId?.runtime || 0);
    }, 0);

    const monthlyWatchTime = Math.round(totalWatchTime * 0.3); // Estimate 30% of total time this month
    const weeklyWatchTime = Math.round(monthlyWatchTime / 4);
    const dailyAverage = Math.round(monthlyWatchTime / 30);

    // Format recent moods
    const formattedMoods = recentMoods.map(entry => ({
      mood: entry.mood,
      date: entry.createdAt,
      timeAgo: getTimeAgo(entry.createdAt)
    }));

    // Format recent activities
    const formattedActivities = recentActivities.map(activity => ({
      type: activity.type,
      description: activity.description,
      movieTitle: activity.movieId?.title || 'Unknown Movie',
      date: activity.createdAt,
      timeAgo: getTimeAgo(activity.createdAt)
    }));

    const profileStats = {
      user: {
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'User',
        email: user.email,
        memberSince: user.createdAt
      },
      stats: {
        moviesWatched: watchlistStats.completed || 0,
        watchlistCount: watchlistStats.total || 0,
        moodsTracked: recentMoods.length,
        totalWatchTime: totalWatchTime,
        monthlyWatchTime: monthlyWatchTime,
        weeklyWatchTime: weeklyWatchTime,
        dailyAverage: dailyAverage
      },
      recentMoods: formattedMoods,
      favoriteGenres: favoriteGenres,
      recentActivities: formattedActivities
    };

    return NextResponse.json(profileStats);
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
} 