

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';
import AppLauncher from './AppLauncher';

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  return (
    <header className="w-full bg-[rgb(255,255,255)] border-b border-gray-200/80 sticky top-0 left-0 right-0 z-10" style={{ marginTop: 0, paddingTop: 0, minHeight: '80px', maxHeight: '80px' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4" style={{ marginTop: 0, paddingTop: 0, height: '80px' }}>
        <div className="flex items-center">
          {/* App Launcher - Only show for authenticated users */}
          {user && <AppLauncher />}
          
          {/* Logo */}
          <Link href="/" className={`flex items-center ${user ? 'ml-6' : ''}`}>
            <Image
              src="/logo.png"
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
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
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
      
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
      />
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </header>
  );
} 