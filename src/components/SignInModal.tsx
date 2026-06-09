'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword?: () => void;
}

type ModalMode = 'signin' | 'signup';
type SignInMethod = 'initial' | 'email';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '#e5e7eb' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score, label: 'Medium', color: '#f59e0b' };
  return { score, label: 'Strong', color: '#10b981' };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignInModal({ isOpen, onClose, onForgotPassword }: SignInModalProps) {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [modalMode, setModalMode] = useState<ModalMode>('signin');
  const [signInMethod, setSignInMethod] = useState<SignInMethod>('initial');
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const strength = getPasswordStrength(signUpForm.password);
  const passwordsMatch =
    signUpForm.password && signUpForm.confirmPassword
      ? signUpForm.password === signUpForm.confirmPassword
      : null;

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

  const resetModal = () => {
    setModalMode('signin');
    setSignInMethod('initial');
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ name: '', email: '', password: '', confirmPassword: '' });
    setIsLoading(false);
    setError('');
    setFocusedInput(null);
  };

  const switchMode = (mode: ModalMode) => {
    setModalMode(mode);
    setSignInMethod('initial');
    setError('');
    setSignInForm({ email: '', password: '' });
    setSignUpForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleSignInInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignInForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSignUpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn({ email: signInForm.email, password: signInForm.password });
      if (result.success) {
        handleClose();
        localStorage.removeItem('talentix_signin_success');
        localStorage.removeItem('signin_in_progress');
        setTimeout(() => { window.location.href = '/dashboard'; }, 100);
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signUpForm.name.trim()) { setError('Please enter your name'); return; }
    if (!validateEmail(signUpForm.email)) { setError('Please enter a valid email address'); return; }
    if (signUpForm.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (signUpForm.password !== signUpForm.confirmPassword) { setError("Passwords don't match"); return; }

    setIsLoading(true);
    try {
      const result = await signUp({
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
        location: '',
      });
      if (result.success) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          handleClose();
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        if (result.error?.includes('already exists') || result.error?.includes('already taken')) {
          setError('That email is already taken 📧');
        } else {
          setError(result.error || 'Something went wrong. Please try again!');
        }
      }
    } catch {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithProvider(provider);
      if (!result.success) {
        setIsLoading(false);
        setError(result.error || 'OAuth failed');
      }
    } catch {
      setIsLoading(false);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAnimating) return null;

  const FONT = "'Fredoka', 'Inter', sans-serif";

  const inputStyle = (field: string, extraBorder?: string): React.CSSProperties => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: `2px solid ${extraBorder || (focusedInput === field ? '#fbbf24' : '#e5e7eb')}`,
    fontSize: '1rem',
    fontFamily: FONT,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    boxShadow:
      extraBorder === '#10b981' ? '0 0 0 3px rgba(16,185,129,0.12)' :
      extraBorder === '#ef4444' ? '0 0 0 3px rgba(239,68,68,0.12)' :
      focusedInput === field ? '0 0 0 3px rgba(251,191,36,0.15)' : 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  });

  const providerBtn: React.CSSProperties = {
    width: '100%', padding: '13px 20px', borderRadius: '12px',
    border: '2px solid #e5e7eb', background: '#fff',
    fontSize: '1rem', fontWeight: '600', fontFamily: FONT, color: '#111827',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', transition: 'border-color 0.15s ease, background 0.15s ease',
  };

  const goldBtn = (disabled?: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 20px', borderRadius: '12px',
    background: disabled ? '#e5e7eb' : '#fbbf24',
    border: `2px solid ${disabled ? '#d1d5db' : '#f59e0b'}`,
    fontSize: '1rem', fontWeight: '700', fontFamily: FONT,
    color: disabled ? '#9ca3af' : '#111827',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 4px 14px rgba(251,191,36,0.35)',
    transition: 'all 0.15s ease',
  });

  const toggleLink: React.CSSProperties = {
    background: 'none', border: 'none', fontFamily: FONT,
    fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b',
    cursor: 'pointer', padding: 0, textDecoration: 'underline',
    textDecorationColor: 'transparent', transition: 'text-decoration-color 0.15s ease',
  };

  const isSignUp = modalMode === 'signup';
  const confirmBorder =
    passwordsMatch === true ? '#10b981' : passwordsMatch === false ? '#ef4444' : undefined;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backgroundColor: 'rgba(0,0,0,0.45)',
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
          <div style={{ position: 'absolute', top: '20%', left: '20%', fontSize: '52px', animation: 'su-bounce 1.8s ease-out 0.2s both' }}>✨</div>
          <div style={{ position: 'absolute', top: '25%', right: '22%', fontSize: '44px', animation: 'su-bounce 1.6s ease-out 0.4s both' }}>🚀</div>
          <div style={{ position: 'absolute', bottom: '28%', left: '28%', fontSize: '48px', animation: 'su-bounce 2s ease-out 0.6s both' }}>💫</div>
          <div style={{ position: 'absolute', bottom: '25%', right: '20%', fontSize: '40px', animation: 'su-bounce 1.7s ease-out 0.8s both' }}>🌟</div>
        </div>
      )}

      <div
        style={{
          background: '#fff', borderRadius: '24px', border: '3px solid #fbbf24',
          padding: '40px 36px 36px', width: '100%', maxWidth: '440px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)', position: 'relative',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(16px)',
          opacity: isVisible ? 1 : 0, transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
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
        <div style={{ textAlign: 'center', marginBottom: '28px', opacity: showContent ? 1 : 0, transform: showContent ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.3s ease' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #fef3c7, #fbbf24)', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(251,191,36,0.3)' }}>⚡</div>
          <h2 style={{ fontFamily: FONT, fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontFamily: FONT, fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>
            {isSignUp ? 'Your career journey starts here' : 'Sign in to continue to Talentix'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '11px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', color: '#dc2626', fontSize: '0.875rem', fontFamily: FONT, marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* ── SIGN-IN MODE ── */}
        {!isSignUp && (
          <>
            {signInMethod === 'initial' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => handleOAuth('google')} disabled={isLoading} style={providerBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}>
                  <span style={{ width: '22px', height: '22px', background: '#ea4335', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>G</span>
                  Continue with Google
                </button>
                <button onClick={() => handleOAuth('microsoft')} disabled={isLoading} style={providerBtn}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}>
                  <span style={{ width: '22px', height: '22px', background: '#0078d4', borderRadius: '5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>M</span>
                  Continue with Microsoft
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                  <span style={{ fontFamily: FONT, fontSize: '0.82rem', color: '#9ca3af', fontWeight: '500' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>

                <button onClick={() => setSignInMethod('email')} style={goldBtn()}>
                  Continue with email
                </button>
              </div>
            )}

            {signInMethod === 'email' && (
              <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: FONT, fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email</label>
                  <input type="email" name="email" value={signInForm.email} onChange={handleSignInInput} required
                    style={inputStyle('signin-email')}
                    onFocus={(e) => { setFocusedInput('signin-email'); e.target.style.borderColor = '#fbbf24'; e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.15)'; }}
                    onBlur={(e) => { setFocusedInput(null); e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: FONT, fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Password</label>
                  <input type="password" name="password" value={signInForm.password} onChange={handleSignInInput} required
                    style={inputStyle('signin-password')}
                    onFocus={(e) => { setFocusedInput('signin-password'); e.target.style.borderColor = '#fbbf24'; e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.15)'; }}
                    onBlur={(e) => { setFocusedInput(null); e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <button type="submit" disabled={isLoading} style={goldBtn(isLoading)}>
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                  <button type="button"
                    onClick={() => { if (onForgotPassword) { onForgotPassword(); } else { setShowForgotPasswordModal(true); handleClose(); } }}
                    style={toggleLink}>
                    Forgot password?
                  </button>
                  <button type="button" onClick={() => setSignInMethod('initial')}
                    style={{ ...toggleLink, color: '#6b7280' }}>
                    ← Back
                  </button>
                </div>
              </form>
            )}

            <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: FONT, fontSize: '0.875rem', color: '#6b7280' }}>
              Don&apos;t have an account?{' '}
              <button onClick={() => switchMode('signup')} style={toggleLink}
                onMouseEnter={(e) => { e.currentTarget.style.textDecorationColor = '#f59e0b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecorationColor = 'transparent'; }}>
                Create one
              </button>
            </p>
          </>
        )}

        {/* ── SIGN-UP MODE ── */}
        {isSignUp && (
          <>
            {/* OAuth */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <button type="button" onClick={() => handleOAuth('google')} disabled={isLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#fff', fontSize: '0.95rem', fontWeight: '600', fontFamily: FONT, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'border-color 0.15s ease, background 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}>
                <span style={{ width: '20px', height: '20px', background: '#ea4335', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>G</span>
                Google
              </button>
              <button type="button" onClick={() => handleOAuth('microsoft')} disabled={isLoading}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#fff', fontSize: '0.95rem', fontWeight: '600', fontFamily: FONT, color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'border-color 0.15s ease, background 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = '#fef9c3'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fff'; }}>
                <span style={{ width: '20px', height: '20px', background: '#0078d4', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>M</span>
                Microsoft
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontFamily: FONT, fontSize: '0.82rem', color: '#9ca3af', fontWeight: '500' }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            <form onSubmit={handleEmailSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              <input type="text" name="name" placeholder="Full name" value={signUpForm.name} onChange={handleSignUpInput}
                onFocus={() => setFocusedInput('name')} onBlur={() => setFocusedInput(null)}
                required style={inputStyle('name')} />
              <input type="email" name="email" placeholder="Email address" value={signUpForm.email} onChange={handleSignUpInput}
                onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}
                required style={inputStyle('email')} />

              {/* Password + strength */}
              <div>
                <input type="password" name="password" placeholder="Password (min 8 chars)" value={signUpForm.password} onChange={handleSignUpInput}
                  onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}
                  required style={inputStyle('password')} />
                {signUpForm.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                      {[1, 2, 3].map((seg) => (
                        <div key={seg} style={{
                          flex: 1, height: '4px', borderRadius: '99px',
                          background: strength.score >= seg * 1.5 ? strength.color : '#e5e7eb',
                          transition: 'background 0.25s ease',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: FONT, fontSize: '0.78rem', color: strength.color, fontWeight: '600' }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div style={{ position: 'relative' }}>
                <input type="password" name="confirmPassword" placeholder="Confirm password" value={signUpForm.confirmPassword} onChange={handleSignUpInput}
                  onFocus={() => setFocusedInput('confirmPassword')} onBlur={() => setFocusedInput(null)}
                  required style={inputStyle('confirmPassword', confirmBorder)} />
                {passwordsMatch !== null && (
                  <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
                    {passwordsMatch ? '✅' : '❌'}
                  </span>
                )}
              </div>

              <button type="submit" disabled={isLoading || passwordsMatch === false} style={goldBtn(isLoading || passwordsMatch === false)}>
                {isLoading ? 'Creating account…' : "Let's Go 🚀"}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: FONT, fontSize: '0.875rem', color: '#6b7280' }}>
              Already have an account?{' '}
              <button onClick={() => switchMode('signin')} style={toggleLink}
                onMouseEnter={(e) => { e.currentTarget.style.textDecorationColor = '#f59e0b'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecorationColor = 'transparent'; }}>
                Sign in
              </button>
            </p>
          </>
        )}
      </div>

      <ForgotPasswordModal isOpen={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)} />

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
