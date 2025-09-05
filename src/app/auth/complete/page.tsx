'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

export default function AuthComplete() {
  const { user, session } = useAuth();
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Save user data to your database
      console.log('Completing OAuth signup:', {
        name: user?.name,
        email: user?.email,
        location: location,
        provider: 'oauth'
      });
      
      // Redirect to dashboard or home page
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing signup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-slate-700 rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-bold mb-4">Complete your sign up</h2>
          <p className="text-gray-400">
            Welcome {user?.name}! We need one more detail to set up your account.
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-600 text-white placeholder-gray-400 py-3 px-4 rounded-xl border border-slate-500 focus:border-blue-400 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Completing...' : 'Complete Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
} 