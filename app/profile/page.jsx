"use client"; // Required for client-side interactivity

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSmile, 
  faSadTear, 
  faFire, 
  faBookmark, 
  faCheck,
  faEdit,
  faTimes,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { useProfile } from '../hooks/useProfile';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { profileData, profileStats, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Initialize edit form when profile data loads
  useState(() => {
    if (profileData) {
      setEditForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || ''
      });
    }
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && profileData) {
      setEditForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || ''
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      
      // Track profile update activity
      try {
        await fetch('/api/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'profile',
            description: 'Updated profile information'
          })
        });
      } catch (error) {
        console.error('Error tracking profile activity:', error);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen gradient-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen gradient-bg text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-300 mb-4">Error loading profile: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return (
      <div className="min-h-screen gradient-bg text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please log in to view your profile</p>
          <a 
            href="/login"
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    }
    if (profileData?.name) {
      return profileData.name;
    }
    if (profileData?.email) {
      return profileData.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials
  const getUserInitials = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
    }
    if (profileData?.name) {
      return profileData.name.substring(0, 2).toUpperCase();
    }
    if (profileData?.email) {
      return profileData.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Get member since date
  const getMemberSince = () => {
    if (profileData?.createdAt) {
      const date = new Date(profileData.createdAt);
      return date.getFullYear();
    }
    return '2024';
  };

  return (
    <>
      <section className="gradient-bg text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Profile</h1>
            <p className="text-xl text-gray-100">Track your movie preferences and mood history</p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{getUserInitials()}</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={editForm.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={editForm.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faSave} className="text-sm" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-sm" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {getUserDisplayName()}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Movie enthusiast since {getMemberSince()}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start space-x-0 space-y-4 md:space-y-0 md:space-x-4">
                      <div className="text-center px-4">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profileStats?.stats?.moviesWatched || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Movies Watched</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profileStats?.stats?.watchlistCount || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Watchlist</div>
                      </div>
                      <div className="text-center px-4">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {profileStats?.stats?.moodsTracked || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Moods Tracked</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!isEditing && (
                <button 
                  onClick={handleEditToggle}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faEdit} className="text-sm" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Recent Moods */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-slide-up" 
              style={{ animationDelay: '0.2s' }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Moods</h3>
              <div className="space-y-3">
                {profileStats?.recentMoods && profileStats.recentMoods.length > 0 ? (
                  profileStats.recentMoods.slice(0, 3).map((mood, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faSmile} className="text-white text-sm" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{mood.mood}</span>
                      </div>
                      <span className="text-sm text-gray-500">{mood.timeAgo}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No moods tracked yet</p>
                )}
              </div>
            </div>

            {/* Favorite Genres */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-slide-up" 
              style={{ animationDelay: '0.4s' }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Favorite Genres</h3>
              <div className="space-y-3">
                {profileStats?.favoriteGenres && profileStats.favoriteGenres.length > 0 ? (
                  profileStats.favoriteGenres.slice(0, 4).map((genre, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{genre.genre}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${genre.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{genre.percentage}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No genres tracked yet</p>
                )}
              </div>
            </div>

            {/* Watch Time */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-slide-up" 
              style={{ animationDelay: '0.6s' }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Watch Time</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {profileStats?.stats?.monthlyWatchTime || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours this month</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">This week</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {profileStats?.stats?.weeklyWatchTime || 0} hours
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average/day</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {profileStats?.stats?.dailyAverage || 0} hours
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-slide-up" 
            style={{ animationDelay: '0.8s' }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {profileStats?.recentActivities && profileStats.recentActivities.length > 0 ? (
                profileStats.recentActivities.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon 
                        icon={activity.type === 'watchlist' ? faBookmark : 
                              activity.type === 'watched' ? faCheck : faSmile} 
                        className="text-white text-lg" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.timeAgo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;