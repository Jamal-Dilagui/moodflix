"use client"; // Required for client-side interactivity

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSmile, 
  faSadTear, 
  faFire, 
  faBookmark, 
  faCheck 
} from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
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
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">John Doe</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Movie enthusiast since 2020</p>
                <div className="flex flex-wrap justify-center md:justify-start space-x-0 space-y-4 md:space-y-0 md:space-x-4">
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">47</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Movies Watched</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Watchlist</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Moods Tracked</div>
                  </div>
                </div>
              </div>
              <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Edit Profile
              </button>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faSmile} className="text-white text-sm" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Happy</span>
                  </div>
                  <span className="text-sm text-gray-500">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faSadTear} className="text-white text-sm" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Sad</span>
                  </div>
                  <span className="text-sm text-gray-500">1 week ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faFire} className="text-white text-sm" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Motivated</span>
                  </div>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
              </div>
            </div>

            {/* Favorite Genres */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-slide-up" 
              style={{ animationDelay: '0.4s' }}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Favorite Genres</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Comedy</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Adventure</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Romance</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Drama</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">55%</span>
                  </div>
                </div>
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
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">127</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hours this month</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">This week</span>
                    <span className="font-medium text-gray-900 dark:text-white">32 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Last week</span>
                    <span className="font-medium text-gray-900 dark:text-white">28 hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Average/day</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.2 hours</span>
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
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookmark} className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Added "La La Land" to watchlist</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Watched "The Grand Budapest Hotel"</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faSmile} className="text-white text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Got recommendations for "Happy" mood</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;