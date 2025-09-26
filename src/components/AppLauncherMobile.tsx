'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useChatbot } from '../contexts/ChatbotContext';

export default function AppLauncherMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { openChat } = useChatbot();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainApps = [
    {
      id: 'home',
      name: 'Home',
      emoji: '🏠',
      href: '/dashboard',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      restricted: false
    },
    {
      id: 'job-vacancies',
      name: 'Job Vacancies',
      emoji: '💼',
      href: '/vacancies',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      restricted: false
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
      color: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      restricted: false
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
      color: 'bg-gradient-to-br from-teal-400 to-teal-600',
      restricted: false
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter',
      emoji: '📝',
      href: '/cover-letter',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      restricted: false
    },
    {
      id: 'talentix-points',
      name: 'Talentix Points',
      emoji: '🎯',
      href: '/talentix-points',
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      restricted: false
    },
    {
      id: 'ai-chat',
      name: 'AI Chat',
      emoji: '🤖',
      href: '/ai-chat',
      color: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
      restricted: false
    },
    {
      id: 'career-guidance',
      name: 'Career Guidance',
      emoji: '🎓',
      href: '/career-guidance',
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      restricted: true
    },
    {
      id: 'subscription',
      name: 'Subscription',
      emoji: '💎',
      href: '/dashboard/subscription',
      color: 'bg-gradient-to-br from-violet-400 to-violet-600',
      restricted: false
    },
    {
      id: 'settings',
      name: 'Settings',
      emoji: '⚙️',
      href: '/settings',
      color: 'bg-gradient-to-br from-gray-400 to-gray-600',
      restricted: false
    }
  ];

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
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="relative">
      {/* 9 Dots Button */}
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

      {/* Mobile Menu Portal */}
      {mounted && isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ zIndex: 2147483646 }}
            onClick={handleClose}
          />
          
          {/* Mobile Menu - Full Screen Overlay */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 2147483647 }}
          >
            <div 
              className="w-full max-w-sm bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
              style={{
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  🚀 Talentix Apps
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-gray-800 hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Apps Grid - 2 columns for mobile */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {mainApps.map((app) => (
                    app.id === 'ai-chat' ? (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app.href, app.id)}
                        className="group relative flex flex-col items-center p-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-white/30 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">{app.emoji}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-800 text-center leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                          {app.name}
                        </span>
                        
                        {/* Pro Restriction Tooltip for Mobile */}
                        {app.restricted && subscription.tier === 'free' && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✨</span>
                          </div>
                        )}
                      </button>
                    ) : (
                      <Link key={app.id} href={app.href}>
                        <div 
                          className="group relative flex flex-col items-center p-4 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-105"
                          onClick={() => handleAppClick(app.href, app.id)}
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 bg-white/30 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">{app.emoji}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-800 text-center leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                            {app.name}
                          </span>
                          
                          {/* Pro Restriction Tooltip for Mobile */}
                          {app.restricted && subscription.tier === 'free' && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✨</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/20">
                <p className="text-xs text-gray-700 text-center font-medium flex items-center justify-center gap-2">
                  <span>⚡</span> Powered by Talentix <span>🚀</span>
                </p>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}


