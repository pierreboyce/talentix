'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function OAuthSetupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthData, setOauthData] = useState<any>(null);
  const [needsEmail, setNeedsEmail] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    // Get OAuth data from URL params
    const oauthUserParam = searchParams.get('oauth_user');
    const provider = searchParams.get('provider');
    
    if (oauthUserParam && provider) {
      try {
        const userData = JSON.parse(decodeURIComponent(oauthUserParam));
        setOauthData({ ...userData, provider });
        
        // Check if we need email input
        if (userData.needsEmailAndName || !userData.email) {
          setNeedsEmail(true);
          setEmail('');
          setName('');
        } else {
          // We have real OAuth data
          setEmail(userData.email);
          setName(userData.name || '');
        }
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        router.push('/');
      }
    } else {
      // No OAuth data, redirect to home
      router.push('/');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !oauthData) return;
    if (needsEmail && !email.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Update the OAuth user data with the chosen name and email
      const updatedUserData = {
        ...oauthData,
        name: name.trim(),
        email: needsEmail ? email.trim() : oauthData.email,
        updatedAt: new Date().toISOString()
      };
      
      // Store in localStorage and update AuthContext
      localStorage.setItem('talentix_user', JSON.stringify(updatedUserData));
      localStorage.setItem(`talentix_oauth_${oauthData.provider}`, JSON.stringify(updatedUserData));
      localStorage.setItem(`talentix_user_${updatedUserData.email}`, JSON.stringify(updatedUserData));
      
      // Create session
      const session = {
        user: updatedUserData,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        token: `oauth_token_${oauthData.provider}_${Date.now()}`
      };
      localStorage.setItem('talentix_session', JSON.stringify(session));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting up OAuth user:', error);
      setIsLoading(false);
    }
  };

  if (!oauthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Talentix!</h1>
          <p className="text-gray-600">What should we call you?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {needsEmail && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
              maxLength={50}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || (needsEmail && !email.trim()) || isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up your account...' : 'Continue to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {needsEmail ? (
              `Signing in with ${oauthData.provider === 'google' ? 'Google' : 'Microsoft'}`
            ) : (
              `Signed in with ${oauthData.provider === 'google' ? 'Google' : 'Microsoft'}: ${oauthData.email}`
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 
 
 
 
 
 
 
 