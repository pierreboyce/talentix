
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

  // Prevent body scroll when any modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const isAnyModalOpen = showSignInModal || showSignUpModal || showPricingModal;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('talentix-modal-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('talentix-modal-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('talentix-modal-open');
    };
  }, [showSignInModal, showSignUpModal, showPricingModal]);

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

          {/* Navigation buttons on the right - aligned horizontally with logo */}
          {!user ? (
            <div className="flex items-center space-x-2" style={{ flexWrap: 'nowrap', overflow: 'hidden' }}>
              <button 
                onClick={() => {
                  setShowSignUpModal(false);
                  setShowPricingModal(false);
                  setShowSignInModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                  color: '#374151',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '10px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(96, 165, 250, 0.3)',
                  fontFamily: "'Fredoka', sans-serif",
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minWidth: '65px'
                }}
              >
                🔐 Sign In
              </button>
              
              <button 
                onClick={() => {
                  setShowSignInModal(false);
                  setShowPricingModal(false);
                  setShowSignUpModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000000',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(251, 191, 36, 0.4)',
                  fontFamily: "'Fredoka', sans-serif",
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  minWidth: '70px'
                }}
              >
                🚀 Sign Up
              </button>
            </div>
          ) : (
            /* Authenticated user navigation - Show hamburger menu */
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
          )}
        </div>

        {/* Mobile Menu Dropdown with Animation - Only for authenticated users */}
        {user && (
          <div 
            className={`absolute top-full left-0 right-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 shadow-xl z-30 overflow-hidden transition-all duration-300 ease-out ${
              showMobileMenu ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-4 py-5 space-y-4 transform transition-all duration-300 ${
              showMobileMenu && !isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            }`}>
              <div className="text-center">
                <div className="mobile-menu-title text-lg">Explore Talentix</div>
                <div className="mobile-menu-separator mx-auto mt-2 w-28" />
              </div>
              {/* Authenticated user menu - All desktop features */}
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
            </div>
          </div>
        )}
      </header>
      
      {/* Spacer for sticky header */}
      {isSticky && <div style={{ height: '70px' }} />}
      
      {/* Modals rendered as portals to body */}
      {typeof window !== 'undefined' && createPortal(
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
