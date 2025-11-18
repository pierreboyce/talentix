'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SignUpPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  onSignUpClick: () => void;
}

export default function SignUpPromptModal({ isOpen, onClose, featureName, onSignUpClick }: SignUpPromptModalProps) {
  // Removed auto-close to prevent unwanted redirects/flows
  useEffect(() => {
    return () => {};
  }, []);

  if (!isOpen) return null;

  const handleSignUpClick = () => {
    onClose();
    onSignUpClick();
  };

  const notificationContent = (
    <div 
      className="fixed w-[420px] max-w-[95vw] transform transition-all duration-300"
      style={{
        top: '20px',
        right: '20px',
        zIndex: 2147483647,
        animation: 'slideInFromRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <div 
        className="shadow-2xl transform transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          borderRadius: '24px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ zIndex: 10 }}
        >
          <X size={16} className="text-white" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Oops! Sign Up Required 🔒
            </h3>
            <p className="text-white/90 text-base" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              <span className="font-bold">{featureName}</span> needs an account
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6">
            <h4 className="text-white font-bold mb-4 text-center text-base" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              ✨ Quick benefits:
            </h4>
            <div className="space-y-3">
              <div className="flex items-center text-white text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <span className="mr-3 text-base">✅</span>
                <span>Access to all premium features</span>
              </div>
              <div className="flex items-center text-white text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <span className="mr-3 text-base">✅</span>
                <span>Track your progress with points</span>
              </div>
              <div className="flex items-center text-white text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <span className="mr-3 text-base">✅</span>
                <span>Get AI-powered recommendations</span>
              </div>
              <div className="flex items-center text-white text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                <span className="mr-3 text-base">✅</span>
                <span>Save your work and achievements</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 px-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full bg-gray-200 hover:bg-gray-300 text-black font-semibold text-sm transition-all duration-200 hover:scale-105"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Later ⏰
            </button>
            <button
              onClick={handleSignUpClick}
              className="flex-1 px-6 py-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Sign Up Free! 🚀
            </button>
          </div>
        </div>

        {/* Progress bar for auto-close */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/30"
          style={{
            width: '100%',
            animation: 'progressBar 8s linear forwards',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );

  // Use portal to render outside of normal React tree for maximum z-index effectiveness
  if (typeof window !== 'undefined') {
    return createPortal(notificationContent, document.body);
  }

  return null;
}
