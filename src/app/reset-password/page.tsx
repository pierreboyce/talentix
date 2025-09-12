'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // Check password matching
  useEffect(() => {
    if (formData.newPassword && formData.confirmPassword) {
      setPasswordsMatch(formData.newPassword === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.newPassword, formData.confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords don\'t match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            fontFamily: 'Fredoka, sans-serif',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Invalid Reset Link
          </h1>
          <p style={{
            fontSize: '16px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '16px 24px',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '700',
              fontFamily: 'Fredoka, sans-serif'
            }}
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            fontFamily: 'Fredoka, sans-serif',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Password Reset Successful!
          </h1>
          <p style={{
            fontSize: '16px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <p style={{
            fontSize: '14px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#9ca3af'
          }}>
            Redirecting you to the homepage in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 25%, #a78bfa 75%, #8b5cf6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            fontFamily: 'Fredoka, sans-serif',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            🔑 Reset Your Password
          </h1>
          <p style={{
            fontSize: '16px',
            fontFamily: 'Fredoka, sans-serif',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Enter your new password below
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
            Updating your password...
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* New Password Input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              zIndex: 1
            }}>
              🔑
            </div>
            <input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                border: '2px solid #e5e7eb',
                borderRadius: '16px',
                padding: '16px 16px 16px 50px',
                fontSize: '16px',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: '600',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>

          {/* Confirm Password Input */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              zIndex: 1
            }}>
              🔐
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                border: `2px solid ${
                  passwordsMatch === true 
                    ? '#10b981' 
                    : passwordsMatch === false 
                      ? '#ef4444' 
                      : '#e5e7eb'
                }`,
                borderRadius: '16px',
                padding: '16px 16px 16px 50px',
                fontSize: '16px',
                fontFamily: 'Fredoka, sans-serif',
                fontWeight: '600',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            
            {/* Password Match Indicator */}
            {passwordsMatch !== null && (
              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px'
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
              textAlign: 'center'
            }}>
              {passwordsMatch ? '✅ Passwords match!' : '❌ Passwords don\'t match'}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || passwordsMatch === false}
            style={{
              width: '100%',
              background: isLoading || passwordsMatch === false 
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '18px 24px',
              fontSize: '18px',
              fontWeight: '700',
              fontFamily: 'Fredoka, sans-serif',
              cursor: isLoading || passwordsMatch === false ? 'not-allowed' : 'pointer',
              boxShadow: isLoading || passwordsMatch === false 
                ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
                : '0 12px 24px rgba(139, 92, 246, 0.4)',
              transition: 'all 0.3s ease',
              opacity: isLoading || passwordsMatch === false ? 0.6 : 1
            }}
          >
            {isLoading ? 'Updating Password...' : 'Reset Password 🚀'}
          </button>
        </form>

        {/* Back to Sign In */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            href="/"
            style={{
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '14px',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: '600'
            }}
          >
            ← Back to Sign In
          </Link>
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
