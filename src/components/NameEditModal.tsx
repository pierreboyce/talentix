'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NameEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameSave: (name: string) => void;
  currentName: string;
}

export default function NameEditModal({ isOpen, onClose, onNameSave, currentName }: NameEditModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [error, setError] = useState('');

  // Handle fade animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setNewName(currentName);
      setError('');
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for fade out animation to complete before hiding
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen, currentName]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for fade out animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSave = () => {
    const trimmedName = newName.trim();
    
    if (!trimmedName) {
      setError('Name cannot be empty');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('Name must be less than 50 characters');
      return;
    }
    
    if (trimmedName === currentName) {
      handleClose();
      return;
    }
    
    onNameSave(trimmedName);
    handleClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleClose();
    }
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
          maxWidth: '500px',
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
            Edit Your Name
          </h2>
          <p style={{ 
            color: '#666', 
            fontSize: '16px'
          }}>
            Current: <span style={{ fontWeight: 'bold' }}>{currentName}</span>
          </p>
        </div>

        {/* Name Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#000', 
            marginBottom: '12px' 
          }}>
            New Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your new name..."
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: '18px',
              borderRadius: '12px',
              border: '2px solid #d97706',
              backgroundColor: '#fff',
              color: '#000',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            autoFocus
          />
          {error && (
            <p style={{
              color: '#dc2626',
              fontSize: '14px',
              marginTop: '8px',
              marginBottom: '0'
            }}>
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleClose}
            className="cancel-button"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #d97706',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="save-button"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#d97706',
              color: '#fff',
              border: '2px solid #d97706',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Save Changes
          </button>
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
            Press Enter to save, or Escape to cancel
          </p>
        </div>
      </div>
    </div>
  );
} 