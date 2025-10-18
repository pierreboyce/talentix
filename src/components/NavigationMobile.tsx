
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
  const [isMounted, setIsMounted] = useState(false);

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
    
    const isAnyModalOpen = showSignInModal || showSignUpModal || showPricingModal || showMobileMenu;
    
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
  }, [showSignInModal, showSignUpModal, showPricingModal, showMobileMenu]);

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
                     className="touch-target relative p-3 text-white transition-all duration-300 active:scale-95 border-0 outline-none"
              style={{ 
                       minHeight: '52px',
                       minWidth: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                       background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                       boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(245, 158, 11, 0.3)',
                       borderRadius: '16px',
                       border: '2px solid rgba(255, 255, 255, 0.3)',
                       backdropFilter: 'blur(8px)'
              }}
              aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              aria-expanded={showMobileMenu}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                       e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.5), 0 6px 18px rgba(245, 158, 11, 0.4)';
                       e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                       e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(245, 158, 11, 0.3)';
                       e.currentTarget.style.transform = 'translateY(0) scale(1)';
                     }}
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
          className="fixed inset-0 backdrop-blur-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%)',
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
        className={`fixed top-0 h-full overflow-y-auto transition-all duration-300 ease-out`}
        style={{ 
          right: showMobileMenu ? '0' : '-100%',
          width: '85%',
          maxWidth: '320px',
          paddingTop: '70px',
          touchAction: 'pan-y',
          background: 'linear-gradient(145deg, #fefefe 0%, #ffffff 50%, #fefefe 100%)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15), -5px 0 20px rgba(0, 0, 0, 0.1)',
          borderLeft: '3px solid rgba(251, 191, 36, 0.3)',
          borderTopLeftRadius: '24px',
          borderBottomLeftRadius: '24px',
          zIndex: 10000,
          opacity: 1
        }}
            onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-8 space-y-4 transition-opacity duration-300 ${
          showMobileMenu && !isAnimating ? 'opacity-100' : 'opacity-0'
        }`}>
            <div className="text-center mb-8">
              <div 
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 70%, #d97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  fontFamily: 'Fredoka, sans-serif',
                  letterSpacing: '0.5px',
                  marginBottom: '12px',
                  textShadow: '2px 2px 4px rgba(251, 191, 36, 0.2)'
                }}
              >
                {user ? '✨ Explore Talentix' : '🚀 Welcome to Talentix'}
              </div>
              <div className="flex justify-center items-center gap-2 mb-4">
                <div 
                  className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{ width: '30px' }}
                />
                <div 
                  className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"
                />
                <div 
                  className="h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  style={{ width: '30px' }}
                />
              </div>
              <div 
                className="text-sm font-medium text-gray-600"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.3px'
                }}
              >
                {user ? 'Your career journey awaits!' : 'Let\'s build your future together!'}
              </div>
            </div>
            
            {!user ? (
              /* Non-authenticated user menu - Simple navigation */
              <div className="space-y-4">
                <button 
                  onClick={() => handleMenuItemClick(() => {
                    console.log('Join Our Community clicked - dispatching event!');
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('talentix-show-community-modal'));
                    }
                  })}
                  className="mobile-nav-item w-full text-center transform hover:scale-105 active:scale-95 transition-all duration-200"
                  style={{ 
                    fontFamily: 'Fredoka, sans-serif', 
                    padding: '18px 16px', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3), 0 3px 10px rgba(34, 197, 94, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.7)',
                    color: '#065f46',
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.4), 0 5px 15px rgba(34, 197, 94, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.3), 0 3px 10px rgba(34, 197, 94, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl animate-bounce">🌟</span>
                    <span className="font-bold text-base">Join Our Community</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuItemClick(() => router.push('/our-story'))}
                  className="mobile-nav-item w-full text-center transform hover:scale-105 active:scale-95 transition-all duration-200"
                  style={{ 
                    fontFamily: 'Fredoka, sans-serif', 
                    padding: '18px 16px', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                    boxShadow: '0 8px 25px rgba(253, 224, 71, 0.3), 0 3px 10px rgba(253, 224, 71, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.7)',
                    color: '#92400e',
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fde047 0%, #facc15 100%)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(253, 224, 71, 0.4), 0 5px 15px rgba(253, 224, 71, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(253, 224, 71, 0.3), 0 3px 10px rgba(253, 224, 71, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">📖</span>
                    <span className="font-bold text-base">Our Story</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuItemClick(() => router.push('/our-services'))}
                  className="mobile-nav-item w-full text-center transform hover:scale-105 active:scale-95 transition-all duration-200"
                  style={{ 
                    fontFamily: 'Fredoka, sans-serif', 
                    padding: '18px 16px', 
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                    boxShadow: '0 8px 25px rgba(167, 139, 250, 0.3), 0 3px 10px rgba(167, 139, 250, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.7)',
                    color: '#5b21b6',
                    fontWeight: '700',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(167, 139, 250, 0.4), 0 5px 15px rgba(167, 139, 250, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(167, 139, 250, 0.3), 0 3px 10px rgba(167, 139, 250, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🛠️</span>
                    <span className="font-bold text-base">Our Services</span>
                  </div>
                </button>
                
                <div className="mt-6 pt-6 space-y-4 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  
                  <button 
                    onClick={() => handleMenuItemClick(() => {
                      setShowSignUpModal(false);
                      setShowPricingModal(false);
                      setShowSignInModal(true);
                    })}
                    className="mobile-nav-item w-full text-center transform hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{ 
                      fontFamily: 'Fredoka, sans-serif', 
                      padding: '18px 16px', 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                      boxShadow: '0 8px 25px rgba(96, 165, 250, 0.3), 0 3px 10px rgba(96, 165, 250, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.7)',
                      color: '#1e3a8a',
                      fontWeight: '700',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(96, 165, 250, 0.4), 0 5px 15px rgba(96, 165, 250, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(96, 165, 250, 0.3), 0 3px 10px rgba(96, 165, 250, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.color = '#1e3a8a';
                    }}
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
                    className="mobile-nav-item w-full text-center transform hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{ 
                      fontFamily: 'Fredoka, sans-serif', 
                      padding: '20px 16px', 
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4), 0 4px 15px rgba(251, 191, 36, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                      color: '#92400e',
                      fontWeight: '800',
                      letterSpacing: '0.5px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(251, 191, 36, 0.5), 0 6px 20px rgba(251, 191, 36, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(251, 191, 36, 0.4), 0 4px 15px rgba(251, 191, 36, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.color = '#92400e';
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl animate-pulse">🚀</span>
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
                    onClick={() => handleMenuItemClick(() => router.push('/apprenticeship-tracker'))}
                    className="mobile-nav-item text-center bg-gradient-to-r from-blue-300 to-blue-400 text-gray-800 hover:from-blue-400 hover:to-blue-500 transform hover:scale-105 active:scale-95"
                    style={{ fontFamily: 'Fredoka, sans-serif', padding: '16px 12px', borderRadius: '12px' }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">📋</span>
                      <span className="font-semibold text-sm">Apprenticeship</span>
                    </div>
                  </button>
                  
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
        </>,
        document.body
      )}
    </>
  );
}
