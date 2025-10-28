'use client';

import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building2, Sparkles } from 'lucide-react';

interface TailorInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (companyName: string, jobRole: string) => void;
  isMobile?: boolean;
}

export default function TailorInterviewModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isMobile = false 
}: TailorInterviewModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');

  // Auto-scroll to bottom and lock body when modal opens
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Calculate scroll position (50% down the page to show modal)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = Math.floor(maxScroll * 0.5);
      
      // First, scroll instantly to target
      window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
      
      // Then use requestAnimationFrame to ensure scroll completes
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Now lock the body at this position
          document.body.style.position = 'fixed';
          document.body.style.top = `-${currentScrollY}px`;
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.width = '100%';
          document.body.style.overflow = 'hidden';
          
          // Store original position
          document.body.setAttribute('data-scroll-y', String(scrollY));
          document.body.setAttribute('data-scroll-x', String(scrollX));
        });
      });
      
      return () => {
        // Unlock body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        const originalY = parseInt(document.body.getAttribute('data-scroll-y') || '0');
        const originalX = parseInt(document.body.getAttribute('data-scroll-x') || '0');
        
        window.scrollTo({ top: originalY, left: originalX, behavior: 'instant' });
        
        // Clean up
        document.body.removeAttribute('data-scroll-y');
        document.body.removeAttribute('data-scroll-x');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(companyName, jobRole);
    // Reset form
    setCompanyName('');
    setJobRole('');
  };

  const handleClose = () => {
    setCompanyName('');
    setJobRole('');
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483646,
        padding: isMobile ? '20px' : '40px',
        overflow: 'hidden',
        margin: 0
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '24px' : '20px',
          maxWidth: isMobile ? '90%' : '500px',
          width: '100%',
          padding: isMobile ? '28px 20px' : '32px',
          position: 'relative',
          margin: 'auto',
          boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.3)',
          border: '3px solid #fde047',
          maxHeight: isMobile ? '85vh' : '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: isMobile ? '12px' : '16px',
            right: isMobile ? '12px' : '16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? '36px' : '32px',
            height: isMobile ? '36px' : '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#6b7280',
            fontSize: '20px'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#1f2937';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '28px' }}>
          <div
            style={{
              width: isMobile ? '60px' : '64px',
              height: isMobile ? '60px' : '64px',
              margin: '0 auto 14px auto',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '28px' : '32px',
              boxShadow: '0 8px 20px -6px rgba(251, 191, 36, 0.4)'
            }}
          >
            ✨
          </div>
          <h2
            style={{
              fontSize: isMobile ? '22px' : '26px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 6px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}
          >
            Tailor Your Interview
          </h2>
          <p
            style={{
              fontSize: isMobile ? '13px' : '15px',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.5'
            }}
          >
            Get personalized questions for your specific role and company
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '22px' }}>
          {/* Company Name Input */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '10px'
              }}
            >
              <Building2 style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
              Company Name
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Microsoft, Google, Amazon..."
              style={{
                width: '100%',
                padding: isMobile ? '14px 16px' : '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: isMobile ? '15px' : '16px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Job Role Input */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: isMobile ? '14px' : '15px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '10px'
              }}
            >
              <Briefcase style={{ width: '18px', height: '18px', color: '#8b5cf6' }} />
              Job Role
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '400' }}>(Optional)</span>
            </label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Software Engineer, Marketing Manager..."
              style={{
                width: '100%',
                padding: isMobile ? '14px 16px' : '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: isMobile ? '15px' : '16px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#8b5cf6';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Info Box */}
          <div
            style={{
              backgroundColor: '#fef3c7',
              border: '2px solid #fbbf24',
              borderRadius: '12px',
              padding: isMobile ? '14px' : '15px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <Sparkles style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <p
              style={{
                fontSize: isMobile ? '13px' : '14px',
                color: '#92400e',
                margin: '0',
                lineHeight: '1.5'
              }}
            >
              Fill in either field to get tailored questions, or leave both blank for general interview practice!
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: isMobile ? '16px' : '14px 24px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: "'Fredoka', 'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: isMobile ? '16px' : '14px 24px',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1f2937',
                border: 'none',
                borderRadius: '12px',
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                fontFamily: "'Fredoka', 'Inter', sans-serif"
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                }
              }}
            >
              Generate Questions ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
