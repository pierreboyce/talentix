

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
import ResponsiveAppLauncher from './ResponsiveAppLauncher';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false); // Default to mobile-first
  const [isLoaded, setIsLoaded] = useState(false);

  // Set responsive state
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const desktop = width >= 768;
      setIsDesktop(desktop);
      setIsLoaded(true);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
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
      <div className="mx-auto flex items-center justify-between px-6 py-4" style={{ marginTop: 0, paddingTop: 0, height: '80px', width: '90%', maxWidth: '90vw' }}>
        <div className="flex items-center">
          {/* App Launcher - Only show for authenticated users */}
          {user && <ResponsiveAppLauncher />}
          
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

        {/* Right side navigation - COMPLETELY NEW APPROACH */}
        {!user && (
          <div style={{ position: 'relative' }}>
            {/* DEBUG INFO */}
            <div style={{ 
              position: 'absolute', 
              top: '-25px', 
              right: '0', 
              fontSize: '10px', 
              color: 'purple', 
              backgroundColor: 'white', 
              padding: '2px 4px',
              borderRadius: '3px'
            }}>
              Screen: {typeof window !== 'undefined' ? window.innerWidth : 'SSR'}px | 
              Desktop: {isDesktop ? 'YES' : 'NO'}
            </div>

            {/* DESKTOP: Single row (≥768px) */}
            {isDesktop && (
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

            {/* MOBILE: Two rows (< 768px) */}
            {!isDesktop && (
              <div style={{ 
                backgroundColor: 'rgba(255,0,0,0.8)', 
                padding: '12px', 
                borderRadius: '8px',
                border: '3px solid red',
                minWidth: '250px'
              }}>
                <div style={{ fontSize: '10px', color: 'white', marginBottom: '8px', fontWeight: 'bold' }}>
                  🔴 MOBILE NAV ({typeof window !== 'undefined' ? window.innerWidth : 'SSR'}px)
                </div>
                
                {/* Row 1: Our Story + Our Services */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => router.push('/our-story')} 
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)',
                      color: '#374151',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                  >
                    📖 Our Story
                  </button>
                  <button 
                    onClick={() => router.push('/our-services')} 
                    style={{
                      background: 'linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%)',
                      color: '#374151',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                  >
                    🛠️ Our Services
                  </button>
                </div>

                {/* Row 2: Sign In + Sign Up */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowSignInModal(true)} 
                    style={{
                      background: 'linear-gradient(135deg, #bfdbfe 0%, #60a5fa 100%)',
                      color: '#374151',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                  >
                    🔐 Sign In
                  </button>
                  <button 
                    onClick={() => setShowSignUpModal(true)} 
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#000000',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                  >
                    🚀 Sign Up
                  </button>
                </div>
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
          />
          <PricingModal 
            isOpen={showPricingModal} 
            onClose={() => setShowPricingModal(false)} 
          />
        </>,
        document.body
      )}
    </header>
    {isSticky && <div style={{ height: '80px' }} />}
    </>
  );
} 