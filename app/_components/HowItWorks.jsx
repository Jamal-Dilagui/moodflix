import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faBrain, 
  faPlay 
} from '@fortawesome/free-solid-svg-icons';

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get personalized movie recommendations in just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon icon={faHeart} className="text-white text-2xl" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Step 1
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your mood, time availability, and situation to help us understand your preferences
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon icon={faBrain} className="text-white text-2xl" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Step 2
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let our AI analyze your choices and find the perfect movies and shows for you
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon icon={faPlay} className="text-white text-2xl" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                Step 3
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get your personalized recommendations and start watching your perfect match!
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <a
            href="/recommend"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 