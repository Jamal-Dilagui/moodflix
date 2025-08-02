import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
          Find Your Perfect
          <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Movie Match
          </span>
        </h1>
        <p 
          className="text-xl md:text-2xl mb-8 text-gray-100 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          Discover movies and shows that match your mood, time, and situation
        </p>
        <div 
          className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <i className="fas fa-star text-yellow-400"></i>
              <span>Mood-based</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <i className="fas fa-clock text-blue-400"></i>
              <span>Time-aware</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <i className="fas fa-users text-green-400"></i>
              <span>Situation-fit</span>
          </div>
        </div>
        
        {/* Call to Action Button */}
        <div 
          className="animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            href="/recommend"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Recommendations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;