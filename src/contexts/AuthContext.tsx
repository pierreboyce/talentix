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
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [hasSignedOut, setHasSignedOut] = useState(false);
  const [isUpdatingStorage, setIsUpdatingStorage] = useState(false);

  // Check for existing session on mount and listen for storage changes
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
    
    // Set a timeout to ensure loading never hangs indefinitely
    const timeoutId = setTimeout(() => {
      console.warn('🟨 Auth session check timed out, setting loading to false');
      setLoading(false);
      setIsCheckingSession(false);
    }, 5000); // 5 second timeout
    
    checkSession().finally(() => {
      clearTimeout(timeoutId);
    });
    
    // Debounced storage change handler to prevent infinite loops
    const debouncedCheckSession = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        if (isUpdatingStorage) {
          console.log('🟡 Storage changed but we are updating it ourselves, skipping...');
          return;
        }
        if (!isCheckingSession) {
          console.log('🔄 Storage changed (debounced), rechecking session...');
          checkSession();
        } else {
          console.log('🟡 Storage changed but session check already in progress, skipping...');
        }
      }, 500); // Increased debounce to 500ms to reduce noise
    };
    
    // TEMPORARILY DISABLED - Storage event listeners causing infinite loops
    console.log('🚫 Storage event listeners DISABLED to prevent infinite loops');
    
    // const handleStorageChange = (e: StorageEvent) => {
    //   // Only respond to storage changes from OTHER tabs/windows
    //   if ((e.key === 'talentix_user' || e.key === 'talentix_session') && e.storageArea === localStorage) {
    //     console.log('🔄 External storage change detected, key:', e.key);
    //     debouncedCheckSession();
    //   }
    // };
    
    // Listen for custom storage events (for same-tab updates) - keep this one for OAuth
    const handleCustomStorageEvent = (e: CustomEvent) => {
      if (!e.detail?.internal) {
        console.log('🔄 External custom storage event, rechecking session...');
        debouncedCheckSession();
      }
    };
    
    // window.addEventListener('storage', handleStorageChange); // DISABLED
    window.addEventListener('talentix-auth-update', handleCustomStorageEvent as EventListener);
    
    return () => {
      clearTimeout(timeoutId);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      // window.removeEventListener('storage', handleStorageChange); // DISABLED
      window.removeEventListener('talentix-auth-update', handleCustomStorageEvent as EventListener);
    };
  }, []); // Remove isCheckingSession dependency to prevent re-running effect

  const checkSession = async () => {
    const now = Date.now();
    
    // Prevent session checks after explicit sign-out
    if (hasSignedOut) {
      console.log('🟡 checkSession: User has signed out, skipping session check');
      return;
    }
    
    // Prevent concurrent session checks
    if (isCheckingSession) {
      console.log('🟡 checkSession: Already checking session, skipping...');
      return;
    }

    // Prevent too frequent session checks (minimum 5 seconds between checks to reduce noise)
    if (now - lastCheckTime < 5000) {
      console.log('🟡 checkSession: Too soon since last check, skipping...', { 
        timeSinceLastCheck: now - lastCheckTime 
      });
      return;
    }

    try {
      setIsCheckingSession(true);
      setLastCheckTime(now);
      setLoading(true);
      console.log('🟢 checkSession: Starting session check...');
      
      // First check if we have a server-side session
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            console.log('🟢 checkSession: Valid server session found, user:', data.user);
            
            // Update localStorage with server data (without triggering events)
            const sessionData = {
              user: data.user,
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
              token: `session_${data.user.id}` // Use user ID instead of timestamp to prevent constant changes
            };
            
            // Silently update localStorage without triggering storage events
            const currentUser = localStorage.getItem('talentix_user');
            const currentSession = localStorage.getItem('talentix_session');
            const newUserStr = JSON.stringify(data.user);
            const newSessionStr = JSON.stringify(sessionData);
            
            if (currentUser !== newUserStr || currentSession !== newSessionStr) {
              setIsUpdatingStorage(true);
              if (currentUser !== newUserStr) {
                localStorage.setItem('talentix_user', newUserStr);
              }
              if (currentSession !== newSessionStr) {
                localStorage.setItem('talentix_session', newSessionStr);
              }
              // Reset flag after a short delay
              setTimeout(() => setIsUpdatingStorage(false), 100);
            }
            
            setUser(data.user);
            setSession(sessionData);
            return;
          }
        }
      } catch (serverError) {
        console.log('🟡 checkSession: Server check failed, falling back to localStorage');
      }

      // If no server session, check localStorage as fallback
      const storedUser = localStorage.getItem('talentix_user');
      const storedSession = localStorage.getItem('talentix_session');
      
      console.log('🟢 checkSession: storedUser:', !!storedUser);
      console.log('🟢 checkSession: storedSession:', !!storedSession);
      
      if (storedUser && storedSession) {
        const user = JSON.parse(storedUser);
        const session = JSON.parse(storedSession);
        
        console.log('🟢 checkSession: Parsed user:', user?.email || 'no email');
        console.log('🟢 checkSession: Session expires:', session?.expires);
        
        // Check if session is still valid
        if (session.expires && new Date(session.expires) > new Date()) {
          console.log('🟢 checkSession: Local session is valid, checking if update needed');
          
          setUser(user);
          setSession(session);
        } else {
          console.log('🟢 checkSession: Local session expired, clearing storage');
          localStorage.removeItem('talentix_user');
          localStorage.removeItem('talentix_session');
          setUser(null);
          setSession(null);
        }
      } else {
        console.log('🟢 checkSession: No stored user or session found');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
      setUser(null);
      setSession(null);
    } finally {
      console.log('🟢 checkSession: Setting loading to false');
      setLoading(false);
      setIsCheckingSession(false);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      console.log('🔐 Starting signin process for:', credentials.email);
      setLoading(true); // Set loading during signin
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        return { success: false, error: data.error || 'Sign in failed' };
      }

      if (!data.success) {
        setLoading(false);
        return { success: false, error: data.error || 'Sign in failed' };
      }

      // Set user data from server response
      const userData = data.user;
      const now = Date.now();
      const sessionData = {
        user: userData,
        expires: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        token: `session_${now}`
      };

      console.log('✅ Signin successful, storing user data:', userData.email);

      // Store in localStorage for client-side access (but server is source of truth)
      localStorage.setItem('talentix_user', JSON.stringify(userData));
      localStorage.setItem('talentix_session', JSON.stringify(sessionData));
      
      // Store JWT token for API authentication (if provided)
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('✅ JWT token stored for API authentication');
      }

      // Reset sign-out flag when signing in
      setHasSignedOut(false);
      setUser(userData);
      setSession(sessionData);
      setLoading(false); // Clear loading after successful signin

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    console.log('🚀 Frontend signUp called with:', { 
      name: credentials.name, 
      email: credentials.email, 
      hasPassword: !!credentials.password,
      location: credentials.location 
    });
    
    try {
      console.log('📡 Making signup API request...');
      const response = await fetch('/api/auth/signup-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      console.log('📡 Signup API response status:', response.status);
      console.log('📡 Signup API response ok:', response.ok);

      const data = await response.json();
      console.log('📡 Signup API response data:', data);

      if (!response.ok) {
        return { success: false, error: data.error || 'Sign up failed' };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Sign up failed' };
      }

      // Set user data from server response
      const userData = data.user;
      const now = Date.now();
      const sessionData = {
        user: userData,
        expires: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        token: `session_${now}`
      };

      // Store in localStorage for client-side access (but server is source of truth)
      localStorage.setItem('talentix_user', JSON.stringify(userData));
      localStorage.setItem('talentix_session', JSON.stringify(sessionData));

      // Reset sign-out flag when signing up
      setHasSignedOut(false);
      setUser(userData);
      setSession(sessionData);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Set sign-out flag to prevent further session checks
      setHasSignedOut(true);
      
      // Call server-side signout API
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      // Ensure points persist under email-based key even after sign out
      try {
        const storedUserStr = localStorage.getItem('talentix_user');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          if (storedUser?.email) {
            const idKey = storedUser?.id ? `talentix-points-${storedUser.id}` : null;
            const emailKey = `talentix-points-email-${storedUser.email.toLowerCase()}`;
            const currentPoints = (idKey && localStorage.getItem(idKey)) || localStorage.getItem(emailKey);
            if (currentPoints != null) {
              localStorage.setItem(emailKey, currentPoints);
            }
          }
        }
      } catch {}

      // Clear local storage
      localStorage.removeItem('talentix_session');
      localStorage.removeItem('talentix_user');
      localStorage.removeItem('auth_token'); // Clear JWT token
      
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
      
      // Use consistent redirect URIs that match what's registered in OAuth providers
      // Always use non-www version to match registered URIs
      let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      
      // FORCE production URL if we detect we're on the production domain
      if (window.location.hostname === 'talentix.co.uk' || window.location.hostname === 'www.talentix.co.uk') {
        baseUrl = 'https://talentix.co.uk';
      }
      
      if (baseUrl.includes('://www.')) {
        baseUrl = baseUrl.replace('://www.', '://');
      }
      const redirectUris = {
        google: `${baseUrl}/api/auth/callback/google`,
        microsoft: `${baseUrl}/api/auth/callback/microsoft`
      };
      
      const scopes = {
        google: 'openid email profile',
        // Microsoft needs User.Read to reliably return name/email via Graph
        microsoft: 'openid email profile https://graph.microsoft.com/User.Read'
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
        baseParams.response_mode = 'query';
      }
      
      const params = new URLSearchParams(baseParams);
      
      const oauthUrl = `${oauthUrls[provider]}?${params.toString()}`;
      
      
      
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
    const now = Date.now();
    console.log('🔄 refreshUser called - manually reloading user from localStorage');
    
    // Prevent too frequent refresh calls
    if (now - lastCheckTime < 1000) {
      console.log('🔄 refreshUser: Too soon since last check, skipping...', {
        timeSinceLastCheck: now - lastCheckTime
      });
      return;
    }
    
    if (!isCheckingSession) {
      await checkSession();
    } else {
    }
  };

  // Expose refresh function globally for OAuth callbacks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).talentixAuthRefresh = refreshUser;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).talentixAuthRefresh;
      }
    };
  }, []);

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
 
 
 
 
 
 
 