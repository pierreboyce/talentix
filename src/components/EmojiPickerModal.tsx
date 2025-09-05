'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  currentEmoji: string;
}

const EMOJI_OPTIONS = [
  '😊', '😄', '😃', '😁', '😆', '😅', '😂', '🤣', '😉', '😋',
  '😎', '😍', '🥰', '😘', '😗', '😙', '😚', '🙂', '🤗', '🤔',
  '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐',
  '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒',
  '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞'
];

export default function EmojiPickerModal({ isOpen, onClose, onEmojiSelect, currentEmoji }: EmojiPickerModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle fade animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for fade out animation to complete before hiding
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for fade out animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    handleClose();
  };

  if (!isAnimating) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onClick={handleClose}
    >
      {/* Modal container with rounded background */}
      <div 
        style={{
          backgroundColor: '#fbbf24',
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#000',
            cursor: 'pointer',
            fontSize: '24px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'background-color 0.2s'
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            color: '#000', 
            fontSize: '28px', 
            fontWeight: 'bold', 
            marginBottom: '8px'
          }}>
            Choose Your Emoji
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '16px'
          }}>
            Current: <span style={{ fontSize: '24px' }}>{currentEmoji}</span>
          </p>
        </div>

        {/* Emoji Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '2px solid #d97706'
        }}>
          {EMOJI_OPTIONS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiSelect(emoji)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '24px',
                border: '2px solid #d97706',
                borderRadius: '8px',
                backgroundColor: emoji === currentEmoji ? '#fde047' : '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                transform: emoji === currentEmoji ? 'scale(1.1)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (emoji !== currentEmoji) {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (emoji !== currentEmoji) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title={`Select ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '2px solid #d97706'
        }}>
          <p style={{ 
            color: '#666', 
            fontSize: '14px'
          }}>
            Click any emoji to select it, or click outside to cancel
          </p>
        </div>
      </div>
    </div>
  );
} 