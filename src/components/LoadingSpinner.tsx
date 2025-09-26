'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = '#fde047', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: '24px', height: '24px', borderWidth: '2px' };
      case 'large':
        return { width: '64px', height: '64px', borderWidth: '6px' };
      default:
        return { width: '40px', height: '40px', borderWidth: '4px' };
    }
  };

  const sizeStyles = getSizeStyles();

  const spinnerStyles = {
    ...sizeStyles,
    border: `${sizeStyles.borderWidth} solid rgba(255, 255, 255, 0.3)`,
    borderTop: `${sizeStyles.borderWidth} solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const containerStyles = fullScreen ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)'
  } : {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  return (
    <>
      <div style={containerStyles}>
        <div style={spinnerStyles}></div>
        {message && (
          <p style={{
            marginTop: '16px',
            color: fullScreen ? 'white' : '#374151',
            fontSize: size === 'small' ? '0.875rem' : '1rem',
            fontFamily: 'Fredoka, sans-serif',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Loading overlay component for buttons
interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingText?: string;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function LoadingButton({ 
  children, 
  isLoading, 
  loadingText = 'Loading...', 
  onClick, 
  disabled,
  style,
  className 
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        position: 'relative',
        ...style,
        opacity: isLoading ? 0.7 : 1,
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer'
      }}
      className={className}
    >
      {isLoading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <LoadingSpinner size="small" color="currentColor" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Page-level loading component
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <LoadingSpinner size="large" color="#f59e0b" />
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginTop: '24px',
          marginBottom: '8px',
          fontFamily: 'Fredoka, sans-serif'
        }}>
          {message}
        </h2>
        <p style={{
          color: '#6B7280',
          fontFamily: 'Fredoka, sans-serif'
        }}>
          Please wait while we prepare everything for you...
        </p>
      </div>
    </div>
  );
}

