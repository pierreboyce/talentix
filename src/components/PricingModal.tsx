'use client';

import React, { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { LoadingButton } from './LoadingSpinner';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  priceId: string;
  yearlyPriceId: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  icon: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    priceId: '',
    yearlyPriceId: '',
    description: 'Perfect for getting started with your career journey',
    icon: '💡',
    features: [
      'CV Reviewer + AI Feedback (1 use/ 24 hours)',
      'AI Video Interview Prep (2 practices / 24 hours)',
      'Community Access',
      'Limited Learning Resources'
    ],
    buttonText: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Talentix Pro',
    price: 3.99,
    yearlyPrice: 30.99,
    priceId: 'price_1S6FAPENQFYWRFKWL9LCfneV',
    yearlyPriceId: 'price_1SFsbSENQFYWRFKWVsG3qfL7',
    description: 'Ideal for active job seekers and career changers',
    icon: '🚀',
    popular: true,
    features: [
      'Unlimited AI-Powered CV Reviews',
      'AI Video Interview Practice',
      'Exclusive Career Blog Access',
      '2x Talentix Points Multiplier',
      'Priority Access to New Features',
      'Pro Member Badge',
      'Early Access to Job Listings',
      'Personalised Career Insights',
      'Exclusive Pro Workshops & Webinars',
      'Dedicated Pro Support'
    ],
    buttonText: 'Go Pro 🚀'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    yearlyPrice: 0,
    priceId: '',
    yearlyPriceId: '',
    description: 'Custom solutions for organizations and teams',
    icon: '🎉',
    features: [
      'Custom AI Interview Scenarios',
      'Team CV Management',
      'Dedicated Support',
      'Custom Integration Options',
      'Advanced Analytics & Reporting',
      'Volume Discounts'
    ],
    buttonText: 'Contact Sales'
  }
];

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { subscription } = useSubscription();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (tier: PricingTier) => {
    if (tier.id === 'free') {
      showToast('You\'re already on the free tier!', 'info');
      return;
    }

    alert("Everything's free! (for now)");
    showToast("Everything's free! (for now)", 'success');
    onClose();
    return;

    if (tier.id === 'enterprise') {
      window.open('mailto:enquiries@talentix.co.uk?subject=Enterprise Plan Inquiry&body=Hi Talentix Team,%0D%0A%0D%0AI am interested in the Enterprise plan for my organization.%0D%0A%0D%0APlease contact me with more details about:%0D%0A- Custom pricing options%0D%0A- Available features%0D%0A- Implementation timeline%0D%0A- Support options%0D%0A%0D%0AOrganization details:%0D%0A- Company name:%0D%0A- Number of users:%0D%0A- Specific requirements:%0D%0A%0D%0AThank you!', '_blank');
      return;
    }

    if (!user?.email) {
      showToast('Please sign in to subscribe', 'warning');
      return;
    }

    setLoadingTier(tier.id);
    
    try {
      const priceId = isYearly ? tier.yearlyPriceId : tier.priceId;
      
      console.log('🛒 Subscription request:', {
        tier: tier.name,
        isYearly,
        priceId,
        userEmail: user?.email
      });
      
      if (!priceId) {
        throw new Error('Price ID not configured for this tier');
      }

      // Don't require token for subscription - use user email directly
      const response = await fetch('/api/subscriptions/create-checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId, userEmail: user?.email })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Subscription checkout failed:', {
          status: response.status,
          error: errorData.error,
          details: errorData.details
        });
        throw new Error(errorData.error || `Failed to create checkout session (Status: ${response.status})`);
      }

      const data = await response.json();
      
      if (data.url) {
        showToast('Redirecting to payment...', 'success');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      let errorMessage = 'Failed to start subscription process';
      if (error instanceof Error && error.message.trim().length > 0) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(1deg); }
          66% { transform: translateY(4px) rotate(-1deg); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 0 50px rgba(139, 92, 246, 0.7); }
        }

        @keyframes rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .pricing-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .pricing-card:hover {
          transform: translateY(-15px) scale(1.03);
        }
        
        .popular-card {
          position: relative;
          overflow: hidden;
        }
        
        .popular-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6, #06d6a0, #fbbf24, #8b5cf6);
          background-size: 200% 100%;
          animation: rainbow 3s linear infinite;
        }
        
        .popular-card:hover {
          animation: glow-pulse 2s infinite;
        }
        
        .wiggle-icon:hover {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .bounce-icon {
          animation: bounce-gentle 2s infinite;
        }
        
        .float-decoration {
          animation: float 4s infinite ease-in-out;
        }

        .gradient-text {
          background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06d6a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .fun-button {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .fun-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(251, 191, 36, 0.4);
        }

        .pro-button {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .pro-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
        }

        .enterprise-button {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .enterprise-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4);
        }

        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .pricing-card {
            padding: 20px !important;
          }
          
          .pricing-card h3 {
            font-size: 24px !important;
          }
          
          .pricing-card .price {
            font-size: 28px !important;
          }
          
          .pricing-card ul li {
            font-size: 14px !important;
          }
        }
      `}</style>

      <div 
        style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '100svh',
          maxHeight: '100lvh',
          margin: 0,
          padding: window.innerWidth < 640 ? '8px' : '20px',
          paddingBottom: window.innerWidth < 640 ? 'calc(8px + env(safe-area-inset-bottom, 0px))' : 'calc(20px + env(safe-area-inset-bottom, 0px))',
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px) saturate(0.8)',
          WebkitBackdropFilter: 'blur(12px) saturate(0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999999
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: window.innerWidth < 640 ? '16px' : '24px',
            padding: window.innerWidth < 640 ? '16px' : '24px',
            maxWidth: '1200px',
            width: '100%',
            maxHeight: window.innerWidth < 640 ? '98vh' : '95vh',
            overflowY: 'auto',
            position: 'relative',
            zIndex: 100000000,
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Floating decorative elements */}
          <div className="float-decoration" style={{ position: 'absolute', top: '30px', left: '50px', fontSize: '40px', opacity: 0.6, color: '#8b5cf6' }}>✨</div>
          <div className="float-decoration" style={{ position: 'absolute', top: '50px', right: '70px', fontSize: '35px', opacity: 0.5, color: '#3b82f6', animationDelay: '1s' }}>💫</div>
          <div className="float-decoration" style={{ position: 'absolute', bottom: '80px', left: '30px', fontSize: '30px', opacity: 0.4, color: '#06d6a0', animationDelay: '2s' }}>⚡</div>
          <div className="float-decoration" style={{ position: 'absolute', bottom: '60px', right: '50px', fontSize: '38px', opacity: 0.6, color: '#fbbf24', animationDelay: '0.5s' }}>🎯</div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              zIndex: 100000001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f1f5f9, #e2e8f0)';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: window.innerWidth < 640 ? '24px' : '32px' }}>
            <div className="bounce-icon" style={{ fontSize: window.innerWidth < 640 ? '32px' : '48px', marginBottom: window.innerWidth < 640 ? '8px' : '12px' }}>🚀</div>
            <h2 className="gradient-text" style={{ 
              fontSize: window.innerWidth < 640 ? '28px' : window.innerWidth < 768 ? '36px' : '42px', 
              fontWeight: '900', 
              marginBottom: '12px',
              fontFamily: 'Fredoka, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}>
              Choose Your Plan
            </h2>
            <p style={{ 
              fontSize: window.innerWidth < 640 ? '16px' : '18px', 
              color: '#6b7280',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              Unlock Your Career Potential! 🎯
            </p>
            <p style={{ 
              fontSize: window.innerWidth < 640 ? '12px' : '14px', 
              color: '#9ca3af',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '500'
            }}>
              Join thousands of young professionals landing their dream jobs! ✨
            </p>
          </div>

          {/* Billing Toggle */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px',
            gap: '16px'
          }}>
            <span style={{ 
              fontSize: '16px',
              fontWeight: '600',
              color: isYearly ? '#6b7280' : '#8b5cf6',
              fontFamily: 'Fredoka, sans-serif'
            }}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              style={{
                width: '60px',
                height: '32px',
                borderRadius: '16px',
                border: 'none',
                background: isYearly 
                  ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)' 
                  : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '12px',
                background: '#ffffff',
                position: 'absolute',
                top: '4px',
                left: isYearly ? '32px' : '4px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }} />
            </button>
            <span style={{ 
              fontSize: '16px',
              fontWeight: '600',
              color: isYearly ? '#8b5cf6' : '#6b7280',
              fontFamily: 'Fredoka, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Yearly
              <span style={{
                backgroundColor: '#06d6a0',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: '12px'
              }}>
                Save 37%
              </span>
            </span>
          </div>

          {/* Pricing Cards */}
          <div className="pricing-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`pricing-card ${tier.popular ? 'popular-card' : ''}`}
                style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '20px 16px',
                  border: tier.popular 
                    ? '3px solid transparent' 
                    : '3px solid #e5e7eb',
                  background: tier.popular 
                    ? 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #8b5cf6, #3b82f6, #06d6a0) border-box'
                    : 'white',
                  boxShadow: tier.popular 
                    ? '0 30px 60px -12px rgba(139, 92, 246, 0.3)' 
                    : '0 15px 35px -5px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #06d6a0, #0891b2)',
                    color: 'white',
                    padding: '14px 36px',
                    borderRadius: '28px',
                    fontSize: '16px',
                    fontWeight: '800',
                    fontFamily: 'Fredoka, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 10px 20px rgba(6, 214, 160, 0.4)'
                  }}>
                    💎 BEST VALUE
                  </div>
                )}

                {/* Icon */}
                <div 
                  className="wiggle-icon"
                  style={{ 
                    fontSize: '36px', 
                    marginBottom: '12px',
                    textAlign: 'center'
                  }}
                >
                  {tier.icon}
                </div>

                {/* Plan Name */}
                <h3 style={{ 
                  fontSize: '22px', 
                  fontWeight: '900',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#1f2937',
                  textAlign: 'center'
                }}>
                  {tier.name}
                </h3>

                {/* Description */}
                <p style={{ 
                  fontSize: '12px',
                  marginBottom: '12px',
                  color: '#6b7280',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '500',
                  textAlign: 'center',
                  lineHeight: '1.4'
                }}>
                  {tier.description}
                </p>

                {/* Price */}
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <span style={{ 
                    fontSize: tier.id === 'enterprise' ? '18px' : '28px',
                    fontWeight: '900',
                    fontFamily: 'Fredoka, sans-serif',
                    color: tier.popular ? '#8b5cf6' : '#1f2937'
                  }}>
                    {tier.id === 'enterprise' 
                      ? 'Contact Us' 
                      : tier.id === 'free'
                      ? 'Free'
                      : `£${isYearly ? tier.yearlyPrice : tier.price}`}
                  </span>
                  {tier.id !== 'enterprise' && tier.id !== 'free' && (
                    <span style={{ 
                      fontSize: '12px',
                      color: '#6b7280',
                      fontFamily: 'Fredoka, sans-serif',
                      fontWeight: '600'
                    }}>
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  )}
                  {tier.id === 'free' && (
                    <span style={{ 
                      fontSize: '12px',
                      color: '#6b7280',
                      fontFamily: 'Fredoka, sans-serif',
                      fontWeight: '600'
                    }}>
                      Forever
                    </span>
                  )}
                </div>

                {/* Features */}
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  marginBottom: '16px',
                  fontSize: '11px',
                  lineHeight: '1.4'
                }}>
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} style={{ 
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontFamily: 'Fredoka, sans-serif',
                      fontSize: '13px'
                    }}>
                      <span style={{ 
                        color: tier.popular ? '#8b5cf6' : '#06d6a0',
                        fontSize: '16px',
                        marginTop: '1px',
                        flexShrink: 0,
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </span>
                      <span style={{ color: '#374151', fontWeight: '500' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <LoadingButton
                  onClick={() => handleSubscribe(tier)}
                  isLoading={loadingTier === tier.id}
                  loadingText="Processing..."
                  className={tier.id === 'free' ? 'fun-button' : tier.id === 'pro' ? 'pro-button' : 'enterprise-button'}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Fredoka, sans-serif',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {tier.buttonText}
                </LoadingButton>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center',
            paddingTop: '20px',
            borderTop: '2px solid #f3f4f6'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🎉</span>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>💳</span>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>🔒</span>
              <span style={{ fontSize: '24px' }}>📞</span>
            </div>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '600',
              lineHeight: '1.5'
            }}>
              <strong style={{ color: '#8b5cf6' }}>7-day free trial</strong> on all plans • <strong style={{ color: '#06d6a0' }}>Cancel anytime</strong> • <strong style={{ color: '#3b82f6' }}>24/7 support</strong><br />
              <span style={{ fontSize: '16px', marginTop: '6px', display: 'inline-block' }}>Join the career revolution and land your dream job! 🚀</span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}