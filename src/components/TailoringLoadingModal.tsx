'use client';

import React from 'react';
import { Settings, Sparkles } from 'lucide-react';

interface TailoringLoadingModalProps {
  isOpen: boolean;
  companyName?: string;
  jobRole?: string;
  isMobile?: boolean;
}

export default function TailoringLoadingModal({ 
  isOpen, 
  companyName, 
  jobRole,
  isMobile = false 
}: TailoringLoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: isMobile ? '20px' : '16px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '28px' : '24px',
          maxWidth: isMobile ? '100%' : '480px',
          width: '100%',
          padding: isMobile ? '48px 32px' : '56px 48px',
          position: 'relative',
          boxShadow: '0 25px 80px -15px rgba(0, 0, 0, 0.4)',
          border: '3px solid #fde047',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Animated background particles */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          animation: 'pulse 3s ease-in-out infinite',
          pointerEvents: 'none'
        }}></div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Animated cog container */}
          <div style={{
            position: 'relative',
            width: isMobile ? '120px' : '140px',
            height: isMobile ? '120px' : '140px',
            margin: '0 auto 32px auto'
          }}>
            {/* Outer glow ring */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>

            {/* Main cog */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings 
                style={{ 
                  width: isMobile ? '100px' : '120px', 
                  height: isMobile ? '100px' : '120px',
                  color: '#f59e0b',
                  animation: 'spin 3s linear infinite',
                  filter: 'drop-shadow(0 8px 16px rgba(245, 158, 11, 0.4))'
                }} 
              />
            </div>

            {/* Sparkle decorations */}
            <Sparkles style={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: '24px',
              height: '24px',
              color: '#fbbf24',
              animation: 'sparkle 2s ease-in-out infinite',
              filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.6))'
            }} />
            <Sparkles style={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              width: '20px',
              height: '20px',
              color: '#8b5cf6',
              animation: 'sparkle 2s ease-in-out infinite 0.5s',
              filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.6))'
            }} />
            <Sparkles style={{
              position: 'absolute',
              top: '50%',
              left: '-10%',
              width: '18px',
              height: '18px',
              color: '#3b82f6',
              animation: 'sparkle 2s ease-in-out infinite 1s',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.6))'
            }} />
          </div>

          {/* Main heading */}
          <h2
            style={{
              fontSize: isMobile ? '26px' : '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 16px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif",
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🤖 AI Tailoring Questions...
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#6b7280',
              margin: '0 0 24px 0',
              lineHeight: '1.6',
              fontWeight: '500'
            }}
          >
            Creating personalized interview questions just for you!
          </p>

          {/* Details box */}
          {(companyName || jobRole) && (
            <div
              style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '16px',
                padding: isMobile ? '16px' : '20px',
                marginTop: '24px',
                animation: 'slideUp 0.5s ease-out'
              }}
            >
              {jobRole && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: companyName ? '12px' : '0'
                }}>
                  <span style={{ fontSize: '20px' }}>💼</span>
                  <p style={{
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#92400e',
                    margin: '0'
                  }}>
                    Role: {jobRole}
                  </p>
                </div>
              )}
              {companyName && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '20px' }}>🏢</span>
                  <p style={{
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#92400e',
                    margin: '0'
                  }}>
                    Company: {companyName}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '32px'
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        @keyframes sparkle {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 0.6;
          }
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-16px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


