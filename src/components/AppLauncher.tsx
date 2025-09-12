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

const mainApps: AppItem[] = [
  {
    id: 'home',
    name: 'Home',
    emoji: '🏡',
    href: '/dashboard',
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 'job-vacancies',
    name: 'Job Vacancies',
    emoji: '💼',
    href: '/search?q=jobs',
    color: 'bg-gradient-to-br from-green-400 to-green-600'
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
    id: 'job-tracker',
    name: 'Job Tracker',
    emoji: '📊',
    href: '/job-tracker',
    color: 'bg-gradient-to-br from-teal-400 to-teal-600'
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter',
    emoji: '✍️',
    href: '/cover-letter',
    color: 'bg-gradient-to-br from-indigo-400 to-indigo-600'
  },
  {
    id: 'talentix-points',
    name: 'Talentix Points',
    emoji: '🎯',
    href: '/score',
    color: 'bg-gradient-to-br from-orange-400 to-orange-600'
  },
  {
    id: 'ai-chat',
    name: 'AI Chat',
    emoji: '🤖',
    href: '/ai-chat',
    color: 'bg-gradient-to-br from-cyan-400 to-cyan-600'
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

  // Add custom CSS for fade-in animation and handle scroll position
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
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAppClick = (href: string, appId: string) => {
    setIsOpen(false);
    
    // Special handling for logout
    if (appId === 'logout') {
      // Trigger global sign-out modal
      window.dispatchEvent(new Event('talentix-show-signout-modal'));
      setIsOpen(false);
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300"
            style={{ zIndex: 2147483646 }}
            onClick={handleClose}
          />
          
          {/* Menu - Fun & Playful Design */}
          <div 
            className="w-[520px] h-[380px] overflow-hidden rounded-[2.5rem] animate-fadeIn"
            style={{
              position: 'fixed',
              top: '80px', // Fixed position below header
              left: '0px',
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
              <div className="absolute top-16 right-12 text-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>💫</div>
              <div className="absolute bottom-20 left-12 text-5xl opacity-10 animate-bounce" style={{ animationDelay: '2s' }}>🚀</div>
              <div className="absolute bottom-8 right-16 text-4xl opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute top-32 left-20 text-3xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🎉</div>
            </div>
            {/* Main Apps Grid - 3 columns with emojis */}
            <div className="px-8 py-8">
              <div className="grid grid-cols-3 gap-4">
                {mainApps.map((app) => (
                  app.id === 'ai-chat' ? (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ backdropFilter: 'blur(5px)' }}
                    >
                      <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl relative">
                        <span className="text-[2.2rem] group-hover:animate-bounce">{app.emoji}</span>
                        {app.restricted && subscription.tier === 'free' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[0.72rem] text-gray-800 text-center font-black leading-tight max-w-[100px] group-hover:text-gray-900">
                        {app.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={app.id}
                      href={app.href}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ backdropFilter: 'blur(5px)' }}
                    >
                      <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-xl relative">
                        <span className="text-[2.2rem] group-hover:animate-bounce">{app.emoji}</span>
                        {app.restricted && subscription.tier === 'free' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <Lock className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[0.72rem] text-gray-800 text-center font-black leading-tight max-w-[100px] group-hover:text-gray-900">
                        {app.name}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Fun Divider */}
            <div className="px-8 py-3 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="h-px bg-white/40 flex-1 w-20"></div>
                <span className="text-2xl animate-pulse">✨</span>
                <div className="h-px bg-white/40 flex-1 w-20"></div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="px-8 py-4">
              <h4 className="text-[0.8rem] font-black text-gray-800 mb-3 flex items-center gap-2">
                <span>👤</span> Account
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {(user ? loggedInApps : authApps).map((app) => (
                  app.id === 'logout' ? (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300 w-full text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shadow-lg relative">
                        <span className="text-[1.75rem]">{app.emoji}</span>
                        {app.restricted && subscription.tier === 'free' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[0.65rem] text-gray-700 font-black">
                        {app.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={app.id}
                      href={app.href}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-transform shadow-lg relative">
                        <span className="text-[1.75rem]">{app.emoji}</span>
                        {app.restricted && subscription.tier === 'free' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[0.65rem] text-gray-700 font-black">
                        {app.name}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Fun Footer */}
            <div className="px-8 py-4 bg-white/20 border-t border-white/30" style={{ backdropFilter: 'blur(5px)' }}>
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
 
 
 
 





 
 
 