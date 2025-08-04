'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { hasLocalWatchlistData, migrateWatchlistToDatabase } from '@/app/lib/watchlistMigration';

const WatchlistMigration = () => {
  const { data: session, status } = useSession();
  const [showMigration, setShowMigration] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has local watchlist data
    if (status === 'authenticated' && session?.user?.id) {
      const hasLocalData = hasLocalWatchlistData();
      if (hasLocalData) {
        setShowMigration(true);
      }
    }
  }, [session, status]);

  const handleMigration = async () => {
    setMigrating(true);
    setMigrationResult(null);

    try {
      const result = await migrateWatchlistToDatabase(session.user.id);
      setMigrationResult(result);
      
      if (result.success && result.migrated > 0) {
        // Hide migration prompt after successful migration
        setTimeout(() => {
          setShowMigration(false);
        }, 3000);
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        message: 'Migration failed. Please try again.'
      });
    } finally {
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    setShowMigration(false);
  };

  if (!showMigration) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faSync} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Sync Your Watchlist
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              We found movies in your local storage. Would you like to sync them to your account?
            </p>
            
            {migrationResult && (
              <div className={`mt-3 p-2 rounded text-xs ${
                migrationResult.success 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              }`}>
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon 
                    icon={migrationResult.success ? faCheckCircle : faExclamationTriangle} 
                    className="w-3 h-3" 
                  />
                  <span>{migrationResult.message}</span>
                </div>
                {migrationResult.success && migrationResult.migrated > 0 && (
                  <div className="mt-1 text-xs">
                    Migrated {migrationResult.migrated} of {migrationResult.total} items
                  </div>
                )}
              </div>
            )}
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={handleMigration}
                disabled={migrating}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  migrating
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {migrating ? (
                  <div className="flex items-center justify-center space-x-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></div>
                    <span>Syncing...</span>
                  </div>
                ) : (
                  'Sync Now'
                )}
              </button>
              
              <button
                onClick={handleSkip}
                disabled={migrating}
                className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistMigration; 