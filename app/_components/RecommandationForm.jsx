"use client"; // Required for client-side interactivity

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSmile, 
  faSadTear, 
  faMeh, 
  faFire, 
  faClock, 
  faUser, 
  faHome, 
  faHeart, 
  faUsers 
} from '@fortawesome/free-solid-svg-icons';

const RecommendationForm = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelection = (type, value) => {
    switch (type) {
      case 'mood':
        setSelectedMood(value);
        break;
      case 'time':
        setSelectedTime(value);
        break;
      case 'situation':
        setSelectedSituation(value);
        break;
    }
  };

  const handleGetRecommendations = async () => {
    if (selectedMood && selectedTime && selectedSituation) {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/deepseek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mood: selectedMood,
            time: selectedTime,
            situation: selectedSituation
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log('AI Recommendations:', data);
          // You can navigate to results page or show recommendations here
          alert(`Found ${data.data.total_results} recommendations for you!`);
        } else {
          console.error('API Error:', data);
          alert('Failed to get recommendations. Please try again.');
        }
      } catch (error) {
        console.error('Network Error:', error);
        alert('Network error. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Mood Selection */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">How are you feeling today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { mood: 'happy', icon: faSmile, gradient: 'from-yellow-400 to-orange-400' },
              { mood: 'sad', icon: faSadTear, gradient: 'from-blue-400 to-purple-400' },
              { mood: 'bored', icon: faMeh, gradient: 'from-gray-400 to-gray-600' },
              { mood: 'motivated', icon: faFire, gradient: 'from-green-400 to-teal-400' }
            ].map((item) => (
              <div
                key={item.mood}
                className={`mood-card bg-white dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer border-2 transition-all ${
                  selectedMood === item.mood
                    ? 'border-purple-500 dark:border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handleSelection('mood', item.mood)}
                data-mood={item.mood}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <FontAwesomeIcon icon={item.icon} className="text-white text-xl" />
                </div>
                <h3 className="font-semibold capitalize">{item.mood}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">How much time do you have?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { time: '30', label: '30 minutes', desc: 'Quick watch', gradient: 'from-red-400 to-pink-400' },
              { time: '60', label: '1 hour', desc: 'Standard episode', gradient: 'from-yellow-400 to-orange-400' },
              { time: '120', label: '2+ hours', desc: 'Movie time', gradient: 'from-green-400 to-teal-400' }
            ].map((item) => (
              <div
                key={item.time}
                className={`time-card bg-white dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer border-2 transition-all ${
                  selectedTime === item.time
                    ? 'border-purple-500 dark:border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handleSelection('time', item.time)}
                data-time={item.time}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-lg">{item.label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Situation Selection */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '1s' }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">What's your situation?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { situation: 'alone', icon: faUser, gradient: 'from-purple-400 to-indigo-400' },
              { situation: 'family', icon: faHome, gradient: 'from-pink-400 to-rose-400' },
              { situation: 'date', icon: faHeart, gradient: 'from-red-400 to-pink-400' },
              { situation: 'friends', icon: faUsers, gradient: 'from-blue-400 to-cyan-400' }
            ].map((item) => (
              <div
                key={item.situation}
                className={`situation-card bg-white dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer border-2 transition-all ${
                  selectedSituation === item.situation
                    ? 'border-purple-500 dark:border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
                onClick={() => handleSelection('situation', item.situation)}
                data-situation={item.situation}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <FontAwesomeIcon icon={item.icon} className="text-white text-xl" />
                </div>
                <h3 className="font-semibold capitalize">{item.situation}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Get Recommendations Button */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <button
            onClick={handleGetRecommendations}
            disabled={!selectedMood || !selectedTime || !selectedSituation || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Getting AI Recommendations...</span>
              </div>
            ) : (
              'Get AI Recommendations'
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendationForm;