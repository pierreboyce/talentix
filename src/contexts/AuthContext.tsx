'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthSession, AuthContextType, LoginCredentials, SignUpCredentials } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log('🟢 checkSession: Starting session check...');
      
      // Check localStorage for existing user session
      const storedUser = localStorage.getItem('talentix_user');
      const storedSession = localStorage.getItem('talentix_session');
      
      console.log('🟢 checkSession: storedUser:', storedUser);
      console.log('🟢 checkSession: storedSession:', storedSession);
      
      if (storedUser && storedSession) {
        const user = JSON.parse(storedUser);
        const session = JSON.parse(storedSession);
        
        console.log('🟢 checkSession: Parsed user:', user);
        console.log('🟢 checkSession: Parsed session:', session);
        
        // Check if session is still valid
        if (session.expires && new Date(session.expires) > new Date()) {
          console.log('🟢 checkSession: Session is valid, setting user and session');
          setUser(user);
          setSession(session);
        } else {
          console.log('🟢 checkSession: Session expired, clearing storage');
          console.log('🟢 checkSession: Session expires:', session.expires);
          console.log('🟢 checkSession: Current time:', new Date().toISOString());
          // Session expired, clear storage
          localStorage.removeItem('talentix_user');
          localStorage.removeItem('talentix_session');
        }
      } else {
        console.log('🟢 checkSession: No stored user or session found');
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
    } finally {
      console.log('🟢 checkSession: Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      // Check for existing user data first
      const storedUser = localStorage.getItem(`talentix_user_${credentials.email}`);
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Simple password check (in real app, use proper hashing)
        if (userData.password === credentials.password) {
          const session = {
            user: userData,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          
          setUser(userData);
          setSession(session);
          // Set lightweight cookie so middleware can detect auth on server
          document.cookie = `talentix-session=1; path=/; max-age=${24 * 60 * 60}`;
          
          // Store in localStorage
          localStorage.setItem('talentix_user', JSON.stringify(userData));
          localStorage.setItem('talentix_session', JSON.stringify(session));
          
          return { success: true };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      // Check if user already exists
      const existingUser = localStorage.getItem(`talentix_user_${credentials.email}`);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      // Create new user
      const userData = {
        id: `user_${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.location || 'Unknown',
        score: 0,
        emoji: '😊',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const session = {
        user: userData,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Store user data
      localStorage.setItem(`talentix_user_${credentials.email}`, JSON.stringify(userData));
      localStorage.setItem('talentix_user', JSON.stringify(userData));
      localStorage.setItem('talentix_session', JSON.stringify(session));

      setUser(userData);
      setSession(session);
      // Set lightweight cookie so middleware can detect auth on server
      document.cookie = `talentix-session=1; path=/; max-age=${24 * 60 * 60}`;

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Only clear session data, keep user data for XP persistence
      localStorage.removeItem('talentix_session');
      // Clear middleware cookie
      document.cookie = 'talentix-session=; Max-Age=0; path=/';
      
      // Clear OAuth provider data if user was OAuth (but keep user data)
      if (user?.id.includes('oauth_user_')) {
        const provider = user.id.includes('google') ? 'google' : 'microsoft';
        // Don't remove the OAuth user data - keep it for XP persistence
      }
      
      // Keep email-specific user data for XP persistence
      // localStorage.removeItem(`talentix_user_${user.email}`); // Commented out
      
      // Keep the main user data for XP persistence
      // localStorage.removeItem('talentix_user'); // Commented out
      
      // Only clear session-related data, not user profile data
      
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setSession(null);
      // Redirect to homepage after sign out
      window.location.href = '/';
    }
  };

  const signInWithProvider = async (provider: 'google' | 'microsoft') => {
    try {
      // Check if we have real OAuth credentials
      const clientIds = {
        google: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        microsoft: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID
      };
      
      if (!clientIds[provider]) {
        console.error(`❌ No ${provider} client ID configured. Please set up OAuth credentials.`);
        return { success: false, error: `${provider} OAuth not configured. Please set up credentials in .env.local` };
      }
      
      // Redirect to the actual OAuth provider
      const oauthUrls = {
        google: 'https://accounts.google.com/o/oauth2/v2/auth',
        microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
      };
      
      const redirectUris = {
        google: `${window.location.origin}/api/auth/callback/google`,
        microsoft: `${window.location.origin}/api/auth/callback/microsoft`
      };
      
      const scopes = {
        google: 'openid email profile',
        microsoft: 'https://graph.microsoft.com/user.read openid email profile'
      };
      
      // Build OAuth URL
      const baseParams: Record<string, string> = {
        client_id: clientIds[provider],
        redirect_uri: redirectUris[provider],
        scope: scopes[provider],
        response_type: 'code',
        state: `provider_${provider}_${Date.now()}`,
        prompt: 'select_account'
      };
      
      // Add provider-specific parameters
      if (provider === 'microsoft') {
        baseParams.access_type = 'offline';
      }
      
      const params = new URLSearchParams(baseParams);
      
      const oauthUrl = `${oauthUrls[provider]}?${params.toString()}`;
      
      console.log(`🔐 Redirecting to ${provider} OAuth:`, oauthUrl);
      console.log(`🔐 OAuth parameters:`, Object.fromEntries(params.entries()));
      console.log(`🔐 Expected callback URL:`, redirectUris[provider]);
      
      // Redirect to OAuth provider
      window.location.href = oauthUrl;
      
      return { success: true };
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      return { success: false, error: `Failed to initiate ${provider} sign-in` };
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      console.log('🟡 updateUser called with data:', data);
      console.log('🟡 Current user:', user);
      
      if (!user) {
        console.log('❌ No user logged in');
        return { success: false, error: 'No user logged in' };
      }

      // Update user data
      const updatedUser = { ...user, ...data, updatedAt: new Date().toISOString() };
      console.log('🟡 Updated user object:', updatedUser);
      
      // Update localStorage
      localStorage.setItem('talentix_user', JSON.stringify(updatedUser));
      console.log('🟡 Saved to talentix_user localStorage');
      
      if (user.email) {
        localStorage.setItem(`talentix_user_${user.email}`, JSON.stringify(updatedUser));
        console.log('🟡 Saved to talentix_user_${user.email} localStorage');
      }
      
      // Update OAuth user if applicable
      if (user.id.includes('oauth_user_')) {
        const provider = user.id.includes('google') ? 'google' : 'microsoft';
        localStorage.setItem(`talentix_oauth_${provider}`, JSON.stringify(updatedUser));
        console.log('🟡 Saved to talentix_oauth_${provider} localStorage');
      }
      
      // Update session
      if (session) {
        const updatedSession = { ...session, user: updatedUser };
        localStorage.setItem('talentix_session', JSON.stringify(updatedSession));
        setSession(updatedSession);
        console.log('🟡 Updated session');
      }
      
      // Update state
      setUser(updatedUser);
      console.log('🟡 Updated user state to:', updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Update user error:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  const refreshUser = async () => {
    console.log('🔄 refreshUser called - manually reloading user from localStorage');
    await checkSession();
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
 
 
 
 
 
 
 