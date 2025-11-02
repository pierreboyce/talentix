'use client';

import { useState, useEffect } from 'react';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createPortal } from 'react-dom';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignOutConfirmModal({ isOpen, onClose }: SignOutConfirmModalProps) {
  const { signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle fade animation
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      try { document.body.classList.add('talentix-modal-open'); } catch {}
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsAnimating(false), 300);
      try { document.body.classList.remove('talentix-modal-open'); } catch {}
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
      // Also trigger global hide event
      window.dispatchEvent(new Event('talentix-hide-signout-modal'));
    }, 300);
  };

  const handleConfirmSignOut = () => {
    signOut();
    handleClose();
  };

  if (!isAnimating && !isOpen) return null;

  const node = (
    <div 
      className={`modal-overlay transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        position: 'fixed',
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        minHeight: '100svh',
        maxHeight: '100lvh',
        zIndex: 2147483647,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pointerEvents: 'auto',
        margin: 0,
        padding: 0,
        paddingBottom: 'env(safe-area-inset-bottom, 0)',
        overflow: 'hidden'
      }}
      onClick={handleClose}
    >
      {/* playful radial gradient backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(1200px 600px at 10% 10%, rgba(253, 224, 71, 0.35), transparent), radial-gradient(1000px 500px at 90% 90%, rgba(250, 204, 21, 0.28), transparent), rgba(0,0,0,0.45)'
      }} />
      <div 
        className={`rounded-[2.5rem] w-[520px] transform transition-all duration-500 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100 rotate-0' : 'scale-90 translate-y-12 opacity-0 rotate-1'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily: 'Fredoka, sans-serif',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fb923c 100%)',
          boxShadow: '0 40px 80px -12px rgba(251, 191, 36, 0.6), 0 0 0 2px rgba(255, 255, 255, 0.2) inset, 0 15px 35px rgba(0, 0, 0, 0.2)',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          zIndex: 2147483647
        }}
      >
        {/* Floating emojis */}
        <div className="absolute -top-8 -left-8 text-6xl select-none animate-bounce" style={{ opacity: 0.3, animationDelay: '0s', animationDuration: '3s' }}>✨</div>
        <div className="absolute -bottom-8 -right-8 text-7xl select-none animate-bounce" style={{ opacity: 0.25, animationDelay: '1s', animationDuration: '4s' }}>🎉</div>
        <div className="absolute -top-4 -right-12 text-4xl select-none animate-pulse" style={{ opacity: 0.2, animationDuration: '2s' }}>👋</div>
        <div className="absolute -bottom-4 -left-12 text-5xl select-none animate-pulse" style={{ opacity: 0.15, animationDelay: '0.5s', animationDuration: '3s' }}>🔐</div>

        {/* Header */}
        <div className="flex items-center justify-between px-12 pt-12 pb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/40 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl border-2 border-white/30">
              <LogOut className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-black text-black">Sign Out</h1>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="w-14 h-14 flex items-center justify-center rounded-3xl hover:bg-white/40 hover:scale-110 transition-all duration-300 backdrop-blur-sm border-2 border-white/20 shadow-lg"
            style={{ zIndex: 10000001 }}
          >
            <X className="w-6 h-6 text-black stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-12 pb-12">
          <p className="text-black/90 text-lg mb-8 font-semibold leading-relaxed text-center">
            Are you sure you want to sign out? 🤔<br/>
            <span className="text-base opacity-80">You'll need to sign in again to access your account.</span>
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-4 bg-white/95 backdrop-blur-sm text-black rounded-3xl font-black text-lg hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg border-2 border-white/40"
            >
              ✋ Cancel
            </button>
            <button
              onClick={handleConfirmSignOut}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 text-black rounded-3xl font-black text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg border-2 border-white/50"
            >
              👋 Sign Out
            </button>
          </div>

          {/* Decorative divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gradient-to-r from-transparent via-black/10 to-transparent"></div>
            </div>
            <div className="relative flex justify-center text-2xl">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1 rounded-full">⚡</span>
            </div>
          </div>

          {/* Bottom instruction */}
          <div className="text-center">
            <p className="text-black/70 text-base font-medium mb-3">⌨️ Press Enter to sign out, or Escape to cancel</p>
            <div className="text-3xl animate-pulse" style={{ animationDuration: '2s' }}>🧸</div>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(node, document.body) : null;
}
