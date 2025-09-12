'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle fade animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsVisible(true), 10);
      setTimeout(() => setShowContent(true), 150);
    } else {
      setShowContent(false);
      setIsVisible(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      resetModal();
      onClose();
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setEmail('');
    setIsLoading(false);
    setError('');
    setSuccess(false);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50,
        overflowY: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onClick={handleClose}
    >
      {/* Modal Card */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
          borderRadius: '24px',
          padding: '32px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
          position: 'relative',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '12px',
            color: '#374151',
            cursor: 'pointer',
            padding: '8px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div style={{ 
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {success ? (
            /* Success State */
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>📧</div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '900',
                fontFamily: 'Fredoka, sans-serif',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Check Your Email!
              </h1>
              <p style={{
                fontSize: '16px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#6b7280',
                fontWeight: '500',
                marginBottom: '24px',
                lineHeight: '1.5'
              }}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p style={{
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                color: '#9ca3af',
                marginBottom: '32px'
              }}>
                The link will expire in 1 hour for security reasons.
              </p>
              <button
                onClick={handleClose}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif',
                  cursor: 'pointer',
                  boxShadow: '0 12px 24px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Got it! 👍
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: '900',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  🔑 Forgot Your Password?
                </h1>
                <p style={{
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  No worries! We'll send you a reset link 💌
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '16px',
                  color: '#dc2626',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              {/* Loading Progress */}
              {isLoading && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '16px',
                  color: '#8b5cf6',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  marginBottom: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    borderTop: '2px solid #8b5cf6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Sending reset link...
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Email Input */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    zIndex: 1,
                    opacity: '0.7'
                  }}>
                    📧
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@awesome.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      padding: '14px 16px 14px 50px',
                      fontSize: '14px',
                      fontFamily: 'Fredoka, sans-serif',
                      fontWeight: '600',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: isLoading 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                      : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Fredoka, sans-serif',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: isLoading 
                      ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
                      : '0 12px 24px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.3s ease',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link 🚀'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}