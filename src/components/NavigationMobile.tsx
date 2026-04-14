
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import PricingModal from './PricingModal';

export default function NavigationMobile() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showHeaderPanel, setShowHeaderPanel] = useState(false);
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);
  const [showJobResourcesSubmenu, setShowJobResourcesSubmenu] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    location: '',
    hearAbout: ''
  });
  const [usage, setUsage] = useState<{ cvToday: number; videoTotal: number }>({ cvToday: 0, videoTotal: 0 });

  // Define pages where the header should not be sticky
  const excludedPages = [
    '/', // Landing page should NOT be sticky
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
  const showApplyCta = pathname === '/home';

  // Close menus/panels when route changes
  useEffect(() => {
    setShowMobileMenu(false);
    setShowJobResourcesSubmenu(false);
    if (showHeaderPanel) {
      setIsPanelAnimating(true);
      const t = setTimeout(() => {
        setShowHeaderPanel(false);
        setIsPanelAnimating(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  // Load usage counts for free tier indicator
  useEffect(() => {
    if (typeof window === 'undefined' || !user?.email) return;
    const today = new Date().toDateString();
    const cvKey = `cv_reviews_${today}_${user.email}`;
    const videoKey = `video_interview_questions_used_${today}_${user.email}`;
    const cvToday = parseInt(localStorage.getItem(cvKey) || '0');
    const videoTotal = parseInt(localStorage.getItem(videoKey) || '0');
    setUsage({ cvToday, videoTotal });
    const update = () => {
      const cv = parseInt(localStorage.getItem(cvKey) || '0');
      const vi = parseInt(localStorage.getItem(videoKey) || '0');
      setUsage({ cvToday: cv, videoTotal: vi });
    };
    window.addEventListener('storage', update);
    window.addEventListener('talentix-usage-update', update as any);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('talentix-usage-update', update as any);
    };
  }, [user?.email]);

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

  // Prevent body scroll when any modal or header panel is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const isAnyModalOpen = showSignInModal || showSignUpModal || showPricingModal || showHeaderPanel || showCommunityModal;
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
  }, [showSignInModal, showSignUpModal, showPricingModal, showHeaderPanel, showCommunityModal]);

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

  // Toggle header panel for non-authenticated users
  const toggleHeaderPanel = () => {
    if (showHeaderPanel) {
      setIsPanelAnimating(true);
      setTimeout(() => {
        setShowHeaderPanel(false);
        setShowJobResourcesSubmenu(false);
        setIsPanelAnimating(false);
      }, 200);
    } else {
      setShowJobResourcesSubmenu(false);
      setShowHeaderPanel(true);
    }
  };

  // Community form handling (minimal)
  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.age || !formData.location || !formData.hearAbout) {
      return;
    }
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ fullName: '', email: '', age: '', location: '', hearAbout: '' });
        setShowCommunityModal(false);
      }
    } catch (err) {
      // Silently ignore for now
    }
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
            <a
              href="/home"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                if (pathname === '/home') {
                  if (typeof window !== 'undefined') window.location.assign('/home');
                } else {
                  router.push('/home');
                }
              }}
            >
              <Image
                src="/longtalentixupdated.png"
                alt="Talentix Logo"
                width={140}
                height={52}
                style={{ objectFit: 'contain' }}
                priority
              />
            </a>
          </div>

          {/* Navigation buttons on the right - aligned horizontally with logo */}
          {!user ? (
            /* Non-auth: show gold burger */
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {showApplyCta && (
                <a
                  href="https://forms.gle/Ntby8YetS3rMkTrt9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%)',
                    color: '#374151',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.3)',
                    fontFamily: 'Fredoka, sans-serif',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Apply for Talentix!
                </a>
              )}
              <button
                onClick={toggleHeaderPanel}
                style={{ 
                  position: 'relative',
                  minHeight: '48px', 
                  minWidth: '48px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '0 8px 16px rgba(245, 158, 11, 0.35)',
                  borderRadius: '12px',
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  transform: 'scale(1)'
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                aria-label={showHeaderPanel ? 'Close menu' : 'Open menu'}
                aria-expanded={showHeaderPanel}
              >
                <div style={{ display: 'grid', gap: '3px' }}>
                  <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
                  <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
                  <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
                </div>
              </button>
            </div>
          ) : (
            /* Authenticated user navigation - Show hamburger menu (uses side panel) */
            <button
              onClick={toggleHeaderPanel}
              style={{ 
                position: 'relative',
                minHeight: '48px', 
                minWidth: '48px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.35)',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                transform: 'scale(1)'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              aria-label={showHeaderPanel ? 'Close menu' : 'Open menu'}
              aria-expanded={showHeaderPanel}
            >
              <div style={{ display: 'grid', gap: '3px' }}>
                <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
                <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
                <span style={{ width: '22px', height: '3px', background: '#000', borderRadius: '2px', display: 'block' }} />
              </div>
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown removed - using side panel instead */}
        {false && user && (
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
                    onClick={() => handleMenuItemClick(() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new Event('talentix-show-signout-modal'));
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

      {/* Free tier usage indicator */}
      {user && subscription.tier === 'free' && (
        <div style={{
          position: 'sticky',
          top: isSticky ? '70px' : 0,
          zIndex: 9,
          background: '#fff7ed',
          borderBottom: '1px solid #fed7aa',
          padding: '6px 12px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#9a3412'
        }}>
          <span>🎬 Video: {usage.videoTotal}/2</span>
          <span>•</span>
          <span>📄 CV today: {usage.cvToday}/1</span>
        </div>
      )}
      
      {/* Header panel, community modal, and auth modals rendered as portals to body */}
      {typeof window !== 'undefined' && createPortal(
        <>
          {(showHeaderPanel || isPanelAnimating) && (
            <div
              className="modal-overlay mobile-panel-overlay"
              onClick={toggleHeaderPanel}
              style={{ 
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'flex-end',
                background: 'rgba(0,0,0,0.35)',
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
                paddingBottom: 'env(safe-area-inset-bottom, 0)',
                margin: 0,
                overflow: 'hidden',
                zIndex: 9999999
              }}
            >
              <aside
                role="dialog"
                aria-modal="true"
                style={{
                  height: '100dvh',
                  minHeight: '100svh',
                  maxHeight: '100lvh',
                  width: '280px',
                  maxWidth: '80vw',
                  background: 'linear-gradient(180deg, #fff7cc 0%, #fff3b0 6%, #ffffff 24%, #ffffff 100%)',
                  boxShadow: '-8px 0 28px rgba(245, 158, 11, 0.35), -2px 0 0 rgba(251, 191, 36, 0.65) inset',
                  transform: showHeaderPanel ? 'translateX(0)' : 'translateX(100%)',
                  transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  boxSizing: 'border-box',
                  paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0px)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '20px 20px 0 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>🚀</span>
                    <div
                      style={{
                        fontWeight: 900,
                        fontFamily: 'Fredoka, Inter, sans-serif',
                        letterSpacing: '-0.2px',
                        background: 'linear-gradient(135deg, #111111 0%, #2b2b2b 40%, #4a4a4a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {user ? 'Explore Talentix' : 'Welcome To Talentix'}
                    </div>
                  </div>
                  <button onClick={toggleHeaderPanel} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ height: '6px', borderRadius: '9999px', background: 'linear-gradient(90deg, #fde047, #f59e0b, #fbbf24)', boxShadow: '0 6px 14px rgba(245, 158, 11, 0.35)', marginBottom: '16px', marginLeft: '20px', marginRight: '20px' }} />
                <div style={{ display: 'grid', gap: '10px', padding: '0 20px', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>
                  {!user ? (
                    <>
                      {/* Non-authenticated menu */}
                      {!showJobResourcesSubmenu ? (
                        <>
                          {showApplyCta && (
                            <a
                              href="https://forms.gle/Ntby8YetS3rMkTrt9"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => toggleHeaderPanel()}
                              style={{
                                background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 100%)',
                                color: '#111827',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.35)',
                                fontFamily: 'Fredoka, sans-serif',
                                textDecoration: 'none',
                                display: 'block',
                                textAlign: 'center'
                              }}
                            >
                              Apply for Talentix!
                            </a>
                          )}
                          <button
                            onClick={() => { toggleHeaderPanel(); router.push('/our-services/workshops'); }}
                            style={{
                              background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                              color: '#374151',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(167, 139, 250, 0.25)',
                              fontFamily: 'Fredoka, sans-serif'
                            }}
                          >
                            🛠️ Talentix Workshops
                          </button>
                          <button
                            onClick={() => setShowJobResourcesSubmenu(true)}
                            style={{
                              background: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)',
                              color: '#374151',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(147, 197, 253, 0.25)',
                              fontFamily: 'Fredoka, sans-serif'
                            }}
                          >
                            📚 Job Resources
                          </button>
                          <button
                            onClick={() => { toggleHeaderPanel(); router.push('/events'); }}
                            style={{
                              background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
                              color: '#374151',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '14px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(248, 113, 113, 0.25)',
                              fontFamily: 'Fredoka, sans-serif'
                            }}
                          >
                            🎉 Events
                          </button>
                          <button
                            onClick={() => { setShowSignInModal(true); toggleHeaderPanel(); }}
                            style={{
                              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                              color: '#374151',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '14px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 6px 16px rgba(251, 191, 36, 0.35)',
                              fontFamily: 'Fredoka, sans-serif'
                            }}
                          >
                            🔐 Sign In / Sign Up
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setShowJobResourcesSubmenu(false)}
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              color: '#374151',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              border: '1px solid rgba(209, 213, 219, 0.9)',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                              fontFamily: 'Fredoka, sans-serif',
                              textAlign: 'left'
                            }}
                          >
                            ← Back to menu
                          </button>

                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px', marginBottom: '2px', paddingLeft: '4px' }}>
                            Job Features
                          </div>

                          <button onClick={() => { toggleHeaderPanel(); router.push('/search?q=jobs'); }} style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>💼 Job Vacancies</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/job-tracker'); }} style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #5eead4 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(94, 234, 212, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>📊 Job Tracker</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/apprenticeship-tracker'); }} style={{ background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(96, 165, 250, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>📋 Apprenticeship Tracker</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/cv-reviewer'); }} style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(167, 139, 250, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>📄 CV Reviewer</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/cover-letter'); }} style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(165, 180, 252, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>✍️ Cover Letter</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/interview-prep'); }} style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(251, 191, 36, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>🎭 Interview Prep</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/video-interview'); }} style={{ background: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(244, 114, 182, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>🎬 Video Interview</button>
                          <button onClick={() => { toggleHeaderPanel(); router.push('/career-guidance'); }} style={{ background: 'linear-gradient(135deg, #bbf7d0 0%, #34d399 100%)', color: '#374151', padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(52, 211, 153, 0.25)', fontFamily: 'Fredoka, sans-serif' }}>🎓 Career Guidance</button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Authenticated menu - Categorized like desktop */}
                      
                      {/* Job Features Category */}
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '8px', marginBottom: '8px', paddingLeft: '4px' }}>
                        Job Features
                      </div>
                      
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/search'); }}
                        style={{
                          background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        💼 Job Vacancies
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/job-tracker'); }}
                        style={{
                          background: 'linear-gradient(135deg, #ccfbf1 0%, #5eead4 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(94, 234, 212, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        📊 Job Tracker
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/apprenticeship-tracker'); }}
                        style={{
                          background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(96, 165, 250, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        📋 Apprenticeship Tracker
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/cv-reviewer'); }}
                        style={{
                          background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(167, 139, 250, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        📄 CV Reviewer
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/cover-letter'); }}
                        style={{
                          background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(165, 180, 252, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        ✍️ Cover Letter
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/interview-prep'); }}
                        style={{
                          background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(253, 224, 71, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🎭 Interview Prep
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/video-interview'); }}
                        style={{
                          background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(248, 113, 113, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🎬 Video Interview
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/career-guidance'); }}
                        style={{
                          background: 'linear-gradient(135deg, #d9f99d 0%, #84cc16 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(132, 204, 22, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🎓 Career Guidance
                      </button>
                      
                      {/* Account & Company Category */}
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '16px', marginBottom: '8px', paddingLeft: '4px' }}>
                        Account & Company
                      </div>
                      
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/dashboard'); }}
                        style={{
                          background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(96, 165, 250, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🏡 Home
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/score'); }}
                        style={{
                          background: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(251, 146, 60, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🎯 Talentix Points
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/dashboard/subscription'); }}
                        style={{
                          background: 'linear-gradient(135deg, #f3e8ff 0%, #c084fc 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(192, 132, 252, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        💎 Subscription
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/settings'); }}
                        style={{
                          background: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(156, 163, 175, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        ⚙️ Settings
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/events'); }}
                        style={{
                          background: 'linear-gradient(135deg, #fecaca 0%, #f87171 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(248, 113, 113, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🎉 Events
                      </button>
                      <button
                        onClick={() => { toggleHeaderPanel(); router.push('/our-services/workshops'); }}
                        style={{
                          background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                          color: '#374151',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(167, 139, 250, 0.25)',
                          fontFamily: 'Fredoka, sans-serif'
                        }}
                      >
                        🛠️ Talentix Workshops
                      </button>
                      
                      {/* Sign Out */}
                      <button
                        onClick={() => { 
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new Event('talentix-show-signout-modal'));
                          }
                          toggleHeaderPanel(); 
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #fecaca 0%, #ef4444 100%)',
                          color: '#ffffff',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                          fontFamily: 'Fredoka, sans-serif',
                          marginTop: '8px'
                        }}
                      >
                        🚪 Sign Out
                      </button>
                    </>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* Simple Community Modal */}
          {showCommunityModal && (
            <div
              className="modal-overlay"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowCommunityModal(false)}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  borderRadius: '16px',
                  padding: '24px',
                  width: '92%',
                  maxWidth: '460px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 800, fontSize: '20px' }}>🌟 Join Our Community! 🌟</h3>
                  <button onClick={() => setShowCommunityModal(false)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                </div>
                <p style={{ color: '#4b5563', marginBottom: '12px', textAlign: 'center' }}>Be the first to know about new features, career tips, and exclusive opportunities!</p>
                <form onSubmit={handleCommunitySubmit}>
                  <div style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="number"
                      placeholder="Age"
                      min={13}
                      max={100}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="Location (e.g., London, UK)"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <select
                      value={formData.hearAbout}
                      onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                      required
                      className="input-field"
                      style={{ width: '100%' }}
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
                  <button type="submit" className="btn-nav-desktop" style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff' }}>
                    🚀 Join Community 🚀
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Existing auth/pricing modals */}
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
