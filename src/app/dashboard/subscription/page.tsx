'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import PricingModal from '@/components/PricingModal'

interface UsageStats {
  cvReviews: { used: number; limit: number; resetDate: string }
  videoInterviews: { used: number; limit: number }
  blogPosts: { used: number; limit: number }
  lastCvUpdate: string
  achievementBadges: number
}

export default function SubscriptionDashboard() {
  const { user } = useAuth()
  const { subscription, refreshSubscription } = useSubscription()
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [usageStats, setUsageStats] = useState<UsageStats>({
    cvReviews: { used: 0, limit: 1, resetDate: 'Tomorrow' },
    videoInterviews: { used: 1, limit: 2 },
    blogPosts: { used: 3, limit: 6 },
    lastCvUpdate: '3 days ago',
    achievementBadges: 2
  })

  // Button handlers
  const handlePaymentMethod = async () => {
    if (!user?.email) {
      alert('Please sign in to manage payment methods');
      return;
    }

    try {
      // In a real implementation, you would get the customer ID from your database
      // For now, we'll use a placeholder
      const response = await fetch('/api/subscriptions/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: 'placeholder' }) // This should be the actual Stripe customer ID
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        alert('Unable to open billing portal. Please try again later.');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Unable to open billing portal. Please try again later.');
    }
  }

  const handleDownloadInvoices = () => {
    alert('📄 Invoice download coming soon! This will generate and download your billing history.')
  }

  const handleChangePlan = () => {
    setShowPricingModal(true)
  }

  const handleCancelSubscription = () => {
    const confirmed = window.confirm('⚠️ Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')
    if (confirmed) {
      alert('🚧 Subscription cancellation coming soon! This will process your cancellation request.')
    }
  }

  useEffect(() => {
    const loadUsageStats = async () => {
      if (typeof window === 'undefined' || !user?.email) return;
      
      // Get real usage data from localStorage (user-specific)
      const today = new Date().toDateString();
      const cvUsageKey = `cv_reviews_${today}_${user.email}`;
      const cvUsageToday = parseInt(localStorage.getItem(cvUsageKey) || '0');
      
      const videoUsageKey = `video_interview_questions_used_${user.email}`;
      const videoUsageTotal = parseInt(localStorage.getItem(videoUsageKey) || '0');
      
      const blogUsageKey = `career_articles_viewed_${user.email}`;
      const blogUsageTotal = parseInt(localStorage.getItem(blogUsageKey) || '0');
      
      // Get last CV update time (user-specific)
      const lastCvKey = `last_cv_update_${user.email}`;
      const lastCvUpdate = localStorage.getItem(lastCvKey);
      let lastCvText = 'Never';
      if (lastCvUpdate) {
        const lastDate = new Date(lastCvUpdate);
        const daysDiff = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 0) lastCvText = 'Today';
        else if (daysDiff === 1) lastCvText = '1 day ago';
        else lastCvText = `${daysDiff} days ago`;
      }
      
      // Calculate achievement badges based on real activity (user-specific)
      let badges = 1; // First Login badge
      if (cvUsageToday > 0 || parseInt(localStorage.getItem(`total_cv_reviews_${user.email}`) || '0') > 0) badges++;
      if (videoUsageTotal > 0) badges++;
      if (blogUsageTotal > 0) badges++;
      if (parseInt(localStorage.getItem(`total_cv_reviews_${user.email}`) || '0') >= 5) badges++;
      if (videoUsageTotal >= 10) badges++;
      
      if (subscription.tier === 'free') {
        setUsageStats({
          cvReviews: { used: cvUsageToday, limit: 1, resetDate: 'Tomorrow' },
          videoInterviews: { used: videoUsageTotal, limit: 2 },
          blogPosts: { used: blogUsageTotal, limit: 6 },
          lastCvUpdate: lastCvText,
          achievementBadges: badges
        });
      } else {
        setUsageStats({
          cvReviews: { used: cvUsageToday, limit: -1, resetDate: 'Unlimited' },
          videoInterviews: { used: videoUsageTotal, limit: -1 },
          blogPosts: { used: blogUsageTotal, limit: -1 },
          lastCvUpdate: lastCvText,
          achievementBadges: badges + 2 // Pro users get bonus badges
        });
      }
    }
    
    loadUsageStats();
    
    // Listen for usage updates
    const handleStorageChange = () => loadUsageStats();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('talentix-usage-update', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('talentix-usage-update', handleStorageChange);
    };
  }, [subscription, user?.email])

  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleUpgrade = () => {
    setShowPricingModal(true)
  }

  const getProgressPercentage = (used: number, limit: number) => {
    if (limit === -1) return 100 // Unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getProgressColor = (used: number, limit: number) => {
    if (limit === -1) return '#8b5cf6' // Purple for unlimited
    const percentage = (used / limit) * 100
    if (percentage >= 90) return '#ef4444' // Red
    if (percentage >= 70) return '#f59e0b' // Orange
    return '#06d6a0' // Green
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
      padding: '40px 20px'
    }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
          background: `
            radial-gradient(circle at 20% 80%, #fde047 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #06d6a0 0%, transparent 50%)
          `,
          animation: 'confetti 3s ease-out'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '100px',
            animation: 'bounce 2s infinite'
          }}>
            🎉
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* User Greeting */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'slideInDown 0.8s ease-out'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            fontFamily: 'Fredoka, sans-serif',
            color: '#1f2937',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Hi {user?.name || 'Talent'} 👋
          </h1>
          <p style={{
            fontSize: '24px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#374151',
            fontWeight: '600'
          }}>
            Ready to boost your career today? 🚀
          </p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Current Plan Card */}
          <div className="dashboard-card" style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            borderRadius: '24px',
            padding: '32px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
            animation: 'slideInLeft 0.8s ease-out'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              fontSize: '150px',
              opacity: '0.1'
            }}>
              💎
            </div>
            
            <h2 style={{
              fontSize: '28px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              marginBottom: '16px'
            }}>
              Current Plan 💫
            </h2>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '32px',
                fontWeight: '900',
                fontFamily: 'Fredoka, sans-serif',
                marginBottom: '8px'
              }}>
                {subscription.tier === 'free' ? 'Free Tier' : 
                 subscription.tier === 'pro' ? 'Talentix Pro' : 'Enterprise'}
              </h3>
              <p style={{
                fontSize: '20px',
                fontFamily: 'Fredoka, sans-serif',
                opacity: '0.9',
                marginBottom: '12px'
              }}>
                {subscription.tier === 'free' ? '£0/month' :
                 subscription.tier === 'pro' ? '£3.99/month' : 'Contact Us'}
              </p>
              <p style={{
                fontSize: '16px',
                fontFamily: 'Fredoka, sans-serif',
                opacity: '0.8'
              }}>
                {subscription.tier === 'free' ? 'Perfect for getting started! 🌟' :
                 subscription.tier === 'pro' ? 'Next billing: Dec 15, 2024' : 'Custom billing cycle'}
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              className="wiggle-button"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                padding: '16px 24px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Fredoka, sans-serif',
                cursor: 'pointer',
                width: '100%',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              {subscription.tier === 'free' ? '🚀 Upgrade to Pro' : '⚙️ Manage Subscription'}
            </button>
          </div>

          {/* Usage Overview */}
          <div className="dashboard-card" style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 0.8s ease-out'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📊 Usage Overview
            </h2>

            {/* CV Reviews */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#374151'
                }}>
                  🎯 CV Reviews
                </span>
                <span style={{
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6b7280'
                }}>
                  {usageStats.cvReviews.used}/{usageStats.cvReviews.limit === -1 ? '∞' : usageStats.cvReviews.limit}
                </span>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: getProgressColor(usageStats.cvReviews.used, usageStats.cvReviews.limit),
                  height: '100%',
                  width: `${getProgressPercentage(usageStats.cvReviews.used, usageStats.cvReviews.limit)}%`,
                  borderRadius: '12px',
                  transition: 'width 1s ease-out',
                  animation: 'progressFill 2s ease-out'
                }} />
              </div>
              <p style={{
                fontSize: '12px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#6b7280',
                marginTop: '4px'
              }}>
                Resets {usageStats.cvReviews.resetDate}
              </p>
            </div>

            {/* Video Interviews */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#374151'
                }}>
                  🎥 Video Interviews
                </span>
                <span style={{
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6b7280'
                }}>
                  {usageStats.videoInterviews.used}/{usageStats.videoInterviews.limit === -1 ? '∞' : usageStats.videoInterviews.limit}
                </span>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: getProgressColor(usageStats.videoInterviews.used, usageStats.videoInterviews.limit),
                  height: '100%',
                  width: `${getProgressPercentage(usageStats.videoInterviews.used, usageStats.videoInterviews.limit)}%`,
                  borderRadius: '12px',
                  transition: 'width 1s ease-out',
                  animation: 'progressFill 2s ease-out 0.3s both'
                }} />
              </div>
            </div>

            {/* Blog Posts */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#374151'
                }}>
                  📚 Career Articles
                </span>
                <span style={{
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6b7280'
                }}>
                  {usageStats.blogPosts.used}/{usageStats.blogPosts.limit === -1 ? '∞' : usageStats.blogPosts.limit}
                </span>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                height: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: getProgressColor(usageStats.blogPosts.used, usageStats.blogPosts.limit),
                  height: '100%',
                  width: `${getProgressPercentage(usageStats.blogPosts.used, usageStats.blogPosts.limit)}%`,
                  borderRadius: '12px',
                  transition: 'width 1s ease-out',
                  animation: 'progressFill 2s ease-out 0.6s both'
                }} />
              </div>
            </div>

            {/* Achievement Badges */}
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                fontFamily: 'Fredoka, sans-serif',
                color: '#92400e',
                margin: 0
              }}>
                {usageStats.achievementBadges} Achievement Badges Earned!
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade Promo Banner */}
        {subscription.tier === 'free' && (
          <div style={{
            background: 'linear-gradient(135deg, #06d6a0 0%, #0891b2 100%)',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center',
            color: 'white',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideInUp 0.8s ease-out'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              fontSize: '120px',
              opacity: '0.1'
            }}>
              🚀
            </div>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              fontSize: '100px',
              opacity: '0.1'
            }}>
              💡
            </div>
            
            <h2 style={{
              fontSize: '36px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              marginBottom: '16px'
            }}>
              🚀 Unlock Pro for unlimited interviews!
            </h2>
            <p style={{
              fontSize: '20px',
              fontFamily: 'Fredoka, sans-serif',
              marginBottom: '24px',
              opacity: '0.9'
            }}>
              Get unlimited CV reviews, video interviews, and premium learning resources!
            </p>
            <button
              onClick={() => {
                triggerConfetti()
                handleUpgrade()
              }}
              className="bounce-button"
              style={{
                backgroundColor: '#fde047',
                color: '#1f2937',
                border: 'none',
                borderRadius: '20px',
                padding: '20px 40px',
                fontSize: '20px',
                fontWeight: '700',
                fontFamily: 'Fredoka, sans-serif',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(253, 224, 71, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              🎉 Upgrade Now - Just £3.99/month!
            </button>
          </div>
        )}

        {/* Plan Comparison Mini Cards */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '900',
            fontFamily: 'Fredoka, sans-serif',
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            🎯 Plan Benefits
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {/* Free Plan */}
            <div className="mini-plan-card" style={{
              backgroundColor: subscription.tier === 'free' ? '#e0f2fe' : '#f9fafb',
              border: subscription.tier === 'free' ? '3px solid #0891b2' : '2px solid #e5e7eb',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {subscription.tier === 'free' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#0891b2',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  CURRENT
                </div>
              )}
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🆓</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: 'Fredoka, sans-serif',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Free
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#374151'
              }}>
                <li style={{ marginBottom: '8px' }}>✅ 1 CV Review/day</li>
                <li style={{ marginBottom: '8px' }}>✅ 2 Video Interviews</li>
                <li style={{ marginBottom: '8px' }}>✅ 6 Career Articles</li>
                <li style={{ marginBottom: '8px' }}>❌ Premium Support</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="mini-plan-card" style={{
              backgroundColor: subscription.tier === 'pro' ? '#f3e8ff' : '#f9fafb',
              border: subscription.tier === 'pro' ? '3px solid #8b5cf6' : '2px solid #e5e7eb',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {subscription.tier === 'pro' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  CURRENT
                </div>
              )}
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💎</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: 'Fredoka, sans-serif',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Talentix Pro
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#374151'
              }}>
                <li style={{ marginBottom: '8px' }}>✅ Unlimited CV Reviews</li>
                <li style={{ marginBottom: '8px' }}>✅ Unlimited Interviews</li>
                <li style={{ marginBottom: '8px' }}>✅ All Career Articles</li>
                <li style={{ marginBottom: '8px' }}>✅ Priority Support</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="mini-plan-card" style={{
              backgroundColor: subscription.tier === 'enterprise' ? '#fef3c7' : '#f9fafb',
              border: subscription.tier === 'enterprise' ? '3px solid #f59e0b' : '2px solid #e5e7eb',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative'
            }}>
              {subscription.tier === 'enterprise' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  CURRENT
                </div>
              )}
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '900',
                fontFamily: 'Fredoka, sans-serif',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Enterprise
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#374151'
              }}>
                <li style={{ marginBottom: '8px' }}>✅ Everything in Pro</li>
                <li style={{ marginBottom: '8px' }}>✅ Team Management</li>
                <li style={{ marginBottom: '8px' }}>✅ Custom Branding</li>
                <li style={{ marginBottom: '8px' }}>✅ Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Community & Support Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Community Card */}
          <div className="dashboard-card" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            animation: 'slideInLeft 0.8s ease-out 0.4s both'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌟</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Join Our Community
            </h3>
            <p style={{
              fontSize: '16px',
              fontFamily: 'Fredoka, sans-serif',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Connect with thousands of young professionals and get career advice!
            </p>
            <button
              className="wiggle-button"
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: 'Fredoka, sans-serif',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🚀 Join Community
            </button>
          </div>

          {/* Support Card */}
          <div className="dashboard-card" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            animation: 'slideInRight 0.8s ease-out 0.4s both'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Need Help?
            </h3>
            <p style={{
              fontSize: '16px',
              fontFamily: 'Fredoka, sans-serif',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              {subscription.tier === 'pro' || subscription.tier === 'enterprise' 
                ? 'Get priority support from our team!'
                : 'Get help from our community and support team!'}
            </p>
            <button
              className="wiggle-button"
              style={{
                backgroundColor: '#06d6a0',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: 'Fredoka, sans-serif',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {subscription.tier === 'pro' || subscription.tier === 'enterprise' 
                ? '⚡ Priority Support' 
                : '💡 Get Help'}
            </button>
          </div>
        </div>

        {/* Billing & Settings */}
        {subscription.tier !== 'free' && (
          <div className="dashboard-card" style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
            animation: 'slideInUp 0.8s ease-out 0.6s both'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '900',
              fontFamily: 'Fredoka, sans-serif',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              ⚙️ Billing & Settings
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <button
                onClick={handlePaymentMethod}
                className="settings-button"
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.3s ease'
                }}
              >
                💳 Payment Method
              </button>
              <button
                onClick={handleDownloadInvoices}
                className="settings-button"
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.3s ease'
                }}
              >
                📄 Download Invoices
              </button>
              <button
                onClick={handleChangePlan}
                className="settings-button"
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  cursor: 'pointer',
                  color: '#374151',
                  transition: 'all 0.3s ease'
                }}
              >
                🔄 Change Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="settings-button"
                style={{
                  backgroundColor: '#fef2f2',
                  border: '2px solid #fecaca',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: '600',
                  fontFamily: 'Fredoka, sans-serif',
                  cursor: 'pointer',
                  color: '#dc2626',
                  transition: 'all 0.3s ease'
                }}
              >
                ❌ Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
      )}

      <style jsx>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          40%, 43% {
            transform: translate(-50%, -50%) translateY(-30px);
          }
          70% {
            transform: translate(-50%, -50%) translateY(-15px);
          }
          90% {
            transform: translate(-50%, -50%) translateY(-4px);
          }
        }

        @keyframes confetti {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .mini-plan-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .wiggle-button:hover {
          animation: wiggle 0.5s ease-in-out;
          transform: scale(1.05);
        }

        .bounce-button:hover {
          animation: bounce 1s infinite;
          transform: scale(1.05);
        }

        .settings-button:hover {
          background-color: #e5e7eb !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        @keyframes wiggle {
          0% { transform: rotate(0deg) scale(1.05); }
          25% { transform: rotate(-5deg) scale(1.05); }
          75% { transform: rotate(5deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1.05); }
        }

        @media (max-width: 768px) {
          .dashboard-card {
            padding: 24px !important;
          }
          
          h1 {
            font-size: 32px !important;
          }
          
          h2 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
