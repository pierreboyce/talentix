

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import PricingModal from './PricingModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import AppLauncher from './AppLauncher';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    location: '',
    hearAbout: ''
  });
  const [isDesktop, setIsDesktop] = useState(false); // Default to mobile-first
  const [isLoaded, setIsLoaded] = useState(false);

  // MOBILE TEST - ALWAYS VISIBLE ON MOBILE
  const isMobileTest = typeof window !== 'undefined' && window.innerWidth < 768;

  // Set responsive state
  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const desktop = width >= 768;
      
      console.log('🖥️ Screen size check:', {
        width,
        height,
        desktop,
        userAgent: navigator.userAgent
      });
      
      setIsDesktop(desktop);
      setIsLoaded(true);
    };

    checkScreenSize();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', checkScreenSize);
      }
    };
  }, []);

  // Listen for pricing modal events from PaywallGuard
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOpenPricingModal = () => {
      setShowPricingModal(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);
    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

  // Community form handling
  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.age || !formData.location || !formData.hearAbout) {
      return;
    }
    
    try {
      // Send data to newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and show success
        resetForm();
        setShowCommunityModal(false);
        setShowSuccessModal(true);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      age: '',
      location: '',
      hearAbout: ''
    });
  };

  // Handle body overflow for modals
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (showCommunityModal || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCommunityModal, showSuccessModal]);

  const isExcludedPage = (
    pathname === '/' ||
    pathname === '/dashboard' ||
    pathname === '/our-story' ||
    pathname.startsWith('/our-services')
  );
  const isSticky = !isExcludedPage;
  const headerPositionClass = isSticky
    ? 'fixed top-0 left-0 right-0 z-20'
    : 'relative';

  return (
    <>
    <header className={`w-full bg-[rgb(255,255,255)] border-b border-gray-200/80 ${headerPositionClass}`} style={{ marginTop: 0, paddingTop: 0, minHeight: '80px', maxHeight: '80px' }}>
      <div className="mx-auto flex items-center justify-between px-6 py-4" style={{ marginTop: 0, paddingTop: 0, height: '80px', width: '90%', maxWidth: '90vw' }}>
        <div className="flex items-center">
          {/* App Launcher - Only show for authenticated users */}
          {user && <AppLauncher />}
          
          {/* Logo */}
          <Link href="/" className={`flex items-center ${user ? 'ml-6' : ''}`}>
            <Image
              src="/tixlogo.png"
              alt="Talentix Logo"
              width={140}
              height={40}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>
        </div>

        {/* Right side navigation */}
        {!user && (
          <div style={{ position: 'relative' }}>

            {/* MOBILE FIRST: Force show mobile navigation when width < 768px */}
            {(typeof window !== 'undefined' && window.innerWidth < 768) && (
              <div style={{ 
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: '3px',
                justifyContent: 'flex-end',
                alignItems: 'center',
                maxWidth: '320px',
                backgroundColor: 'rgba(255,0,0,0.8)', // BRIGHT RED to be visible
                padding: '8px',
                borderRadius: '10px',
                border: '2px solid yellow' // Yellow border for extra visibility
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '8px',
                  marginRight: '5px',
                  fontWeight: 'bold'
                }}>
                  MOBILE: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'}px
                </div>
                <button 
                  onClick={() => router.push('/our-story')} 
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                    color: '#374151',
                    padding: '4px 6px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Fredoka', sans-serif",
                    whiteSpace: 'nowrap',
                    minWidth: '45px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}
                >
                  📖 Story
                </button>
                
                <button 
                  onClick={() => router.push('/our-services')} 
                  style={{
                    background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                    color: '#374151',
                    padding: '4px 6px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Fredoka', sans-serif",
                    whiteSpace: 'nowrap',
                    minWidth: '50px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}
                >
                  🛠️ Services
                </button>
                
                <button 
                  onClick={() => setShowSignInModal(true)} 
                  style={{
                    background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                    color: '#374151',
                    padding: '4px 6px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: "'Fredoka', sans-serif",
                    whiteSpace: 'nowrap',
                    minWidth: '40px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}
                >
                  🔐 Sign In
                </button>
                
                <button 
                  onClick={() => setShowSignUpModal(true)} 
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000000',
                    padding: '4px 6px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: "'Fredoka', sans-serif",
                    whiteSpace: 'nowrap',
                    minWidth: '45px',
                    textAlign: 'center',
                    flexShrink: 0
                  }}
                >
                  🚀 Sign Up
                </button>
              </div>
            )}

            {/* DESKTOP: Show when width >= 768px */}
            {(typeof window !== 'undefined' && window.innerWidth >= 768) && (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowCommunityModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)',
                    color: '#374151',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)';
                  }}
                >
                  🌟 Join Our Community
                </button>
                <button 
                  onClick={() => router.push('/our-story')}
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                    color: '#374151',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(253, 224, 71, 0.3)',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(253, 224, 71, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fde047 0%, #facc15 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(253, 224, 71, 0.3)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)';
                  }}
                >
                  📖 Our Story
                </button>
                <button 
                  onClick={() => router.push('/our-services')}
                  style={{
                    background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                    color: '#374151',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(167, 139, 250, 0.3)',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(167, 139, 250, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(167, 139, 250, 0.3)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)';
                  }}
                >
                  🛠️ Our Services
                </button>
                <button 
                  onClick={() => setShowSignInModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                    color: '#374151',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(96, 165, 250, 0.3)',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(96, 165, 250, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(96, 165, 250, 0.3)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)';
                  }}
                >
                  🔐 Sign In
                </button>
                <button 
                  onClick={() => setShowSignUpModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000000',
                    padding: '12px 24px',
                    borderRadius: '25px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.5)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                  }}
                >
                  🚀 Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modals rendered as portals to body */}
      {typeof window !== 'undefined' && createPortal(
        <>
          <SignUpModal 
            isOpen={showSignUpModal} 
            onClose={() => setShowSignUpModal(false)} 
          />
          <SignInModal 
            isOpen={showSignInModal} 
            onClose={() => setShowSignInModal(false)}
            onForgotPassword={() => {
              setShowSignInModal(false);
              setShowForgotPasswordModal(true);
            }}
          />
          <PricingModal 
            isOpen={showPricingModal} 
            onClose={() => setShowPricingModal(false)} 
          />
          <ForgotPasswordModal 
            isOpen={showForgotPasswordModal} 
            onClose={() => setShowForgotPasswordModal(false)} 
          />
          
          {/* Community Form Modal */}
          {showCommunityModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowCommunityModal(false);
                  resetForm();
                }
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '40px',
                  maxWidth: '500px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  position: 'relative',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}
              >
                <button
                  onClick={() => {
                    setShowCommunityModal(false);
                    resetForm();
                  }}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#ef4444',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  ✕
                </button>

                <h2
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '10px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  🌟 Join Our Community! 🌟
                </h2>
                
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    textAlign: 'center',
                    marginBottom: '30px',
                    lineHeight: '1.5'
                  }}
                >
                  Be the first to know about new features, career tips, and exclusive opportunities!
                </p>

                <form onSubmit={handleCommunitySubmit}>
                  {/* Full Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Age */}
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      required
                      min="13"
                      max="100"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* Location */}
                  <div style={{ marginBottom: '20px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                      placeholder="e.g., London, UK"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        fontFamily: "'Inter', sans-serif"
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>

                  {/* How did you hear about us */}
                  <div style={{ marginBottom: '30px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}
                    >
                      How did you hear about us? *
                    </label>
                    <select
                      value={formData.hearAbout}
                      onChange={(e) => setFormData({...formData, hearAbout: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        fontFamily: "'Inter', sans-serif",
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      <option value="">Select an option</option>
                      <option value="social-media">Social Media</option>
                      <option value="friend">Friend/Family</option>
                      <option value="search-engine">Search Engine</option>
                      <option value="school">School/University</option>
                      <option value="job-center">Job Center</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.4)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
                      e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    }}
                  >
                    🚀 Join Community 🚀
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}
              onClick={() => setShowSuccessModal(false)}
            >
              <div
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '60px 40px',
                  maxWidth: '500px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                <h2
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '20px',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Welcome to the Community!
                </h2>
                <p
                  style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '30px',
                    lineHeight: '1.5',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  Thank you for joining! We'll keep you updated with the latest career opportunities and tips.
                </p>
                <a
                  href="https://chat.whatsapp.com/BvRTcUNgky19eOCWD1iX4h"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                    fontFamily: "'Fredoka', sans-serif"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.3)';
                  }}
                >
                  💬 Join our WhatsApp Community
                </a>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </header>
    {isSticky && <div style={{ height: '80px' }} />}
    </>
  );
} 