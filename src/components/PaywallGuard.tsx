'use client';

import { ReactNode } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Crown, Zap, Lock } from 'lucide-react';

interface PaywallGuardProps {
  feature: string;
  tier?: 'pro' | 'enterprise';
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

const tierInfo = {
  pro: {
    name: 'Talentix Pro',
    price: '£19.99/month',
    icon: <Zap size={24} />,
    gradient: 'from-yellow-400 to-orange-500'
  },
  enterprise: {
    name: 'Enterprise',
    price: '£49.99/month', 
    icon: <Crown size={24} />,
    gradient: 'from-purple-500 to-pink-600'
  }
};

export default function PaywallGuard({ 
  feature, 
  tier = 'pro', 
  children, 
  fallback,
  showUpgradePrompt = true 
}: PaywallGuardProps) {
  const { canAccess, subscription } = useSubscription();

  // If user has access, render children
  if (canAccess(feature)) {
    return <>{children}</>;
  }

  // If fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // If showUpgradePrompt is false, render nothing
  if (!showUpgradePrompt) {
    return null;
  }

  // Default upgrade prompt
  const requiredTier = tierInfo[tier];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${requiredTier.gradient} text-white mb-4`}>
        {requiredTier.icon}
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Upgrade to {requiredTier.name}
      </h3>
      
      <p className="text-gray-600 mb-4">
        This feature requires {requiredTier.name} subscription.
      </p>
      
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Lock size={16} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          Current plan: {subscription.tier}
        </span>
      </div>
      
      <button 
        onClick={() => {
          // This would open the pricing modal
          // You can dispatch a custom event or use a global state
          window.dispatchEvent(new CustomEvent('openPricingModal'));
        }}
        className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${requiredTier.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
      >
        Upgrade to {requiredTier.name}
        <span className="ml-2 text-sm opacity-90">
          {requiredTier.price}
        </span>
      </button>
    </div>
  );
}

// Hook for easier usage in components
export function usePaywall(feature: string) {
  const { canAccess } = useSubscription();
  return {
    hasAccess: canAccess(feature),
    PaywallGuard: ({ children, ...props }: Omit<PaywallGuardProps, 'feature'>) => (
      <PaywallGuard feature={feature} {...props}>
        {children}
      </PaywallGuard>
    )
  };
}
