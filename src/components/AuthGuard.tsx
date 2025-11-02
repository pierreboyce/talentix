'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import SignUpPromptModal from './SignUpPromptModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Map paths to feature names (matching homepage feature card names)
const getFeatureNameFromPath = (path: string): string => {
  const featureMap: { [key: string]: string } = {
    '/cv-reviewer': 'CV Reviewer',
    '/interview-prep': 'Interview Prep',
    '/video-interview': 'Video Interview',
    '/search': 'Job Search',
    '/job-tracker': 'Job Tracker',
    '/apprenticeship-tracker': 'Apprenticeship Tracker',
    '/cover-letter': 'Cover Letter Generator',
    '/career-guidance': 'Career Guidance',
  };
  
  return featureMap[path] || 'This Feature';
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If no user after loading, show sign-up prompt modal
    if (!user) {
      console.log('🔒 AuthGuard: No user found, showing sign-up prompt');
      setShowSignUpPrompt(true);
    }
  }, [user, loading]);

  const handleCloseModal = () => {
    setShowSignUpPrompt(false);
    // Redirect to homepage with full page reload to prevent blank gradient
    window.location.href = '/home';
  };

  const handleSignUpClick = () => {
    setShowSignUpPrompt(false);
    // Trigger the sign-up modal in the global modal manager
    const signUpEvent = new CustomEvent('openSignUpModal');
    window.dispatchEvent(signUpEvent);
    // Also try the alternative event name used in mobile
    const signUpEventAlt = new Event('talentix-show-signup-modal');
    window.dispatchEvent(signUpEventAlt);
  };

  // Show loading state while checking
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#374151' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '16px',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, show message page with sign-up prompt modal
  if (!user) {
    const featureName = getFeatureNameFromPath(pathname);
    
    return (
      <>
        {/* Main message page */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px 32px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '24px'
            }}>
              🔒
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
              fontFamily: "'Fredoka', sans-serif"
            }}>
              Sign In Required
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              marginBottom: '32px',
              lineHeight: '1.6',
              fontFamily: "'Fredoka', sans-serif"
            }}>
              You must sign in to use <strong>{featureName}</strong>. Sign up for free to access all features!
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <button
                onClick={handleSignUpClick}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: '#000000',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                  fontFamily: "'Fredoka', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.4)';
                }}
              >
                🚀 Sign Up Free
              </button>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'white',
                  color: '#374151',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Fredoka', sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                ← Return to Homepage
              </button>
            </div>
          </div>
        </div>
        
        {/* Sign Up Prompt Modal */}
        <SignUpPromptModal
          isOpen={showSignUpPrompt}
          onClose={handleCloseModal}
          featureName={featureName}
          onSignUpClick={handleSignUpClick}
        />
      </>
    );
  }

  // User is authenticated, render the page
  return <>{children}</>;
}

