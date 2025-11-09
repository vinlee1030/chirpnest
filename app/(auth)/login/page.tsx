'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isValidUserID } from '@/lib/validators';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userID, setUserID] = useState('');
  const [regKey, setRegKey] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (status === 'authenticated') {
    router.push('/home');
    return null;
  }

  const handleLogin = async () => {
    setError('');
    
    if (!userID.trim()) {
      setError('Please enter your userID');
      return;
    }

    if (!isValidUserID(userID)) {
      setError('UserID must be 3-15 characters, lowercase letters, numbers, and underscores only');
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists and get their provider
      const response = await fetch(`/api/users/${userID}`);
      
      if (response.ok) {
        const userData = await response.json();
        // User exists, proceed with their provider's OAuth
        const provider = userData.provider;
        await signIn(provider, { 
          callbackUrl: '/home',
        });
      } else {
        // User doesn't exist, show registration form
        setIsRegistering(true);
        setError('User not found. Please register below.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (provider: 'google' | 'github') => {
    setError('');

    if (!isValidUserID(userID)) {
      setError('UserID must be 3-15 characters, lowercase letters, numbers, and underscores only');
      return;
    }

    if (!regKey.trim()) {
      setError('Please enter the registration key');
      return;
    }

    setIsLoading(true);

    try {
      // Check userID availability and validate reg key
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID, regKey: regKey.trim(), provider }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Proceed with OAuth - registration will complete in NextAuth callback
        await signIn(provider, {
          callbackUrl: '/home',
        });
      } else {
        const error = await response.json();
        setError(error.error || 'Registration failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-scaleIn border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-pink-600 mb-2 animate-pulse-slow">
            ChirpNest 🐦
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Connect with the world</p>
        </div>

        {!isRegistering ? (
          // Login Form
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                UserID
              </label>
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value.toLowerCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="your_userid"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                3-15 characters, lowercase letters, numbers, and underscores only
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading || !userID.trim()}
              className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Processing...
                </span>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Don't have an account?</p>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setError('');
                }}
                className="text-primary dark:text-blue-400 hover:underline font-bold transition-colors duration-300"
              >
                Register here
              </button>
            </div>
          </div>
        ) : (
          // Registration Form
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Choose a UserID
              </label>
              <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value.toLowerCase())}
                placeholder="your_userid"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                3-15 characters, lowercase letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registration Key
              </label>
              <input
                type="text"
                value={regKey}
                onChange={(e) => setRegKey(e.target.value)}
                placeholder="Enter registration key"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span className="animate-pulse">💡</span>
                <span>Find the registration key in the README file</span>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Choose a provider to bind with this userID:
              </p>
              
              <button
                onClick={() => handleRegister('google')}
                disabled={isLoading || !userID.trim() || !regKey.trim()}
                className="w-full py-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Register with Google
              </button>

              <button
                onClick={() => handleRegister('github')}
                disabled={isLoading || !userID.trim() || !regKey.trim()}
                className="w-full py-4 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Register with GitHub
              </button>
            </div>

            {isLoading && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 animate-fadeIn">
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Redirecting to authentication...
                </span>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setError('');
                  setRegKey('');
                }}
                className="text-primary dark:text-blue-400 hover:underline text-sm font-bold transition-colors duration-300"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
