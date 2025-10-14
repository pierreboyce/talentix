'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CommunityModal() {
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    location: '',
    hearAbout: ''
  });

  // Client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Listen for community modal open event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleShowCommunityModal = () => {
      console.log('🌟 CommunityModal: Event received to show modal');
      setShowCommunityModal(true);
    };

    window.addEventListener('talentix-show-community-modal', handleShowCommunityModal);

    return () => {
      window.removeEventListener('talentix-show-community-modal', handleShowCommunityModal);
    };
  }, []);

  // Prevent body scroll when community or success modal is open
  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    
    const isAnyModalOpen = showCommunityModal || showSuccessModal;
    
    if (isAnyModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll - comprehensive approach for mobile browsers
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.height = '100vh';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.classList.add('talentix-community-modal-open');
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('talentix-community-modal-open');
      
      // Restore the scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('talentix-community-modal-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [showCommunityModal, showSuccessModal]);

  // Form handling functions
  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      age: '',
      location: '',
      hearAbout: ''
    });
  };

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.age || !formData.location || !formData.hearAbout) {
      return;
    }
    
    try {
      // Send data to newsletter API
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and show success
        resetForm();
        setShowCommunityModal(false);
        setShowSuccessModal(true);
      } else {
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Don't render anything on server
  if (!isMounted) {
    return null;
  }

  return createPortal(
    <>
      {/* Community Form Modal */}
      {showCommunityModal && (() => {
        console.log('🎯 CommunityModal: Rendering Community Modal!');
        return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            overflow: 'auto'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCommunityModal(false);
              resetForm();
            }
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '40px 30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '85vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              border: '2px solid #e5e7eb',
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              zIndex: 1000000
            }}
          >
            <button
              onClick={() => {
                setShowCommunityModal(false);
                resetForm();
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#ef4444',
                transition: 'all 0.2s ease'
              }}
            >
              ✕
            </button>

            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '10px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              🌟 Join Our Community! 🌟
            </h2>
            
            <p
              style={{
                fontSize: '1rem',
                color: '#6b7280',
                textAlign: 'center',
                marginBottom: '30px',
                lineHeight: '1.5'
              }}
            >
              Be the first to know about new features, career tips, and exclusive opportunities!
            </p>

            <form onSubmit={handleCommunitySubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Age */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Age *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required
                  min="13"
                  max="100"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  placeholder="e.g., London, UK"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* How did you hear about us */}
              <div style={{ marginBottom: '30px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  How did you hear about us? *
                </label>
                <select
                  value={formData.hearAbout}
                  onChange={(e) => setFormData({...formData, hearAbout: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s ease',
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Select an option</option>
                  <option value="social-media">Social Media</option>
                  <option value="friend">Friend/Family</option>
                  <option value="search-engine">Search Engine</option>
                  <option value="school">School/University</option>
                  <option value="job-center">Job Center</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                  fontFamily: "'Fredoka', sans-serif"
                }}
              >
                🚀 Join Community 🚀
              </button>
            </form>
          </div>
        </div>
        );
      })()}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
            padding: '20px'
          }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '60px 40px',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Welcome to the Community!
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '30px',
                lineHeight: '1.5',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Thank you for joining! We'll keep you updated with the latest career opportunities and tips.
            </p>
            <a
              href="https://chat.whatsapp.com/BvRTcUNgky19eOCWD1iX4h"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                fontFamily: "'Fredoka', sans-serif"
              }}
            >
              💬 Join our WhatsApp Community
            </a>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

