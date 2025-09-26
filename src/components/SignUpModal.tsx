'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const { signUp, signInWithProvider } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  // Check password matching
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleClose = () => {
    setIsVisible(false);
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
    setError(''); // Clear error when user types
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords don\'t match');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: '' // Optional field removed from UI
      });

      if (result.success) {
        triggerConfetti();
        setTimeout(() => {
          handleClose();
          // Force a full page redirect instead of router.push
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        if (result.error?.includes('already exists') || result.error?.includes('already taken')) {
          setError('That email is already taken 📧');
        } else {
          setError(result.error || 'Something went wrong. Please try again!');
        }
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Network error occurred. Please check your connection!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithProvider(provider);
      
      if (result.success) {
        triggerConfetti();
        setTimeout(() => {
          handleClose();
          // Force a full page redirect instead of router.push
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(result.error || 'OAuth sign up failed');
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setIsLoading(false);
    setError('');
    setPasswordsMatch(null);
    setFocusedInput(null);
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px) saturate(0.8)',
        WebkitBackdropFilter: 'blur(12px) saturate(0.8)',
        zIndex: 9999999,
        overflowY: 'auto',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
      onClick={handleClose}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background confetti colors */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 50% 50%, #fde047 0%, transparent 30%),
              radial-gradient(circle at 30% 70%, #8b5cf6 0%, transparent 25%),
              radial-gradient(circle at 70% 30%, #06d6a0 0%, transparent 25%),
              radial-gradient(circle at 80% 80%, #f59e0b 0%, transparent 20%),
              radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 20%)
            `,
            animation: 'confetti 3s ease-out',
            opacity: 0.3
          }} />
          
          {/* Centered main emoji */}
          <div style={{
            fontSize: '120px',
            animation: 'bounce 1.5s infinite',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1001
          }}>
            🎉
          </div>
          
          {/* Floating emojis */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            fontSize: '60px',
            animation: 'bounce 2s infinite 0.3s both',
            opacity: 0.8
          }}>
            ✨
          </div>
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '25%',
            fontSize: '50px',
            animation: 'bounce 1.8s infinite 0.6s both',
            opacity: 0.8
          }}>
            🚀
          </div>
          <div style={{
            position: 'absolute',
            bottom: '25%',
            left: '30%',
            fontSize: '55px',
            animation: 'bounce 2.2s infinite 0.9s both',
            opacity: 0.8
          }}>
            💫
          </div>
          <div style={{
            position: 'absolute',
            bottom: '30%',
            right: '20%',
            fontSize: '45px',
            animation: 'bounce 1.7s infinite 1.2s both',
            opacity: 0.8
          }}>
            🌟
          </div>
        </div>
      )}

      {/* Modal Card */}
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
          className="close-button"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div style={{ 
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '900', 
              fontFamily: 'Fredoka, sans-serif',
              color: '#1f2937',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              🎉 Welcome to Talentix!
            </h1>
            <p style={{
              fontSize: '14px',
              fontFamily: 'Fredoka, sans-serif',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Your future starts here 💡
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
              fontSize: '16px',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
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
              fontSize: '16px',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '600',
              marginBottom: '16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(139, 92, 246, 0.3)',
                borderTop: '3px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Creating your account... ✨
            </div>
          )}

          {/* OAuth Options First - More Prominent */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleOAuthSignUp('google')}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '3px solid #ea4335',
                  borderRadius: '16px',
                  padding: '16px 12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#ea4335',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(234, 67, 53, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                className="oauth-button"
              >
                <span style={{ fontSize: '18px' }}>🔴</span>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignUp('microsoft')}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  border: '3px solid #0078d4',
                  borderRadius: '16px',
                  padding: '16px 12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  fontFamily: 'Fredoka, sans-serif',
                  color: '#0078d4',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                className="oauth-button"
              >
                <span style={{ fontSize: '18px' }}>🔷</span>
                Microsoft
              </button>
            </div>

                <div style={{
                  display: 'flex',
              alignItems: 'center',
            gap: '12px',
            margin: '12px 0'
            }}>
              <div style={{ flex: 1, height: '2px', background: 'rgba(255, 255, 255, 0.3)' }} />
                  <span style={{
                color: '#374151',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                Or with email
                  </span>
              <div style={{ flex: 1, height: '2px', background: 'rgba(255, 255, 255, 0.3)' }} />
                </div>
              </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Name Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                zIndex: 1,
                opacity: focusedInput === 'name' ? '1' : '0.7',
                transition: 'all 0.3s ease'
              }}>
                ✨
              </div>
              <input
                type="text"
                name="name"
                placeholder="Your awesome name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `3px solid ${focusedInput === 'name' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '14px 16px 14px 50px',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxShadow: focusedInput === 'name' 
                    ? '0 0 20px rgba(139, 92, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: focusedInput === 'name' ? 'translateY(-2px)' : 'translateY(0)'
                }}
                className="fun-input"
              />
            </div>

            {/* Email Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                zIndex: 1,
                opacity: focusedInput === 'email' ? '1' : '0.7',
                transition: 'all 0.3s ease'
              }}>
                📧
              </div>
                <input
                  type="email"
                  name="email"
                placeholder="your.email@awesome.com"
                  value={formData.email}
                  onChange={handleInputChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                  required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `3px solid ${focusedInput === 'email' ? '#06d6a0' : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '14px 16px 14px 50px',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxShadow: focusedInput === 'email' 
                    ? '0 0 20px rgba(6, 214, 160, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: focusedInput === 'email' ? 'translateY(-2px)' : 'translateY(0)'
                }}
                className="fun-input"
                />
              </div>
              
            {/* Password Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                zIndex: 1,
                opacity: focusedInput === 'password' ? '1' : '0.7',
                transition: 'all 0.3s ease'
              }}>
                🔑
              </div>
                <input
                  type="password"
                  name="password"
                placeholder="Super secret password"
                  value={formData.password}
                  onChange={handleInputChange}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                  required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `3px solid ${focusedInput === 'password' ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '16px',
                  padding: '14px 16px 14px 50px',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxShadow: focusedInput === 'password' 
                    ? '0 0 20px rgba(59, 130, 246, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: focusedInput === 'password' ? 'translateY(-2px)' : 'translateY(0)'
                }}
                className="fun-input"
                />
              </div>
              
            {/* Confirm Password Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '20px',
                zIndex: 1,
                opacity: focusedInput === 'confirmPassword' ? '1' : '0.7',
                transition: 'all 0.3s ease'
              }}>
                🔐
              </div>
                <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm that awesome password"
                value={formData.confirmPassword}
                  onChange={handleInputChange}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
                  required
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: `3px solid ${
                    focusedInput === 'confirmPassword' 
                      ? '#f59e0b' 
                      : passwordsMatch === true 
                        ? '#10b981' 
                        : passwordsMatch === false 
                          ? '#ef4444' 
                          : 'rgba(255, 255, 255, 0.3)'
                  }`,
                  borderRadius: '16px',
                  padding: '14px 16px 14px 50px',
                  fontSize: '14px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: '600',
                  color: '#1f2937',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxShadow: focusedInput === 'confirmPassword' 
                    ? '0 0 20px rgba(245, 158, 11, 0.3), 0 8px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transform: focusedInput === 'confirmPassword' ? 'translateY(-2px)' : 'translateY(0)'
                }}
                className="fun-input"
              />
              
              {/* Password Match Indicator */}
              {passwordsMatch !== null && (
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '18px',
                  animation: 'bounce 0.5s ease-out'
                }}>
                  {passwordsMatch ? '✅' : '❌'}
                </div>
              )}
            </div>

            {/* Password Match Message */}
            {passwordsMatch !== null && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: passwordsMatch 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'rgba(239, 68, 68, 0.1)',
                border: `2px solid ${passwordsMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                borderRadius: '12px',
                color: passwordsMatch ? '#059669' : '#dc2626',
                fontSize: '14px',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: '600',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                animation: 'slideInUp 0.3s ease-out'
              }}>
                {passwordsMatch ? '✅ Passwords match!' : '❌ Passwords don\'t match'}
              </div>
            )}

            {/* Submit Button */}
                <button
                  type="submit"
              disabled={isLoading || passwordsMatch === false}
              className="signup-button"
              style={{
                width: '100%',
                background: isLoading || passwordsMatch === false 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: 'Fredoka, sans-serif',
                cursor: isLoading || passwordsMatch === false ? 'not-allowed' : 'pointer',
                boxShadow: isLoading || passwordsMatch === false 
                  ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
                  : '0 12px 24px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.3s ease',
                transform: isLoading || passwordsMatch === false ? 'scale(1)' : 'scale(1)',
                opacity: isLoading || passwordsMatch === false ? 0.6 : 1
              }}
            >
              {isLoading ? '✨ Creating your account...' : 'Let\'s Go 🚀'}
                </button>
            </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-30px);
          }
          70% {
            transform: translateY(-15px);
          }
          90% {
            transform: translateY(-4px);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.3) !important;
          transform: scale(1.1);
        }

        .fun-input:hover {
          transform: translateY(-1px) !important;
        }

        .signup-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 32px rgba(139, 92, 246, 0.5) !important;
        }

        .oauth-button:hover:not(:disabled) {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 640px) {
          .modal-overlay > div {
            margin: 20px !important;
            padding: 24px !important;
          }
          
          .modal-overlay h1 {
            font-size: 32px !important;
          }
          
          .modal-overlay p {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}