import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export const useProfile = () => {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/profile/stats')
      ]);

      if (profileResponse.ok && statsResponse.ok) {
        const [profileData, statsData] = await Promise.all([
          profileResponse.json(),
          statsResponse.json()
        ]);

        console.log('🔍 useProfile Debug:', {
          profileData,
          statsData,
          stats: statsData?.stats,
          moviesWatched: statsData?.stats?.moviesWatched,
          watchlistCount: statsData?.stats?.watchlistCount,
          moodsTracked: statsData?.stats?.moodsTracked
        });

        setProfileData(profileData.user);
        setProfileStats(statsData);
      } else {
        console.error('❌ Profile API responses:', {
          profileOk: profileResponse.ok,
          statsOk: statsResponse.ok,
          profileStatus: profileResponse.status,
          statsStatus: statsResponse.status
        });
        throw new Error('Failed to fetch profile data');
      }
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Update profile data
  const updateProfile = useCallback(async (updateData) => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();
      setProfileData(result.user);
      return result;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  }, [session?.user?.id]);

  // Refresh profile data
  const refreshProfile = useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Load profile data when session changes
  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.id) {
      fetchProfileData();
    } else {
      setProfileData(null);
      setProfileStats(null);
      setLoading(false);
    }
  }, [session?.user?.id, status, fetchProfileData]);

  return {
    profileData,
    profileStats,
    loading,
    error,
    updateProfile,
    refreshProfile
  };
}; 