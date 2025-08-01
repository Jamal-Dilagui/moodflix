"use client"; // Required for client-side interactivity

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../_components/NavBar';

const login = () => {
  const router = useRouter();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
    firstName: '',
    lastName: '',
    agree: false
  });

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFormData({
      email: '',
      password: '',
      remember: false,
      firstName: '',
      lastName: '',
      agree: false
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginForm) {
      // Handle login logic
      console.log('Login submitted:', formData);
      router.push('/dashboard');
    } else {
      // Handle signup logic
      console.log('Signup submitted:', formData);
      router.push('/dashboard');
    }
  };

  return (
    <>
      {/* <NavBar/> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className={`${isLoginForm ? 'block' : 'hidden'}`}>
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-400">Sign in to your MoodFlix account</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-slide-up">
              {/* Social Login Buttons */}
              <div className="space-y-4 mb-8">
                <button 
                  className="social-button w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-3"
                  onClick={() => {/* Add Google auth logic */}}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
                
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      id="remember" 
                      name="remember" 
                      type="checkbox" 
                      checked={formData.remember}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
                  </div>
                  <a href="#" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Forgot password?</a>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account? 
                  <button 
                    onClick={toggleForm} 
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium ml-1"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className={`${!isLoginForm ? 'block' : 'hidden'}`}>
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-400">Join MoodFlix to get personalized recommendations</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-slide-up">
              {/* Social Sign Up Buttons */}
              <div className="space-y-4 mb-8">
                <button 
                  className="social-button w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center space-x-3"
                  onClick={() => {/* Add Google auth logic */}}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with email</span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                  <input 
                    type="email" 
                    id="signupEmail" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input 
                    type="password" 
                    id="signupPassword" 
                    name="password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300" 
                    placeholder="Create a password"
                  />
                </div>

                <div className="flex items-center">
                  <input 
                    id="agree" 
                    name="agree" 
                    type="checkbox" 
                    required 
                    checked={formData.agree}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">Privacy Policy</a>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account? 
                  <button 
                    onClick={toggleForm} 
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 font-medium ml-1"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
   
  );
};

export default login;