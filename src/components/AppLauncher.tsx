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
  href: string;
  color: string;
  restricted?: boolean; // For free tier limitations
}

// Reorganized Categories as Requested
const jobToolsApps: AppItem[] = [
  {
    id: 'job-vacancies',
    name: 'Job Vacancies',
    emoji: '💼',
    href: '/search?q=jobs',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    id: 'job-tracker',
    name: 'Job Tracker',
    emoji: '📊',
    href: '/job-tracker',
    color: 'bg-gradient-to-br from-teal-400 to-teal-600'
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
  }
];

const careerSupportApps: AppItem[] = [
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
  },
  {
    id: 'ai-chat',
    name: 'AI Chat',
    emoji: '🤖',
    href: '/ai-chat',
    color: 'bg-gradient-to-br from-cyan-400 to-cyan-600'
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
    id: 'our-story',
    name: 'Our Story',
    emoji: '📖',
    href: '/our-story',
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  },
  {
    id: 'our-services',
    name: 'Our Services',
    emoji: '🛠️',
    href: '/our-services',
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    id: 'logout',
    name: 'Sign Out',
    emoji: '🚪',
    href: '#',
    color: 'bg-gradient-to-br from-red-400 to-red-600'
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
    id: 'our-story',
    name: 'Our Story',
    emoji: '📖',
    href: '/our-story',
    color: 'bg-yellow-600'
  },
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
    
    // Special handling for AI chat - open the widget instead of navigating
    if (appId === 'ai-chat') {
      openChat();
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

  // Helper function to render app items
  const renderAppItem = (app: AppItem) => {
    // Handle placeholder (empty) items
    if (app.id === 'placeholder') {
      return <div key="placeholder" className="opacity-0"></div>;
    }
    
    // Handle logout button
    if (app.id === 'logout') {
      return (
        <button
          key={app.id}
          onClick={() => handleAppClick(app.href, app.id)}
          className="group flex flex-col items-center p-4 rounded-2xl hover:bg-red-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backdropFilter: 'blur(5px)' }}
        >
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl relative">
            <span className="text-[2.8rem] group-hover:animate-bounce">{app.emoji}</span>
          </div>
          <span className="text-[0.75rem] text-red-700 text-center font-medium leading-tight max-w-[100px] group-hover:text-red-800" style={{ fontWeight: '500', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
            {app.name}
          </span>
        </button>
      );
    }
    
    if (app.id === 'ai-chat') {
      return (
        <button
          key={app.id}
          onClick={() => handleAppClick(app.href, app.id)}
          className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backdropFilter: 'blur(5px)' }}
        >
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl relative">
            <span className="text-[2.8rem] group-hover:animate-bounce">{app.emoji}</span>
          </div>
          <span className="text-[0.75rem] text-gray-800 text-center font-medium leading-tight max-w-[100px] group-hover:text-gray-900" style={{ fontWeight: '500', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
            {app.name}
          </span>
          {app.restricted && subscription.tier === 'free' && (
            <div className="absolute left-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none"
              style={{
                zIndex: 2147483647,
                transform: 'translateX(-50%) scale(0.9)',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#1f2937',
                boxShadow: '0 4px 12px rgba(254, 243, 199, 0.6), 0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                whiteSpace: 'nowrap',
                fontFamily: 'Fredoka, sans-serif'
              }}
            >
              Available with Talentix Pro ✨
            </div>
          )}
        </button>
      );
    } else {
      return (
        <Link
          key={app.id}
          href={app.href}
          onClick={() => handleAppClick(app.href, app.id)}
          className="group flex flex-col items-center p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{ backdropFilter: 'blur(5px)' }}
        >
          <div className="w-24 h-24 bg-white/80 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl relative">
            <span className="text-[2.8rem] group-hover:animate-bounce">{app.emoji}</span>
          </div>
          <span className="text-[0.75rem] text-gray-800 text-center font-medium leading-tight max-w-[100px] group-hover:text-gray-900" style={{ fontWeight: '500', textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>
            {app.name}
          </span>
          {app.restricted && subscription.tier === 'free' && (
            <div className="absolute left-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none"
              style={{
                zIndex: 2147483647,
                transform: 'translateX(-50%) scale(0.9)',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#1f2937',
                boxShadow: '0 4px 12px rgba(254, 243, 199, 0.6), 0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                whiteSpace: 'nowrap',
                fontFamily: 'Fredoka, sans-serif'
              }}
            >
              Available with Talentix Pro ✨
            </div>
          )}
        </Link>
      );
    }
  };

  return (
    <div className="relative">
      {/* 9 Dots Button - Positioned on the far right */}
      <button
        onClick={handleToggle}
        className="hover:bg-gray-100 rounded-lg transition-colors bg-transparent p-0"
        aria-label="Open app launcher"
      >
        <Image
          src="/menu-icon-24.png"
          alt="Menu"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      </button>

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

          
          {/* Exit Button - Overlapping Menu */}
          <button
            onClick={handleClose}
            className="fixed top-4 left-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl group"
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              border: '3px solid rgba(255, 255, 255, 0.9)',
              zIndex: 2147483649,
              backgroundColor: '#dc2626',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.6)'
            }}
            aria-label="Exit menu"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">Exit</span>
          </button>

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
                src="/talentixborder.png"
                alt="Talentix"
                width={150}
                height={50}
                className="object-contain"
              />
            </div>

            
            {/* Categorized Apps Grid - Full Menu Layout */}
            <div className="px-8 pt-8 pb-4 flex-1 flex flex-col" style={{ minHeight: 'calc(100% - 120px)' }}>
              
              {/* Account & Company Row - Special layout for 7 items */}
              <div className="flex-1 mb-4">
                <h3 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2">
                  <span>👤</span> Account & Company
                </h3>
                <div className="space-y-3">
                  {/* First row - 4 items */}
                  <div className="grid grid-cols-4 gap-6">
                    {accountCompanyApps.slice(0, 4).map((app) => renderAppItem(app))}
                  </div>
                  {/* Second row - 3 items left-aligned */}
                  <div className="grid grid-cols-4 gap-6">
                    {accountCompanyApps.slice(4, 7).map((app) => renderAppItem(app))}
                    <div className="opacity-0"></div>
                  </div>
                </div>
              </div>

              {/* Center X Button */}
              <div className="flex justify-center items-center py-6">
                <button
                  onClick={handleClose}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: '3px solid rgba(255, 255, 255, 0.9)',
                  }}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Career Support Row */}
              <div className="flex-1 mb-4">
                <h3 className="text-3xl font-bold text-gray-800 mb-12 flex items-center gap-2">
                  <span>🚀</span> Career Support
                </h3>
                <div className="grid grid-cols-4 gap-6 h-full">
                  {careerSupportApps.map((app) => renderAppItem(app))}
                </div>
              </div>

              {/* Job Tools Row */}
              <div className="flex-1 mb-4">
                <h3 className="text-3xl font-bold text-gray-800 mb-10 flex items-center gap-2">
                  <span>🛠️</span> Job Tools
                </h3>
                <div className="grid grid-cols-4 gap-6 h-full">
                  {jobToolsApps.map((app) => renderAppItem(app))}
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
      
      {/* Sign Out Confirmation Modal now handled by GlobalModalManager */}
    </div>
  );
} 
 
 
 
 





 
 
 