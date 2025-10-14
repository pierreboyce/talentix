
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import PricingModal from './PricingModal';

export default function NavigationMobile() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    location: '',
    hearAbout: ''
  });

  // Client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define pages where the header should not be sticky
  const excludedPages = [
    '/our-story',
    '/our-services',
    '/video-interview',
  ];
  
  // Define pages where mobile navigation should be completely hidden
  const hiddenPages: string[] = [
    // '/video-interview', // Removed - we want to show header on video interview page
  ];
  
  const isExcludedPage = excludedPages.some(page => 
    pathname === page || 
    pathname.startsWith('/our-services')
  );
  const isHiddenPage = hiddenPages.some(page => 
    pathname === page || 
    pathname.startsWith(page + '/')
  );
  const isSticky = !isExcludedPage;
  const headerPositionClass = isSticky
    ? 'fixed top-0 left-0 right-0 z-[9999]'
    : 'relative';

  // Close menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileMenu) {
        const target = event.target as Element;
        if (!target.closest('.mobile-menu-container')) {
          toggleMobileMenu();
        }
      }
    };

    if (showMobileMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Listen for modal events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleShowSignIn = () => {
      // Close all other modals first
      setShowSignUpModal(false);
      setShowPricingModal(false);
      setShowSignInModal(true);
    };
    const handleShowSignUp = () => {
      // Close all other modals first
      setShowSignInModal(false);
      setShowPricingModal(false);
      setShowSignUpModal(true);
    };
    const handleOpenPricing = () => {
      // Close all other modals first
      setShowSignInModal(false);
      setShowSignUpModal(false);
      setShowPricingModal(true);
    };

    window.addEventListener('talentix-show-signin-modal', handleShowSignIn);
    window.addEventListener('talentix-show-signup-modal', handleShowSignUp);
    window.addEventListener('openPricingModal', handleOpenPricing);

    return () => {
      window.removeEventListener('talentix-show-signin-modal', handleShowSignIn);
      window.removeEventListener('talentix-show-signup-modal', handleShowSignUp);
      window.removeEventListener('openPricingModal', handleOpenPricing);
    };
  }, []);

  // Prevent body scroll when menu or any modal is open
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const isAnyModalOpen = showSignInModal || showSignUpModal || showPricingModal || showMobileMenu || showCommunityModal || showSuccessModal;
    
    if (isAnyModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll - comprehensive approach for mobile browsers
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('talentix-modal-open');
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('talentix-modal-open');
      
      // Restore the scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('talentix-modal-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [showSignInModal, showSignUpModal, showPricingModal, showMobileMenu, showCommunityModal, showSuccessModal]);

  // Modal close handlers
  const handleCloseSignIn = () => {
    setShowSignInModal(false);
  };

  const handleCloseSignUp = () => {
    setShowSignUpModal(false);
  };

  const handleClosePricing = () => {
    setShowPricingModal(false);
  };

  // Form handling functions
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      age: '',
      location: '',
      hearAbout: ''
    });
  };

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

  // Handle menu toggle with animation
  const toggleMobileMenu = () => {
    if (showMobileMenu) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowMobileMenu(false);
        setIsAnimating(false);
      }, 200); // Match animation duration
    } else {
      setShowMobileMenu(true);
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (action: () => void) => {
    setIsAnimating(true);
    setTimeout(() => {
      action();
      setShowMobileMenu(false);
      setIsAnimating(false);
    }, 150);
  };

  // Don't render mobile navigation on hidden pages
  if (isHiddenPage) {
    return null;
  }

  return (
    <>
      <header className={`mobile-menu-container w-full bg-white border-b border-gray-200/80 ${headerPositionClass}`} style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div className="mx-auto flex items-center justify-between px-4 py-3" style={{ height: '70px', width: '90%', maxWidth: '90vw' }}>
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/tixlogo.png"
                alt="Talentix Logo"
                width={120}
                height={35}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Link>
          </div>

          {/* Hamburger menu button - Always shown on mobile */}
            <button
              onClick={toggleMobileMenu}
              className="touch-target relative p-3 rounded-xl text-white shadow-lg transition-all duration-200 active:scale-95 border-0 outline-none"
              style={{ 
                minHeight: '48px', 
                minWidth: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.35)'
              }}
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={showMobileMenu ? 'M5 5L19 19' : 'M3 7H21'} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <path d={showMobileMenu ? 'M19 5L5 19' : 'M3 12H21'} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                {!showMobileMenu && (
                  <path d="M3 17H21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                )}
              </svg>
            </button>
        </div>

      </header>
      
      {/* Spacer for sticky header */}
      {isSticky && <div style={{ height: '70px' }} />}

      {/* Backdrop Blur Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
          style={{ 
            animation: 'fadeIn 0.3s ease-out',
            touchAction: 'none',
            overflow: 'hidden',
            zIndex: 9998
          }}
          onClick={toggleMobileMenu}
          onTouchMove={(e) => e.preventDefault()}
        />
      )}

      {/* Side Panel Menu - Slides in from right */}
      <div 
        className={`fixed top-0 h-full shadow-2xl overflow-y-auto transition-all duration-300 ease-out`}
        style={{ 
          right: showMobileMenu ? '0' : '-100%',
          width: '85%',
          maxWidth: '320px',
          paddingTop: '70px',
          borderLeft: '1px solid rgba(0, 0, 0, 0.1)',
          touchAction: 'pan-y',
          backgroundColor: '#ffffff',
          zIndex: 10000,
          opacity: 1
        }}
            onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className={`px-4 py-6 space-y-4 transition-opacity duration-300 ${
          showMobileMenu && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}>
            <div className="text-center mb-6">
              <div 
                className="text-xl font-bold mb-2"
                style={{ 
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#1f2937'
                }}
              >
                {user ? 'Explore Talentix' : 'Welcome to Talentix'}
              </div>
              <div 
                className="mx-auto h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                style={{ width: '80px' }}
              />
            </div>
            
            {!user ? (
              /* Non-authenticated user menu - Simple navigation */
              <div className="space-y-3">
                <button 
                  onClick={() => handleMenuItemClick(() => {
                    console.log('Join Our Community clicked!');
                    setShowSignInModal(false);
                    setShowSignUpModal(false);
                    setShowPricingModal(false);
                    setTimeout(() => {
                      setShowCommunityModal(true);
                      console.log('Community modal set to true');
                    }, 50);
                  })}
                  className="mobile-nav-item w-full text-center bg-gradient-to-r from-green-200 to-green-300 text-gray-800 hover:from-green-300 hover:to-green-400 transform hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🌟</span>
                    <span className="font-semibold text-base">Join Our Community</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuItemClick(() => router.push('/our-story'))}
                  className="mobile-nav-item w-full text-center bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-800 hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">📖</span>
                    <span className="font-semibold text-base">Our Story</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuItemClick(() => router.push('/our-services'))}
                  className="mobile-nav-item w-full text-center bg-gradient-to-r from-purple-200 to-purple-300 text-gray-800 hover:from-purple-300 hover:to-purple-400 transform hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🛠️</span>
                    <span className="font-semibold text-base">Our Services</span>
                  </div>
                </button>
                
                <div className="border-t border-gray-200 pt-3 space-y-3">
                  <button 
                    onClick={() => handleMenuItemClick(() => {
                      setShowSignUpModal(false);
                      setShowPricingModal(false);
                      setShowSignInModal(true);
                    })}
                    className="mobile-nav-item w-full text-center bg-gradient-to-r from-blue-300 to-blue-400 text-white hover:from-blue-400 hover:to-blue-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">🔐</span>
                      <span className="font-bold text-base">Sign In</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => {
                      setShowSignInModal(false);
                      setShowPricingModal(false);
                      setShowSignUpModal(true);
                    })}
                    className="mobile-nav-item w-full text-center bg-gradient-to-r from-yellow-300 to-orange-400 text-white hover:from-yellow-400 hover:to-orange-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '18px 12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)' }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-lg">Sign Up Now</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Authenticated user menu - All desktop features */
              <>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {/* Row 1 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/dashboard'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-blue-300 to-blue-400 text-gray-800 hover:from-blue-400 hover:to-blue-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🏠</span>
                      <span className="font-semibold text-sm">Dashboard</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/cv-reviewer'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-green-300 to-green-400 text-gray-800 hover:from-green-400 hover:to-green-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📄</span>
                      <span className="font-semibold text-sm">CV Reviewer</span>
                    </div>
                  </button>
                  
                  {/* Row 2 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/search'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-purple-300 to-purple-400 text-gray-800 hover:from-purple-400 hover:to-purple-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">💼</span>
                      <span className="font-semibold text-sm">Job Search</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/interview-prep'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-yellow-300 to-yellow-400 text-gray-800 hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🎭</span>
                      <span className="font-semibold text-sm">Interview Prep</span>
                    </div>
                  </button>
                  
                  {/* Row 3 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/video-interview'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-pink-300 to-pink-400 text-gray-800 hover:from-pink-400 hover:to-pink-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🎬</span>
                      <span className="font-semibold text-sm">Video Interview</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/job-tracker'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-teal-300 to-teal-400 text-gray-800 hover:from-teal-400 hover:to-teal-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📊</span>
                      <span className="font-semibold text-sm">Job Tracker</span>
                    </div>
                  </button>
                  
                  {/* Row 4 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/cover-letter'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-indigo-300 to-indigo-400 text-gray-800 hover:from-indigo-400 hover:to-indigo-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">✍️</span>
                      <span className="font-semibold text-sm">Cover Letter</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/score'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800 hover:from-orange-400 hover:to-orange-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🎯</span>
                      <span className="font-semibold text-sm">Talentix Points</span>
                    </div>
                  </button>
                  
                  {/* Row 5 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/ai-chat'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-cyan-300 to-cyan-400 text-gray-800 hover:from-cyan-400 hover:to-cyan-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🤖</span>
                      <span className="font-semibold text-sm">AI Chat</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/career-guidance'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-emerald-300 to-emerald-400 text-gray-800 hover:from-emerald-400 hover:to-emerald-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🎓</span>
                      <span className="font-semibold text-sm">Career Guidance</span>
                    </div>
                  </button>
                  
                  {/* Row 6 */}
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/dashboard/subscription'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-violet-300 to-violet-400 text-gray-800 hover:from-violet-400 hover:to-violet-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">💎</span>
                      <span className="font-semibold text-sm">Subscription</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/settings'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 hover:from-gray-400 hover:to-gray-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">⚙️</span>
                      <span className="font-semibold text-sm">Settings</span>
                    </div>
                  </button>
                </div>
                
                {/* Additional menu items */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <button 
                    onClick={() => handleMenuItemClick(() => router.push('/our-story'))}
                    className="mobile-nav-item w-full text-left bg-gradient-to-r from-yellow-200 to-yellow-300 text-gray-800 hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '12px 16px', borderRadius: '8px' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">📖</span>
                      <span className="font-medium text-sm">Our Story</span>
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('talentix-sign-out'));
                      }
                    })}
                    className="mobile-nav-item w-full text-left bg-gradient-to-r from-red-300 to-red-400 text-white hover:from-red-400 hover:to-red-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '12px 16px', borderRadius: '8px' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">🚪</span>
                      <span className="font-medium text-sm">Sign Out</span>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      
      {/* Modals rendered as portals to body */}
      {isMounted && createPortal(
        <>
          <SignUpModal 
            isOpen={showSignUpModal} 
            onClose={handleCloseSignUp} 
          />
          <SignInModal 
            isOpen={showSignInModal} 
            onClose={handleCloseSignIn} 
          />
          <PricingModal 
            isOpen={showPricingModal} 
            onClose={handleClosePricing} 
          />
          
          {/* Community Form Modal */}
          {showCommunityModal && (() => {
            console.log('🎯 Rendering Community Modal!');
            return (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px',
                overflow: 'auto'
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowCommunityModal(false);
                  resetForm();
                }
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '40px 30px',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  position: 'relative',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                  border: '2px solid #e5e7eb',
                  fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  zIndex: 1000000
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
                      onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                      onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                      onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                      onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                      onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                  >
                    🚀 Join Community 🚀
                  </button>
                </form>
              </div>
            </div>
            );
          })()}

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
                zIndex: 10001,
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
                >
                  💬 Join our WhatsApp Community
                </a>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
}
