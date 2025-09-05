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
  const [signUpMethod, setSignUpMethod] = useState<'initial' | 'talentix'>('initial');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');

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

  const handleTalentixSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        location: formData.location
      });

      if (result.success) {
        handleClose();
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Network error occurred');
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
        handleClose();
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
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
    setSignUpMethod('initial');
    setFormData({ name: '', email: '', password: '', location: '' });
    setIsLoading(false);
    setError('');
  };

  if (!isAnimating) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - moved to top left */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'none',
            border: 'none',
            color: '#000',
            cursor: 'pointer',
            fontSize: '24px',
            padding: '4px'
          }}
        >
          <X size={24} />
        </button>

        {/* Content Container */}
        <div style={{ 
          paddingTop: '24px',
          transform: showContent ? 'translateY(0)' : 'translateY(20px)',
          opacity: showContent ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ 
              color: '#000', 
              fontSize: '36px', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              lineHeight: '1'
            }}>
              SIGN UP
            </h2>
            
            {/* Simple minimalist illustration */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
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

          {/* Initial Sign Up Options */}
          {signUpMethod === 'initial' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Google Sign Up */}
              <button
                onClick={() => handleOAuthSignUp('google')}
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

              {/* Microsoft Sign Up */}
              <button
                onClick={() => handleOAuthSignUp('microsoft')}
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

              {/* Talentix Sign Up */}
              <button
                onClick={() => setSignUpMethod('talentix')}
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
                Sign up with email
              </button>
            </div>
          )}

          {/* Talentix Sign Up Form */}
          {signUpMethod === 'talentix' && (
            <form onSubmit={handleTalentixSignUp} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white text-black py-6 px-8 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-lg"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white text-black py-6 px-8 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-lg"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white text-black py-6 px-8 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-lg"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white text-black py-6 px-8 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-lg"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setSignUpMethod('initial')}
                  className="flex-1 bg-gray-200 text-black py-6 px-8 rounded-3xl font-semibold text-lg hover:bg-gray-300 transition-colors shadow-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-6 px-8 rounded-3xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
 