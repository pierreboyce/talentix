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
  isSubscribed: boolean;
  isPro: boolean;
  isEnterprise: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

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
    tier: 'free',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscription data
  const refreshSubscription = async () => {
    if (!user) {
      // For non-authenticated users, default to free tier
      setSubscription({
        id: 'free',
        tier: 'free',
        status: 'active',
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
      
      const response = await fetch('/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
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
            tier: 'free',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            cancelAtPeriodEnd: false
          });
        }
      } else {
        // Default to free tier on error
        setSubscription({
          id: 'free',
          tier: 'free',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      
      // Check if it was a timeout/abort error
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Subscription API request timed out, defaulting to free tier');
      }
      
      // Default to free tier on error
      setSubscription({
        id: 'free',
        tier: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has a specific feature
  const hasFeature = (feature: string): boolean => {

    const tier = subscription.tier;
    
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
    
    // Check subscription status
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return false;
    }

    return hasFeature(feature);
  };

  // Computed properties
  const isSubscribed = subscription.tier !== 'free';
  const isPro = subscription.tier === 'pro';
  const isEnterprise = subscription.tier === 'enterprise';

  // Load subscription on auth change
  useEffect(() => {
    if (!authLoading) {
      refreshSubscription();
    }
  }, [user, authLoading]);

  const contextValue: SubscriptionContextType = {
    subscription,
    isLoading,
    hasFeature,
    canAccess,
    refreshSubscription,
    isSubscribed,
    isPro,
    isEnterprise
  };

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
