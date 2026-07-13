'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, 
  FileText, 
  Users, 
  Trophy, 
  LogIn, 
  UserPlus,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useChatbot } from '../contexts/ChatbotContext';
import { useSubscription } from '../contexts/SubscriptionContext';
// SignOutConfirmModal now handled by GlobalModalManager

interface AppItem {
  id: string;
  name: string;
  emoji: string;
  badge?: string;   // small overlay badge emoji on the icon
  href: string;
  color: string;
  restricted?: boolean;
  tooltip?: string; // hover tooltip text
  disabled?: boolean; // blocks navigation entirely
}

// Reorganized Categories as Requested
const jobFeaturesApps: AppItem[] = [
  {
    id: 'job-vacancies',
    name: 'Job Vacancies',
    emoji: '💼',
    badge: '🚧',
    href: '/search?q=jobs',
    color: 'bg-gradient-to-br from-green-400 to-green-600',
    tooltip: 'Undergoing Improvements!',
  },
  {
    id: 'job-tracker',
    name: 'Job Tracker',
    emoji: '📊',
    href: '/job-tracker',
    color: 'bg-gradient-to-br from-teal-400 to-teal-600'
  },
  {
    id: 'apprenticeship-tracker',
    name: 'Apprenticeship Tracker',
    emoji: '📋',
    badge: '🔒',
    href: '/apprenticeship-tracker',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    tooltip: 'Revamping...',
    disabled: true,
  },
  {
    id: 'cv-reviewer',
    name: 'CV Reviewer',
    emoji: '📄',
    href: '/cv-reviewer',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    restricted: true
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    emoji: '✍️',
    href: '/cover-letter',
    color: 'bg-gradient-to-br from-indigo-400 to-indigo-600'
  },
  {
    id: 'interview-prep',
    name: 'Interview Prep',
    emoji: '🎭',
    href: '/interview-prep',
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  },
  {
    id: 'video-interview',
    name: 'Video Interview',
    emoji: '🎬',
    href: '/video-interview',
    color: 'bg-gradient-to-br from-pink-400 to-pink-600',
    restricted: true
  },
  {
    id: 'career-guidance',
    name: 'Career Guidance',
    emoji: '🎓',
    href: '/career-guidance',
    color: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    restricted: true
  }
];

const accountCompanyApps: AppItem[] = [
  {
    id: 'home',
    name: 'Home',
    emoji: '🏡',
    href: '/dashboard',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 'events',
    name: 'Events',
    emoji: '🎉',
    href: '/events',
    color: 'bg-gradient-to-br from-rose-400 to-rose-600'
  },
  {
    id: 'talentix-points',
    name: 'Talentix Points',
    emoji: '🎯',
    href: '/score',
    color: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  {
    id: 'subscription',
    name: 'Subscription',
    emoji: '💎',
    href: '/dashboard/subscription',
    color: 'bg-gradient-to-br from-violet-400 to-violet-600'
  },
  {
    id: 'settings',
    name: 'Settings',
    emoji: '⚙️',
    href: '/settings',
    color: 'bg-gradient-to-br from-gray-400 to-gray-600'
  },
  {
    id: 'workshops',
    name: 'Talentix Workshops',
    emoji: '🛠️',
    href: '/workshops',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  }
];

const authApps: AppItem[] = [
  {
    id: 'sign-in',
    name: 'Sign In',
    emoji: '🔑',
    href: '/signin',
    color: 'bg-gray-600'
  },
  {
    id: 'sign-up',
    name: 'Sign Up',
    emoji: '➕',
    href: '/signup',
    color: 'bg-orange-500'
  }
];

const loggedInApps: AppItem[] = [
  {
    id: 'logout',
    name: 'Sign Out',
    emoji: '🚪',
    href: '#',
    color: 'bg-red-500'
  }
];

export default function AppLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  // Sign out modal now handled globally
  const [scrollY, setScrollY] = useState(0);
  const { user, signOut } = useAuth();
  const { openChat } = useChatbot();
  const { subscription } = useSubscription();
  const [mounted, setMounted] = useState(false);

  // Add custom CSS for fade-in animation and backdrop blur
  useEffect(() => {
    setMounted(true);
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      .app-launcher-backdrop {
        backdrop-filter: blur(15px) brightness(0.8) saturate(120%) !important;
        -webkit-backdrop-filter: blur(15px) brightness(0.8) saturate(120%) !important;
        background: rgba(0, 0, 0, 0.7) !important;
      }
      
      /* Force backdrop blur on body when menu is open */
      body.app-launcher-open {
        overflow: hidden;
      }
      
      body.app-launcher-open::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 2147483645;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Track scroll position for menu positioning
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    // Set initial scroll position
    setScrollY(window.scrollY);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('scroll', handleScroll);
      // Cleanup body class on unmount
      document.body.classList.remove('app-launcher-open');
    };
  }, []);

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Add/remove body class for backdrop effect
    if (newIsOpen) {
      document.body.classList.add('app-launcher-open');
    } else {
      document.body.classList.remove('app-launcher-open');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.classList.remove('app-launcher-open');
  };

  const handleAppClick = (href: string, appId: string) => {
    setIsOpen(false);
    document.body.classList.remove('app-launcher-open');
    
    // Special handling for logout
    if (appId === 'logout') {
      // Trigger global sign-out modal
      window.dispatchEvent(new Event('talentix-show-signout-modal'));
      return;
    }
    
    
    // Special handling for home button
    if (appId === 'home') {
      if (user) {
        // User is signed in, go to dashboard
        window.location.href = '/dashboard';
      } else {
        // User is not signed in, go to landing page
        window.location.href = '/';
      }
    }
    // For other apps, the Link component will handle navigation
  };

  // Helper function to get custom Pro messages based on app ID
  const getProMessage = (appId: string) => {
    switch (appId) {
      case 'cv-reviewer':
        return 'Unlimited Reviews with Talentix Pro ✨';
      case 'video-interview':
        return 'Unlimited Practice with Talentix Pro ✨';
      case 'career-guidance':
        return 'Unlimited Guides with Talentix Pro ✨';
      default:
        return 'Available with Talentix Pro ✨';
    }
  };

  // Helper function to render app items
  const renderAppItem = (app: AppItem) => {
    // Handle placeholder (empty) items
    if (app.id === 'placeholder') {
      return <div key="placeholder" className="opacity-0"></div>;
    }

    const tooltipText = app.tooltip ?? (app.restricted && subscription.tier === 'free' ? getProMessage(app.id) : null);

    const inner = (
      <>
        {/* Wrapper gives us a reliable relative ancestor for the badge */}
        <div style={{ position: 'relative', display: 'inline-flex', marginBottom: '12px' }}>
          <div className="w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl"
            style={{ opacity: app.disabled ? 0.6 : 1 }}>
            <span className="text-[2.8rem] group-hover:animate-bounce">{app.emoji}</span>
          </div>
          {/* Badge — sibling of icon, not child, so no clip from transforms */}
          {app.badge && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              fontSize: '1.5rem', lineHeight: 1,
              zIndex: 20,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
              pointerEvents: 'none',
            }}>{app.badge}</span>
          )}
        </div>
        <span className="text-[0.75rem] text-gray-800 text-center font-medium leading-tight max-w-[100px] group-hover:text-gray-900"
          style={{ fontWeight: '500', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
          {app.name}
        </span>
        {/* Tooltip */}
        {tooltipText && (
          <div className="absolute left-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none"
            style={{
              zIndex: 2147483647,
              transform: 'translateX(-50%) scale(0.9)',
              background: app.tooltip
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                : 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '700',
              color: app.tooltip ? '#fbbf24' : '#1f2937',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              border: `1.5px solid ${app.tooltip ? '#fbbf24' : 'rgba(255,255,255,0.8)'}`,
              whiteSpace: 'nowrap',
              fontFamily: 'Fredoka, sans-serif',
            }}
          >
            {tooltipText}
          </div>
        )}
      </>
    );

    if (app.disabled) {
      return (
        <div
          key={app.id}
          className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 relative"
          style={{ backdropFilter: 'blur(5px)', cursor: 'not-allowed' }}
        >
          {inner}
        </div>
      );
    }

    return (
      <Link
        key={app.id}
        href={app.href}
        onClick={() => handleAppClick(app.href, app.id)}
        className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl relative"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        {inner}
      </Link>
    );
  };

  return (
    <>
      <div className="relative flex flex-col items-center gap-1">
        {/* Hamburger Menu Button - Matching mobile design */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-center p-3 rounded-xl text-white shadow-lg transition-all duration-200 active:scale-95 border-0 outline-none"
          style={{ 
            minHeight: '48px', 
            minWidth: '48px',
            backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            boxShadow: '0 8px 16px rgba(245, 158, 11, 0.35)'
          }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={isOpen ? 'M5 5L19 19' : 'M3 7H21'} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <path d={isOpen ? 'M19 5L5 19' : 'M3 12H21'} stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            {!isOpen && (
              <path d="M3 17H21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            )}
          </svg>
        </button>
        
        {/* Menu text below button */}
        <span className="text-xs font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Menu
        </span>
      </div>

      {/* Dropdown Menu (portaled to body to avoid clipping/stacking issues) */}
      {mounted && isOpen && createPortal(
        <>
          {/* Enhanced Backdrop with Blur and Darkening */}
          <div 
            className="fixed inset-0 app-launcher-backdrop transition-all duration-500 ease-out"
            style={{ 
              zIndex: 2147483646,
            }}
            onClick={handleClose}
          >
            {/* Additional overlay for stronger darkening effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                mixBlendMode: 'multiply'
              }}
            />
          </div>

          {/* Menu - Fun & Playful Design */}
          <div 
            className="overflow-hidden rounded-[2.5rem] animate-fadeIn"
            style={{
              position: 'fixed',
              top: '10px', // Closer to top of screen
              left: '2vw', // 2% margin on left (96% width + 2% left + 2% right = 100%)
              width: '96vw', // 96% of viewport width
              height: '95vh', // 95% of viewport height
              zIndex: 2147483647,
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #facc15 50%, #f59e0b 75%, #d97706 100%)',
              boxShadow: '0 30px 60px -12px rgba(245, 158, 11, 0.4), 0 15px 50px -10px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Close X Button - Top Right Corner Inside Menu */}
            <button
              onClick={handleClose}
              className="absolute rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                backgroundColor: '#e63946',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(230, 57, 70, 0.4)',
                cursor: 'pointer'
              }}
              aria-label="Close menu"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d32f2f';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(230, 57, 70, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e63946';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.4)';
              }}
            >
              ×
            </button>
            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-8 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0s' }}>🎯</div>
              <div className="absolute top-16 right-12 text-4xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>💫</div>
              <div className="absolute bottom-20 left-12 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '2s' }}>🚀</div>
              <div className="absolute bottom-8 right-16 text-4xl opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute top-32 left-20 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🎉</div>
            </div>
            

            {/* Talentix Logo */}
            <div className="flex justify-center items-center pt-6 pb-2">
              <Image
                src="/longtalentixupdated.png"
                alt="Talentix"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>

            
            {/* Categorized Apps Grid - Full Menu Layout */}
            <div className="px-8 pt-8 pb-4 flex-1 flex flex-col" style={{ minHeight: 'calc(100% - 120px)' }}>
              
              {/* Account & Company Row - Special layout for 6 items */}
              <div className="flex-1 mb-4" style={{ position: 'relative' }}>
                {/* Profile Section with Sign Out - Absolutely Positioned Top Right */}
                <div style={{ 
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '8px',
                  zIndex: 10
                }}>
                  {/* Profile Block */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.5)'
                  }}>
                    {/* Profile Avatar */}
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'B'}
                      </span>
                    </div>
                    
                    {/* Profile Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{
                        color: '#1f2937',
                        fontSize: '12px',
                        fontWeight: '600',
                        lineHeight: '1.2',
                        fontFamily: 'Fredoka, sans-serif'
                      }}>
                        {user?.name || 'boyce'}
                      </span>
                      <span style={{
                        color: subscription.tier === 'free' ? '#059669' : '#ea580c',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: subscription.tier === 'free' ? '#d1fae5' : '#fed7aa',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        lineHeight: '1.2',
                        fontFamily: 'Fredoka, sans-serif'
                      }}>
                        {subscription.tier === 'free' ? 'FREE' : subscription.tier.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Sign Out Button - Below Profile */}
                  <button
                    onClick={() => handleAppClick('#', 'logout')}
                    style={{
                      backgroundColor: '#e63946',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontFamily: 'Fredoka, sans-serif',
                      transition: 'background-color 0.2s ease',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#c5303e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#e63946';
                    }}
                  >
                    Sign Out
                  </button>
                </div>

                {/* Header with title only */}
                <div style={{ 
                  padding: '10px',
                  marginBottom: '24px'
                }}>
                  <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <span>👤</span> Account & Company
                  </h3>
                </div>
                <div className="space-y-3">
                  {/* First row - 4 items */}
                  <div className="grid grid-cols-4 gap-6">
                    {accountCompanyApps.slice(0, 4).map((app) => renderAppItem(app))}
                  </div>
                  {/* Second row - 2 items left-aligned */}
                  <div className="grid grid-cols-4 gap-6">
                    {accountCompanyApps.slice(4, 6).map((app) => renderAppItem(app))}
                    <div className="opacity-0"></div>
                    <div className="opacity-0"></div>
                  </div>
                </div>
              </div>


              {/* Job Features Row */}
              <div className="flex-1 mb-4">
                <h3 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2">
                  <span>💼</span> Job Features
                </h3>
                <div className="grid grid-cols-4 gap-6 h-full">
                  {jobFeaturesApps.map((app) => renderAppItem(app))}
                </div>
              </div>
            </div>


            {/* Fun Footer */}
            <div className="px-12 py-5 bg-white/20 border-t border-white/30" style={{ backdropFilter: 'blur(5px)' }}>
              <p className="text-[0.8rem] text-gray-800 text-center font-bold flex items-center justify-center gap-2">
                <span>⚡</span> Powered by Talentix <span>🚀</span>
              </p>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
} 
 
 
 
 





 
 
 