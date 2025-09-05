'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  FileText, 
  Users, 
  Trophy, 
  LogIn, 
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useChatbot } from '../contexts/ChatbotContext';
import SignOutConfirmModal from './SignOutConfirmModal';

interface AppItem {
  id: string;
  name: string;
  emoji: string;
  href: string;
  color: string;
}

const mainApps: AppItem[] = [
  {
    id: 'home',
    name: 'Home',
    emoji: '🏠',
    href: '/dashboard',
    color: 'bg-blue-600'
  },
  {
    id: 'job-vacancies',
    name: 'Job Vacancies',
    emoji: '💼',
    href: '/search?q=jobs',
    color: 'bg-green-600'
  },
  {
    id: 'cv-reviewer',
    name: 'CV Reviewer',
    emoji: '📄',
    href: '/cv-reviewer',
    color: 'bg-purple-600'
  },
  {
    id: 'interview-prep',
    name: 'Interview Prep',
    emoji: '👥',
    href: '/interview-prep',
    color: 'bg-yellow-500'
  },
  {
    id: 'talentix-points',
    name: 'Talentix Points',
    emoji: '🏆',
    href: '/score',
    color: 'bg-orange-500'
  },
  {
    id: 'ai-chat',
    name: 'AI Chat',
    emoji: '🤖',
    href: '/ai-chat',
    color: 'bg-indigo-500'
  },
  {
    id: 'career-guidance',
    name: 'Career Guidance',
    emoji: '📚',
    href: '/career-guidance',
    color: 'bg-emerald-600'
  },
  {
    id: 'settings',
    name: 'Settings',
    emoji: '⚙️',
    href: '/settings',
    color: 'bg-gray-600'
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
    id: 'account',
    name: 'Account',
    emoji: '👤',
    href: '/account',
    color: 'bg-blue-500'
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
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const { user, signOut } = useAuth();
  const { openChat } = useChatbot();

  // Add custom CSS for fade-in animation
  useEffect(() => {
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

    return () => {
      document.head.removeChild(style);
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
      setShowSignOutModal(true);
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
    <div className="relative ml-auto">
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

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-20 transition-opacity duration-300"
            onClick={handleClose}
          />
          
          {/* Menu - Optimized Height, Bigger Text/Icons, No Borders */}
          <div 
            className="fixed top-4 right-4 w-[600px] h-[400px] z-50 overflow-hidden rounded-[2rem] animate-fadeIn"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 50%, #fef3c7 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 40px -10px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* Main Apps Grid - 3 columns with emojis */}
            <div className="px-12 py-10">
              <div className="grid grid-cols-3 gap-12">
                {mainApps.map((app) => (
                  app.id === 'ai-chat' ? (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-21 h-21 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg">
                        <span className="text-[3.75rem]">{app.emoji}</span>
                      </div>
                      <span className="text-[0.75rem] text-gray-700 text-center font-black leading-tight max-w-[140px]">
                        {app.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={app.id}
                      href={app.href}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex flex-col items-center p-6 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-21 h-21 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-lg">
                        <span className="text-[3.75rem]">{app.emoji}</span>
                      </div>
                      <span className="text-[0.75rem] text-gray-700 text-center font-black leading-tight max-w-[140px]">
                        {app.name}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Divider with increased spacing */}
            <div className="px-12 py-4">
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Auth Section */}
            <div className="px-12 py-6">
              <h4 className="text-[0.75rem] font-black text-gray-700 mb-6">Account</h4>
              <div className="grid grid-cols-2 gap-6">
                {(user ? loggedInApps : authApps).map((app) => (
                  app.id === 'logout' ? (
                    <button
                      key={app.id}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex items-center p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300 w-full text-left"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-5 group-hover:scale-105 transition-transform shadow-lg">
                        <span className="text-[2.25rem]">{app.emoji}</span>
                      </div>
                      <span className="text-[0.75rem] text-gray-700 font-black">
                        {app.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      key={app.id}
                      href={app.href}
                      onClick={() => handleAppClick(app.href, app.id)}
                      className="group flex items-center p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 hover:border-gray-300"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-5 group-hover:scale-105 transition-transform shadow-lg">
                        <span className="text-[2.25rem]">{app.emoji}</span>
                      </div>
                      <span className="text-[0.75rem] text-gray-700 font-black">
                        {app.name}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-12 py-6 bg-gray-50 border-t border-gray-200">
              <p className="text-base text-gray-500 text-center font-black">
                Powered by Talentix
              </p>
            </div>
          </div>
        </>
      )}
      
      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal 
        isOpen={showSignOutModal} 
        onClose={() => setShowSignOutModal(false)} 
      />
    </div>
  );
} 
 
 
 
 





 
 
 