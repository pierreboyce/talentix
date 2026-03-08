'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

interface SubscriptionContextType {
  subscription: Subscription;
  isLoading: boolean;
  hasFeature: (feature: string) => boolean;
  canAccess: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
  forceSetSubscription: (subscription: Subscription) => void;
  isSubscribed: boolean;
  isPro: boolean;
  isEnterprise: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Temporary switch: keep paywall code in place but disable enforcement/UI gating.
const PAYWALL_HIDDEN_FOR_NOW = true;

// Feature definitions for each tier
const TIER_FEATURES = {
  free: [
    'cv_review_limited', // 1 per day
    'video_interview_limited', // 2 questions total
    'blog_posts_limited', // 6 posts total
    'basic_job_search',
    'community_support',
    'basic_templates'
  ],
  pro: [
    'cv_review_unlimited',
    'interview_practice_unlimited',
    'ai_job_matching',
    'premium_templates',
    'cover_letter_generator',
    'priority_support',
    'advanced_analytics',
    'salary_insights',
    'video_interview_practice'
  ],
  enterprise: [
    'personal_career_coach',
    'video_consultations',
    'linkedin_optimization',
    'custom_branding',
    'api_access',
    'white_label',
    'dedicated_manager',
    'custom_integrations'
  ]
};

// Usage limits for free tier
const FREE_TIER_LIMITS = {
  cv_reviews_per_day: 1,
  video_interview_questions_total: 2,
  blog_posts_total: 6,
  job_applications_per_day: 10
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({
    id: 'free',
    tier: 'free' as const,
    status: 'active' as const,
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const effectiveSubscription: Subscription = PAYWALL_HIDDEN_FOR_NOW
    ? {
        ...subscription,
        tier: 'pro',
        status: 'active'
      }
    : subscription;


  // Fetch subscription data
  const refreshSubscription = async () => {

    if (!user) {
      // For non-authenticated users, default to free tier
      setSubscription({
        id: 'free',
        tier: 'free' as const,
        status: 'active' as const,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const authToken = localStorage.getItem('auth_token');
      console.log('🔐 Making subscription API call with token:', authToken ? 'Token exists' : 'No token');
      console.log('🔑 Token preview:', authToken ? authToken.substring(0, 50) + '...' : 'null');
      
      // Skip API call if no valid token to prevent auth loops
      if (!authToken || authToken === 'null' || authToken === 'undefined') {
        console.log('⚠️ Skipping subscription API call - no valid token');
        setSubscription({
          id: 'free',
          tier: 'free',
          status: 'active',
          currentPeriodEnd: new Date(),
          cancelAtPeriodEnd: false
        });
        setIsLoading(false);
        return;
      }
      
      const response = await fetch('/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.subscription) {
          setSubscription({
            ...data.subscription,
            currentPeriodEnd: new Date(data.subscription.currentPeriodEnd),
            trialEnd: data.subscription.trialEnd ? new Date(data.subscription.trialEnd) : undefined
          });
        } else {
          // User has no subscription, default to free
          setSubscription({
            id: 'free',
            tier: 'free' as const,
            status: 'active' as const,
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false
          });
        }
      } else {
        console.error('❌ Subscription API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        
        // Default to free tier on error
        setSubscription({
          id: 'free',
          tier: 'free' as const,
          status: 'active' as const,
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        });
      }
    } catch (error) {
      
      
      // Check if it was a timeout/abort error
      if (error instanceof Error && error.name === 'AbortError') {
        
      }
      
      // Default to free tier on error
      setSubscription({
        id: 'free',
        tier: 'free' as const,
        status: 'active' as const,
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific feature
  const hasFeature = (feature: string): boolean => {
    if (PAYWALL_HIDDEN_FOR_NOW) {
      return true;
    }

    const tier = effectiveSubscription.tier;
    
    // Check if feature exists in current tier
    if (TIER_FEATURES[tier]?.includes(feature)) {
      return true;
    }

    // Check if feature exists in higher tiers (inheritance)
    if (tier === 'free') {
      return TIER_FEATURES.pro.includes(feature) || TIER_FEATURES.enterprise.includes(feature);
    }
    
    if (tier === 'pro') {
      return TIER_FEATURES.enterprise.includes(feature);
    }

    return false;
  };

  // Check if user can access a feature (considers subscription status)
  const canAccess = (feature: string): boolean => {
    if (PAYWALL_HIDDEN_FOR_NOW) {
      return true;
    }
    
    // Check subscription status
    if (effectiveSubscription.status !== 'active' && effectiveSubscription.status !== 'trialing') {
      return false;
    }

    return hasFeature(feature);
  };

  // Force set subscription (for success flows)
  const forceSetSubscription = (newSubscription: Subscription) => {
    setSubscription(newSubscription);
  };

  // Computed properties
  const isSubscribed = effectiveSubscription.tier !== 'free';
  const isPro = effectiveSubscription.tier === 'pro';
  const isEnterprise = effectiveSubscription.tier === 'enterprise';

  // Load subscription on auth change (but not during success flow)
  useEffect(() => {
    if (!authLoading) {
      // Check if we're in a success flow to avoid overwriting fresh data
      const urlParams = new URLSearchParams(window.location.search);
      const subscriptionStatus = urlParams.get('subscription');
      
      if (subscriptionStatus === 'success') {
        console.log('⚠️ Skipping automatic refresh during success flow');
        return;
      }
      
      refreshSubscription();
    }
  }, [user?.email, authLoading]);

  const contextValue: SubscriptionContextType = {
    subscription: effectiveSubscription,
    isLoading,
    hasFeature,
    canAccess,
    refreshSubscription,
    forceSetSubscription,
    isSubscribed,
    isPro,
    isEnterprise
  };

  // Expose refresh function globally for success handlers
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).talentixSubscriptionRefresh = refreshSubscription;
      (window as any).talentixForceSetSubscription = forceSetSubscription;
    }
  }, []);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Helper hook for checking specific features
export function useFeature(feature: string) {
  const { canAccess, hasFeature } = useSubscription();
  return {
    hasAccess: canAccess(feature),
    hasFeature: hasFeature(feature)
  };
}

// Export feature constants for use in components
export { TIER_FEATURES, FREE_TIER_LIMITS };
