'use client';

import { useState, useEffect } from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignOutConfirmModal({ isOpen, onClose }: SignOutConfirmModalProps) {
  const { signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle fade animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleConfirmSignOut();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirmSignOut = () => {
    signOut();
    handleClose();
  };

  if (!isAnimating && !isOpen) return null;

  return (
    <div 
      className={`transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: isVisible ? 'blur(8px)' : 'blur(0px)',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
      }}
      onClick={handleClose}
    >
      <div 
        className={`rounded-3xl w-[450px] transform transition-all duration-500 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100 rotate-0' : 'scale-90 translate-y-12 opacity-0 rotate-1'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: 'Fredoka, sans-serif',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          boxShadow: '0 35px 60px -12px rgba(251, 191, 36, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 10px 25px rgba(0, 0, 0, 0.15)',
          border: 'none'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <LogOut className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-black text-black">Sign Out</h1>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-black stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <p className="text-black/90 text-base mb-6 font-semibold leading-relaxed">
            Are you sure you want to sign out? 🤔<br/>
            You'll need to sign in again to access your account.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm text-black rounded-2xl font-black text-base hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg border border-white/20"
            >
              ✋ Cancel
            </button>
            <button
              onClick={handleConfirmSignOut}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-black text-base hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              👋 Sign Out
            </button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-black/20 to-transparent mb-4"></div>

          {/* Bottom instruction */}
          <p className="text-black/70 text-center text-sm font-medium">
            ⌨️ Press Enter to sign out, or Escape to cancel
          </p>
        </div>
      </div>
    </div>
  );
}
