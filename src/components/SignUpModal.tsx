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
      // Don't close the modal - let signInWithProvider handle the redirect
      // This prevents any race conditions or intermediate redirects
      const result = await signInWithProvider(provider);
      
      if (result.success) {
        // signInWithProvider already does window.location.href redirect to OAuth
        // So we don't need to do anything here - the page will redirect immediately
        // Don't close modal or trigger confetti - let OAuth flow complete
      } else {
        setIsLoading(false);
        setError(result.error || 'OAuth sign up failed');
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      setIsLoading(false);
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

  const FONT = "'Fredoka', 'Inter', sans-serif";
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: `2px solid ${focusedInput === field ? '#fbbf24' : '#e5e7eb'}`,
    fontSize: '1rem',
    fontFamily: FONT,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focusedInput === field ? '0 0 0 3px rgba(251,191,36,0.15)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  });
  const confirmBorder = passwordsMatch === true ? '#10b981' : passwordsMatch === false ? '#ef4444' : focusedInput === 'confirmPassword' ? '#fbbf24' : '#e5e7eb';

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        backgroundColor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999999, overflowY: 'auto',
        opacity: isVisible ? 1 : 0, transition: 'opacity 0.25s ease',
      }}
      onClick={handleClose}
    >
      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10000002, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '100px', animation: 'su-bounce 1.5s ease-out both' }}>🎉</div>
          <div style={{ position: 'absolute', top: '20%', left: '20%', fontSize: '52px', animation: 'su-bounce 1.8s ease-out 0.2s both', opacity: 0.85 }}>✨</div>
          <div style={{ position: 'absolute', top: '25%', right: '22%', fontSize: '44px', animation: 'su-bounce 1.6s ease-out 0.4s both', opacity: 0.85 }}>🚀</div>
          <div style={{ position: 'absolute', bottom: '28%', left: '28%', fontSize: '48px', animation: 'su-bounce 2s ease-out 0.6s both', opacity: 0.85 }}>💫</div>
          <div style={{ position: 'absolute', bottom: '25%', right: '20%', fontSize: '40px', animation: 'su-bounce 1.7s ease-out 0.8s both', opacity: 0.85 }}>🌟</div>
        </div>
      )}

      {/* Card */}
      <div
        style={{
          background: '#fff',
          borderRadius: '24px',
          border: '3px solid #fbbf24',
          padding: '40px 36px 36px',
          width: '100%', maxWidth: '460px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          position: 'relative', zIndex: 10000000,
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', borderRadius: '8px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af'; }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.3s ease' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #fef3c7, #fbbf24)', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 14px', boxShadow: '0 4px 12px rgba(251,191,36,0.3)' }}>⚡</div>
          <h2 style={{ fontFamily: FONT, fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: '0 0 5px' }}>Create your account</h2>
          <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>Your career journey starts here</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '11px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', color: '#dc2626', fontSize: '0.875rem', fontFamily: FONT, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* OAuth */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <button
            type="button" onClick={() => handleOAuthSignUp('google')} disabled={isLoading}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#fff', fontSize: '0.95rem', fontWeight: '600', fontFamily: FONT, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'border-color 0.15s ease, background 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}
          >
            <span style={{ width: '20px', height: '20px', background: '#ea4335', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>G</span>
            Google
          </button>
          <button
            type="button" onClick={() => handleOAuthSignUp('microsoft')} disabled={isLoading}
            style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#fff', fontSize: '0.95rem', fontWeight: '600', fontFamily: FONT, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'border-color 0.15s ease, background 0.15s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}
          >
            <span style={{ width: '20px', height: '20px', background: '#0078d4', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>M</span>
            Microsoft
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 14px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontFamily: FONT, fontSize: '0.82rem', color: '#9ca3af', fontWeight: '500' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} onFocus={() => setFocusedInput('name')} onBlur={() => setFocusedInput(null)} required style={inputStyle('name')} />
          <input type="email" name="email" placeholder="your.email@example.com" value={formData.email} onChange={handleInputChange} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)} required style={inputStyle('email')} />
          <input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleInputChange} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)} required style={inputStyle('password')} />
          <div style={{ position: 'relative' }}>
            <input
              type="password" name="confirmPassword" placeholder="Confirm password"
              value={formData.confirmPassword} onChange={handleInputChange}
              onFocus={() => setFocusedInput('confirmPassword')} onBlur={() => setFocusedInput(null)}
              required
              style={{ ...inputStyle('confirmPassword'), borderColor: confirmBorder, boxShadow: passwordsMatch === true ? '0 0 0 3px rgba(16,185,129,0.12)' : passwordsMatch === false ? '0 0 0 3px rgba(239,68,68,0.12)' : focusedInput === 'confirmPassword' ? '0 0 0 3px rgba(251,191,36,0.15)' : 'none' }}
            />
            {passwordsMatch !== null && (
              <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                {passwordsMatch ? '✅' : '❌'}
              </span>
            )}
          </div>

          <button
            type="submit" disabled={isLoading || passwordsMatch === false}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: '12px',
              background: isLoading || passwordsMatch === false ? '#e5e7eb' : '#fbbf24',
              border: `2px solid ${isLoading || passwordsMatch === false ? '#d1d5db' : '#f59e0b'}`,
              fontSize: '1rem', fontWeight: '700', fontFamily: FONT,
              color: isLoading || passwordsMatch === false ? '#9ca3af' : '#111827',
              cursor: isLoading || passwordsMatch === false ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || passwordsMatch === false ? 'none' : '0 4px 14px rgba(251,191,36,0.4)',
              transition: 'all 0.15s ease', marginTop: '4px',
            }}
          >
            {isLoading ? 'Creating account…' : "Let's Go 🚀"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes su-bounce {
          0% { opacity: 0; transform: scale(0.3) translateY(40px); }
          60% { opacity: 1; transform: scale(1.05) translateY(-8px); }
          80% { transform: scale(0.97) translateY(4px); }
          100% { opacity: 0.9; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}