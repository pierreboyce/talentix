

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import PricingModal from './PricingModal';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showOverlayMenu, setShowOverlayMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  

  // Listen for pricing modal events from PaywallGuard
  useEffect(() => {
    const handleOpenPricingModal = () => {
      setShowPricingModal(true);
    };

    window.addEventListener('openPricingModal', handleOpenPricingModal);
    return () => {
      window.removeEventListener('openPricingModal', handleOpenPricingModal);
    };
  }, []);

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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4" style={{ marginTop: 0, paddingTop: 0, height: '80px' }}>
        <div className="flex items-center">
          {/* Menu Button - Always visible */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowOverlayMenu(true);
          }}
            className="mr-4 p-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
          >
            <span style={{ fontSize: '24px', lineHeight: '1' }}>☰</span>
          </button>
          
          {/* App Launcher removed - now using overlay menu */}
          
          {/* Logo */}
          <Link href="/" className={`flex items-center ${user ? 'ml-6' : 'ml-2'}`}>
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
          <div className="flex items-center space-x-3">
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
              onClick={() => setShowPricingModal(true)}
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                color: '#374151',
                padding: '10px 18px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)',
                fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.3)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)';
              }}
            >
              💎 Pricing
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
          />
          <PricingModal 
            isOpen={showPricingModal} 
            onClose={() => setShowPricingModal(false)} 
          />
        </>,
        document.body
      )}
      
      {/* Talentix Overlay Menu - Desktop */}
      {showOverlayMenu && isClient && createPortal(
        <div
          className="fixed inset-0 transition-all duration-300 ease-in-out opacity-100"
          style={{ zIndex: 999999999 }}
        >
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowOverlayMenu(false)}
          />

          {/* Main panel */}
          <div
            className="absolute inset-4 md:inset-8 lg:inset-12 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-3xl shadow-2xl transform scale-100 translate-y-0 overflow-hidden flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setShowOverlayMenu(false)}
              className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Talentix Menu
                </h1>
                <p className="text-white/80 text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Your career journey starts here! ✨
                </p>
              </div>

              {/* Navigation Categories */}
              <div className="space-y-10 md:space-y-12">
                {/* Job Tools */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    🛠️ Job Tools
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                      { href: '/dashboard', emoji: '🏠', label: 'Dashboard' },
                      { href: '/job-vacancies', emoji: '💼', label: 'Job Search' },
                      { href: '/cv-reviewer', emoji: '📄', label: 'CV Reviewer' },
                      { href: '/cover-letter', emoji: '✍️', label: 'Cover Letter' },
                      { href: '/video-interview', emoji: '🎬', label: 'Video Interview' },
                      { href: '/interview-prep', emoji: '🎭', label: 'Interview Prep' },
                      { href: '/job-tracker', emoji: '📊', label: 'Job Tracker' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowOverlayMenu(false)}
                        className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <span className="text-2xl md:text-3xl">{item.emoji}</span>
                        </div>
                        <p className="text-white font-semibold text-sm md:text-base text-center" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                          {item.label}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Growth & Support */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    🌱 Growth & Support
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {[
                      { href: '/career-guidance', emoji: '🎓', label: 'Career Guidance' },
                      { href: '/talentix-points', emoji: '🎯', label: 'Talentix Points' },
                      { href: '/ai-chat', emoji: '🤖', label: 'AI Chat' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowOverlayMenu(false)}
                        className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <span className="text-2xl md:text-3xl">{item.emoji}</span>
                        </div>
                        <p className="text-white font-semibold text-sm md:text-base text-center" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                          {item.label}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    👤 Account
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {[
                      { href: '/settings', emoji: '⚙️', label: 'Settings' },
                      { href: '/subscription', emoji: '💎', label: 'Subscription' },
                      { href: '/our-story', emoji: '📖', label: 'Our Story' },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowOverlayMenu(false)}
                        className="flex flex-col items-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                          <span className="text-2xl md:text-3xl">{item.emoji}</span>
                        </div>
                        <p className="text-white font-semibold text-sm md:text-base text-center" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                          {item.label}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Section */}
            {user ? (
              <div className="p-8 md:p-12 border-t border-white/20 flex items-center justify-between bg-white/5 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user.name ? user.name[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {user.name || user.email?.split('@')[0] || 'Guest'}
                    </p>
                    <p className="text-white/80 text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      View Profile
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Add logout functionality here if needed
                    setShowOverlayMenu(false);
                  }}
                  className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all duration-200"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="p-8 md:p-12 border-t border-white/20 flex items-center justify-center space-x-4 bg-white/5 backdrop-blur-sm">
                <button
                  onClick={() => {
                    setShowOverlayMenu(false);
                    setShowSignInModal(true);
                  }}
                  className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all duration-200"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setShowOverlayMenu(false);
                    setShowSignUpModal(true);
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all duration-200"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </header>
    {isSticky && <div style={{ height: '80px' }} />}
    </>
  );
} 