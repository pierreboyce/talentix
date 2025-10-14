'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword?: () => void;
}

export default function SignInModal({ isOpen, onClose, onForgotPassword }: SignInModalProps) {
  const { signIn, signInWithProvider } = useAuth();
  const router = useRouter();
  const [signInMethod, setSignInMethod] = useState<'initial' | 'email'>('initial');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Handle fade animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsVisible(true), 10);
      // Show content with additional delay for staggered animation
      setTimeout(() => setShowContent(true), 150);
    } else {
      setShowContent(false);
      setIsVisible(false);
      // Wait for fade out animation to complete before hiding
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for fade out animation to complete before calling onClose
    setTimeout(() => {
      resetModal();
      onClose();
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚨 SIGNIN MODAL - handleEmailSignIn called');
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password
      });

      console.log('🚨 SIGNIN MODAL - signin result:', result);

      if (result.success) {
        console.log('✅ SIGNIN MODAL - Success! Cleaning up and redirecting');
        handleClose();
        
        // Clean up any potentially problematic signin flags
        localStorage.removeItem('talentix_signin_success');
        localStorage.removeItem('signin_in_progress');
        
        // Use router navigation instead of window.location.href to avoid full page reload
        setTimeout(() => {
          console.log('✅ SIGNIN MODAL - Using router navigation to dashboard');
          window.location.href = '/dashboard';
        }, 100);
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithProvider(provider);
      
      if (result.success) {
        handleClose();
        // Force a full page redirect instead of router.push
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        setError(result.error || 'OAuth sign in failed');
      }
    } catch (error) {
      console.error('OAuth sign in error:', error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setSignInMethod('initial');
    setFormData({ email: '', password: '' });
    setIsLoading(false);
    setError('');
  };

  if (!isAnimating) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px) saturate(0.8)',
        WebkitBackdropFilter: 'blur(12px) saturate(0.8)',
        zIndex: 9999999,
        overflowY: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onClick={handleClose}
    >
      {/* Modal container with rounded background */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)',
          position: 'relative',
          zIndex: 10000000,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - moved to top left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
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
            transition: 'background-color 0.2s',
            zIndex: 10000001
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={24} />
        </button>

        {/* Header Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '64px'
            }}>
              <img 
                src="/2936630.png" 
                alt="Job icon" 
                style={{
                  width: '32px',
                  height: '32px'
                }}
              />
            </div>
          </div>
          <div>
            <h2 style={{ 
              color: '#000', 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              lineHeight: '1'
            }}>
              SIGN IN
            </h2>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            borderRadius: '8px',
            border: '1px solid #f87171',
            color: '#dc2626',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Initial Sign In Options */}
          {signInMethod === 'initial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Google Sign In */}
              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  border: '2px solid #d97706',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#dc2626',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>G</span>
                </div>
                Continue with Google
              </button>

              {/* Microsoft Sign In */}
              <button
                onClick={() => handleOAuthSignIn('microsoft')}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  border: '2px solid #d97706',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#2563eb',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>⊞</span>
                </div>
                Continue with Microsoft
              </button>

              {/* Divider */}
              <div style={{ position: 'relative', margin: '24px 0' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{ width: '100%', borderTop: '1px solid #d1d5db' }}></div>
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  <span style={{
                    backgroundColor: '#fbbf24',
                    padding: '0 16px',
                    color: '#000',
                    fontWeight: '600'
                  }}>
                    OR
                  </span>
                </div>
              </div>

              {/* Email Sign In */}
              <button
                onClick={() => setSignInMethod('email')}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  border: '2px solid #d97706',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                Continue with email
              </button>
            </div>
          )}

          {/* Email Sign In Form */}
          {signInMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#000', 
                  marginBottom: '8px' 
                }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #d97706',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    color: '#000'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#000', 
                  marginBottom: '8px' 
                }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #d97706',
                    fontSize: '16px',
                    backgroundColor: '#fff',
                    color: '#000'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '16px',
                  backgroundColor: '#d97706',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Forgot Password Link */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (onForgotPassword) {
                      onForgotPassword();
                    } else {
                      // Fallback to internal state if no callback provided
                      setShowForgotPasswordModal(true);
                      handleClose();
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8b5cf6',
                    fontSize: '14px',
                    fontFamily: 'Fredoka, sans-serif',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot your password? 🔑
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSignInMethod('initial')}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: '#000',
                  border: '1px solid #d97706',
                  cursor: 'pointer'
                }}
              >
                Back to options
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
} 