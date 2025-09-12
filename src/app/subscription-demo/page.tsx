'use client';

import { useSubscription } from '../../contexts/SubscriptionContext';
import PaywallGuard from '../../components/PaywallGuard';
import { Crown, Zap, Star, Lock } from 'lucide-react';

export default function SubscriptionDemo() {
  const { subscription, isLoading } = useSubscription();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription System Demo
          </h1>
          <p className="text-xl text-gray-600">
            See how the paywall system works with different subscription tiers
          </p>
        </div>

        {/* Current Subscription Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            {subscription.tier === 'free' && <Star className="w-12 h-12 text-gray-400" />}
            {subscription.tier === 'pro' && <Zap className="w-12 h-12 text-yellow-400" />}
            {subscription.tier === 'enterprise' && <Crown className="w-12 h-12 text-purple-500" />}
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Current Plan: {subscription.tier.toUpperCase()}
            </h2>
            <p className="text-gray-600 mb-4">
              Status: {subscription.status}
            </p>
            {subscription.tier === 'free' && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openPricingModal'))}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Feature Examples */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Tier Feature */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-gray-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Basic CV Review</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Available to all users (1 review per day for free tier)
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">✅ You have access to this feature!</p>
              <p className="text-green-600 text-sm mt-1">
                This feature is available to all subscription tiers.
              </p>
            </div>
          </div>

          {/* Pro Tier Feature */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Unlimited CV Reviews</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Requires Talentix Pro subscription
            </p>
            <PaywallGuard feature="cv_review_unlimited" tier="pro">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">✅ You have access to this feature!</p>
                <p className="text-green-600 text-sm mt-1">
                  Analyze unlimited CVs with AI-powered insights.
                </p>
              </div>
            </PaywallGuard>
          </div>

          {/* Enterprise Tier Feature */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Crown className="w-6 h-6 text-purple-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Personal Career Coach</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Requires Enterprise subscription
            </p>
            <PaywallGuard feature="personal_career_coach" tier="enterprise">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">✅ You have access to this feature!</p>
                <p className="text-green-600 text-sm mt-1">
                  Get 1-on-1 coaching sessions with career experts.
                </p>
              </div>
            </PaywallGuard>
          </div>

          {/* Another Pro Feature */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">AI Job Matching</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Requires Talentix Pro subscription
            </p>
            <PaywallGuard feature="ai_job_matching" tier="pro">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">✅ You have access to this feature!</p>
                <p className="text-green-600 text-sm mt-1">
                  Get personalized job recommendations powered by AI.
                </p>
              </div>
            </PaywallGuard>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-600">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-yellow-600">Pro</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">CV Reviews per day</td>
                  <td className="text-center py-4 px-4">1</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Video Interview Questions</td>
                  <td className="text-center py-4 px-4">2 total</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Career Guidance Articles</td>
                  <td className="text-center py-4 px-4">6 total</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">AI Job Matching</td>
                  <td className="text-center py-4 px-4"><Lock className="w-4 h-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Personal Career Coach</td>
                  <td className="text-center py-4 px-4"><Lock className="w-4 h-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Lock className="w-4 h-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Priority Support</td>
                  <td className="text-center py-4 px-4"><Lock className="w-4 h-4 text-gray-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openPricingModal'))}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            View All Plans & Pricing
          </button>
        </div>
      </div>
    </div>
  );
}
