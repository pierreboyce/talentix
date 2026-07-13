'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import SignUpPromptModal from './SignUpPromptModal';

interface AuthGuardProps {
  children: React.ReactNode;
}

const guestAllowedToolPaths = new Set<string>([
  '/search',
  '/cv-reviewer',
  '/interview-prep',
  '/video-interview',
  '/career-guidance',
  '/cover-letter',
]);

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

// Bullets and preview image per feature
const getFeatureInfoFromPath = (path: string): { bullets: string[]; imageSrc?: string; imageAlt: string } => {
  const map: Record<string, { bullets: string[]; imageSrc?: string; imageAlt: string }> = {
    '/cv-reviewer': {
      bullets: [
        'Instant AI feedback on structure, clarity and impact',
        'Specific rewrite suggestions you can copy‑paste',
        'Export or update your CV in minutes'
      ],
      imageSrc: '/cv reviewer.png',
      imageAlt: 'CV Reviewer preview'
    },
    '/interview-prep': {
      bullets: [
        'Topic‑based drills and tailored questions',
        'Timed practice with tips and model points',
        'Track progress and improve fast'
      ],
      imageSrc: '/interviewprep.png',
      imageAlt: 'Interview Prep preview'
    },
    '/video-interview': {
      bullets: [
        'Practice answers on camera with a 1‑minute timer',
        'AI feedback on clarity, confidence and relevance',
        'Level up with tailored improvement tips'
      ],
      imageSrc: '/videointerviewscreenshot.png',
      imageAlt: 'Video Interview preview'
    },
    '/search': {
      bullets: [
        'Simple job search made for UK teens',
        'Find part‑time and starter roles near you',
        'Save roles and apply with confidence'
      ],
      imageSrc: '/jobsearch.png',
      imageAlt: 'Job Search preview'
    },
    '/job-tracker': {
      bullets: [
        'Track every application in one place',
        'Never miss deadlines, interviews or tasks',
        'See your progress at a glance'
      ],
      imageSrc: '/jobtracker (2).png',
      imageAlt: 'Job Tracker preview'
    },
    '/apprenticeship-tracker': {
      bullets: [
        'Discover UK apprenticeship opportunities',
        'Organise choices and compare easily',
        'Stay on top of key dates'
      ],
      imageSrc: '/apprenticeshiptracker.png',
      imageAlt: 'Apprenticeship Tracker preview'
    },
    '/cover-letter': {
      bullets: [
        'Auto‑draft tailored cover letters',
        'Edit tone and details in seconds',
        'Export ready‑to‑send versions'
      ],
      imageSrc: '/coverlettermaker.png',
      imageAlt: 'Cover Letter Builder preview'
    },
    '/career-guidance': {
      bullets: [
        'Clear advice for CVs, interviews and first jobs',
        'Short guides written for teenagers',
        'Practical steps you can take today'
      ],
      imageSrc: '/og-image.png',
      imageAlt: 'Career Guidance preview'
    }
  };

  return map[path] || { bullets: ['Built for UK teens — simple and effective', 'Guided steps to keep you moving', 'Upgrade anytime for unlimited usage'], imageSrc: '/og-image.png', imageAlt: 'Talentix preview' };
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const isGuestAllowedTool = guestAllowedToolPaths.has(pathname);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If no user after loading and this path requires auth, show sign-up prompt modal
    if (!user && !isGuestAllowedTool) {
      console.log('🔒 AuthGuard: No user found, showing sign-up prompt');
      setShowSignUpPrompt(true);
    }
  }, [user, loading, isGuestAllowedTool]);

  const handleDismissModal = () => {
    setShowSignUpPrompt(false);
  };

  const handleCloseModal = () => {
    setShowSignUpPrompt(false);
    window.location.href = '/';
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

  // Allow selected tools to be used without sign-up
  if (!user && isGuestAllowedTool) {
    return <>{children}</>;
  }

  // If no user, show SEO-friendly marketing content plus a gated CTA (returns 200 OK)
  if (!user) {
    const featureName = getFeatureNameFromPath(pathname);
    const featureInfo = getFeatureInfoFromPath(pathname);
    
    return (
      <>
        {/* Public marketing content + CTA (indexable) */}
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
            padding: '40px 32px',
            maxWidth: '860px',
            width: '100%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            textAlign: 'left'
          }}>
            {/* Header */}
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#111827',
              margin: '0 0 6px 0',
              fontFamily: "'Fredoka', sans-serif"
            }}>{featureName}</h1>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              margin: '0 0 20px 0'
            }}>
              A fast, friendly tool to help you level up your career. Below is what you can do — sign in to start.
            </p>

            {/* Simple two-column: benefits + preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px', alignItems: 'start' }}>
              <div>
                <ul style={{ paddingLeft: '18px', margin: 0, color: '#374151', lineHeight: 1.7 }}>
                  {featureInfo.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleSignUpClick}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#111827',
                      padding: '14px 22px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.35)',
                      fontFamily: "'Fredoka', sans-serif"
                    }}
                  >
                    Use {featureName} — Free
                  </button>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      background: 'white',
                      color: '#374151',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ← Return to Homepage
                  </button>
                </div>
              </div>
              <div style={{ background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '10px', textAlign: 'center' }}>
                {featureInfo.imageSrc ? (
                  <Image
                    src={featureInfo.imageSrc}
                    alt={featureInfo.imageAlt}
                    width={640}
                    height={360}
                    style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
                  />
                ) : (
                  <div style={{ fontSize: '48px', padding: '24px 0' }}>✨</div>
                )}
                <p style={{ color: '#6b7280', margin: '8px 0 0' }}>Preview — sign in to try this tool.</p>
              </div>
            </div>

            {/* Fine print */}
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '16px' }}>
              Free plan: 1 CV review/day, 2 video questions/day. Upgrade for unlimited access.
            </p>
          
            {/* (Legacy) alternate CTA column for smaller screens */}
            <div style={{ display: 'none' }}>
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
          onClose={handleDismissModal}
          featureName={featureName}
          onSignUpClick={handleSignUpClick}
        />
      </>
    );
  }

  // User is authenticated, render the page
  return <>{children}</>;
}

