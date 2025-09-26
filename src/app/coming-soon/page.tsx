"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function ComingSoon() {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    location: '',
    hearAbout: ''
  });
  const router = useRouter();

  const correctPassword = 'yourfirstjob129!';

  // Note: Do not auto-redirect here; middleware protects the rest of the site.

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
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Successfully subscribed to newsletter:', result);
        
        // Reset form and show success
        resetForm();
        setShowCommunityModal(false);
        setShowSuccessModal(true);
      } else {
        console.error('❌ Newsletter subscription failed:', result.error);
        alert(result.error || 'Failed to subscribe to newsletter. Please try again.');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      age: '',
      location: '',
      hearAbout: ''
    });
  };

  // Prevent body scroll when modal is open and prevent over-scroll
  useEffect(() => {
    if (showCommunityModal || showSuccessModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCommunityModal, showSuccessModal]);

  // Prevent over-scrolling and ensure proper scroll position
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      // Set session cookie and redirect
      document.cookie = `talentix_access=authenticated; path=/; max-age=86400`; // 24 hours
      router.push('/');
    } else {
      setAttempts(prev => prev + 1);
      setIsShaking(true);
      setPassword('');
      
      if (attempts >= 2) {
        setShowHint(true);
      }
      
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
        width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite',
      display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0',
        fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        zIndex: 1
      }}>
      
      {/* Integrated Header in Gradient */}
      <div 
        className="top-header"
        style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '3px solid #fde047',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        width: '100%',
        zIndex: 10
      }}>
        <div 
          className="top-header-text"
          style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
            Launching Soon! 🚀
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
        width: '100%'
    }}>
      
      {/* Animated Background Elements */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          fontSize: '4rem',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }}>🚀</div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '3rem',
          opacity: 0.15,
          animation: 'float 4s ease-in-out infinite 1s'
        }}>✨</div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          fontSize: '5rem',
          opacity: 0.1,
          animation: 'float 7s ease-in-out infinite 2s'
        }}>🎯</div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          fontSize: '4rem',
          opacity: 0.12,
          animation: 'float 5s ease-in-out infinite 0.5s'
        }}>💼</div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          fontSize: '3.5rem',
          opacity: 0.08,
          animation: 'float 6.5s ease-in-out infinite 1.5s'
        }}>🌟</div>
        <div style={{
          position: 'absolute',
          top: '70%',
          right: '25%',
          fontSize: '3rem',
          opacity: 0.1,
          animation: 'float 5.5s ease-in-out infinite 0.8s'
        }}>🎉</div>
      </div>

      {/* Join Community Button - Above content */}
      <button
        className="community-button"
        onClick={() => setShowCommunityModal(true)}
        style={{
          background: 'linear-gradient(135deg, #fde047 0%, #facc15 100%)',
          color: '#1f2937',
          padding: '16px 32px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: '25px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(253, 224, 71, 0.4)',
          fontFamily: 'inherit',
          transform: 'translateY(0)',
          zIndex: 10,
          position: 'relative',
          marginBottom: '30px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(253, 224, 71, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(253, 224, 71, 0.4)';
        }}
      >
        🌟 Join our Community 🌟
      </button>

      <div 
        className="main-content"
        style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        padding: '60px 50px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3), 0 15px 40px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        transform: isShaking ? 'translateX(0)' : 'translateX(0)',
        animation: isShaking ? 'shake 0.6s ease-in-out' : 'none',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Logo */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            talentix
          </h1>
          <div 
            className="feature-card"
            style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
              for teenagers by teenagers...
          </div>
        </div>

        {/* Coming Soon Message */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 20px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            🎉 The UK's #1 job support site is launching soon 🎉
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#4b5563',
            lineHeight: '1.6',
            margin: '0 0 30px 0'
          }}>
            We're putting the final touches on your new favorite job platform! More information coming soon!
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div 
            className="feature-card"
            style={{
            position: 'relative',
            marginBottom: '30px'
          }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the secret password... 🔐"
              style={{
                width: '100%',
                padding: '20px 25px',
                fontSize: '1.1rem',
                borderRadius: '25px',
                border: '3px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                color: '#1f2937',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>
          
          <button
            type="submit"
            className="submit-button"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              padding: '18px 40px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              fontFamily: 'inherit',
              transform: 'translateY(0)'
            }}
          >
            🚀 Launch Into Talentix! 🌟
          </button>
        </form>

        {/* Hint System */}
        {showHint && (
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            animation: 'fadeIn 0.5s ease-in'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '1rem',
              margin: '0',
              fontWeight: '600'
            }}>
              💡 <strong>Hint:</strong> Think about what this platform helps you find... 
              It's all about getting "your first job" followed by some numbers and a special character! 🤔✨
            </p>
          </div>
        )}

        {/* Amazing Features */}
        <div 
          className="features-grid"
          style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #0ea5e9',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e' }}>5000+</div>
            <div style={{ fontSize: '0.9rem', color: '#075985' }}>Teen Dream Jobs</div>
          </div>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #22c55e',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🤖</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>AI-Powered</div>
            <div style={{ fontSize: '0.9rem', color: '#166534' }}>CV & Interview Prep</div>
          </div>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #f59e0b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎥</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>Video Interview</div>
            <div style={{ fontSize: '0.9rem', color: '#a16207' }}>Practice</div>
          </div>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#fdf2f8',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #ec4899',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌟</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>World-Class</div>
            <div style={{ fontSize: '0.9rem', color: '#9d174d' }}>Job Support</div>
          </div>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #6b7280',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>Competitive</div>
            <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>Points System</div>
          </div>
          <div 
            className="feature-card"
            style={{
            backgroundColor: '#ede9fe',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #8b5cf6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d28d9' }}>UK's #1</div>
            <div style={{ fontSize: '0.9rem', color: '#5b21b6' }}>Teen Job Platform</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '50px',
          paddingTop: '30px',
          borderTop: '2px solid #e5e7eb'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: '0'
          }}>
            🌟 Get ready for the future of job hunting! 🌟
          </p>
        </div>
      </div>
      </div>
      
      {/* Community Form Modal */}
      {showCommunityModal && typeof window !== 'undefined' && createPortal(
        <div
          className="modal-overlay-fixed"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out',
            boxSizing: 'border-box'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCommunityModal(false);
              resetForm();
            }
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '40px 30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              animation: 'slideIn 0.3s ease-out',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowCommunityModal(false);
                resetForm();
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ×
            </button>

            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                textAlign: 'center',
                marginBottom: '10px',
                fontFamily: 'inherit'
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
              Help us build the perfect platform for you!
            </p>

            <form onSubmit={handleCommunitySubmit}>
              {/* Full Name */}
              <div 
            className="feature-card"
            style={{ marginBottom: '20px' }}>
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
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fde047';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>

              {/* Email */}
              <div 
            className="feature-card"
            style={{ marginBottom: '20px' }}>
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
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fde047';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>

              {/* Age */}
              <div 
            className="feature-card"
            style={{ marginBottom: '20px' }}>
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
                  type="text"
                  value={formData.age}
                  onChange={(e) => handleFormChange('age', e.target.value)}
                  placeholder="Enter your age"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fde047';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>

              {/* Location */}
              <div 
            className="feature-card"
            style={{ marginBottom: '20px' }}>
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
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  placeholder="Enter your location"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fde047';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>

              {/* How did you hear about us */}
              <div 
            className="feature-card"
            style={{ marginBottom: '30px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  How did you hear about Talentix? *
                </label>
                <select
                  value={formData.hearAbout}
                  onChange={(e) => handleFormChange('hearAbout', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#1f2937',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#fde047';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <option value="">Select an option</option>
                  <option value="Social Media">Social Media</option>
                  <option value="School">School</option>
                  <option value="Friend or Family">Friend or Family</option>
                  <option value="Word of Mouth">Word of Mouth</option>
                  <option value="Online Search">Online Search</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #fde047 0%, #facc15 100%)',
                  color: '#1f2937',
                  padding: '16px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(253, 224, 71, 0.4)',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(253, 224, 71, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(253, 224, 71, 0.4)';
                }}
              >
                🚀 Join Community 🚀
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Success Modal */}
      {showSuccessModal && typeof window !== 'undefined' && createPortal(
        <div
          className="modal-overlay-fixed"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out',
            boxSizing: 'border-box'
          }}
        >
          <div
            className="success-modal"
            style={{
              backgroundColor: 'white',
              borderRadius: '25px',
              padding: '50px 30px',
              maxWidth: '450px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '20px'
              }}
            >
              🎉
            </div>
            
            <h2
              style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '15px',
                fontFamily: 'inherit'
              }}
            >
              Welcome to Talentix 🎉
            </h2>
            
            <p
              style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '30px',
                lineHeight: '1.5'
              }}
            >
              🎉 You've successfully joined our newsletter! You'll receive updates about Talentix's launch and job opportunities. Click below to also join our WhatsApp community.
            </p>

            {/* WhatsApp Button */}
            <a
              href="https://chat.whatsapp.com/La1zsOBmy631JTQ7JBrm64?mode=ems_copy_h_t"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                color: 'white',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '15px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
                fontFamily: 'inherit',
                marginBottom: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4)';
              }}
            >
              💬 Join our WhatsApp Community
            </a>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#9ca3af',
                marginTop: '15px'
              }}
            >
              You'll be redirected to WhatsApp to join the group.
            </p>

            {/* Back to Home Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                display: 'block',
                width: '100%',
                background: 'transparent',
                color: '#6b7280',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: '500',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                marginTop: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fde047';
                e.currentTarget.style.backgroundColor = '#fef3c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Back to Home
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5) !important;
        }
        
        /* Header responsive styles */
        @media (max-width: 640px) {
          .top-header {
            padding: 10px 15px !important;
          }
          
          .top-header img {
            height: 30px !important;
          }
          
          .top-header-text {
            font-size: 1.4rem !important;
          }
        }
        
        /* Mobile responsive styles */
        @media (max-width: 640px) {
          .main-content {
            padding: 40px 25px !important;
            margin: 0 10px !important;
          }
          
          .community-button {
            padding: 14px 24px !important;
            font-size: 1rem !important;
          }
          
          .modal-content {
            padding: 30px 20px !important;
            margin: 0 10px !important;
          }
          
          .success-modal {
            padding: 40px 25px !important;
          }
          
          /* Features grid mobile optimization */
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
          }
          
          .feature-card {
            padding: 15px !important;
          }
          
          .feature-card div:first-child {
            font-size: 1.5rem !important;
          }
          
          .feature-card div:nth-child(2) {
            font-size: 1.2rem !important;
          }
          
          .feature-card div:last-child {
            font-size: 0.8rem !important;
          }
          
          /* Modal mobile fixes */
          .modal-overlay-fixed {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 999999 !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
          }
          
          .modal-content {
            max-height: 85vh !important;
            max-width: 90vw !important;
            overflow-y: auto !important;
            position: relative !important;
            margin: auto !important;
          }
          
          .success-modal {
            max-height: 85vh !important;
            max-width: 90vw !important;
            overflow-y: auto !important;
            position: relative !important;
            margin: auto !important;
          }
        }
      `}</style>

      {/* Hide global navigation on this page */}
      <style jsx global>{`
        header { display: none !important; }
        
        /* Make sure chat widget is not affected by other rules */
        .chatbot-wrapper, 
        .chatbot-wrapper * {
          display: initial !important;
          visibility: visible !important;
        }
        
        /* iPhone-compatible background and scrolling */
        html { 
          margin: 0 !important; 
          padding: 0 !important; 
          min-height: 100% !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%) !important;
        }
        
        body { 
          margin: 0 !important; 
          padding: 0 !important; 
          min-height: 100% !important;
          overflow-x: hidden !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%) !important;
          -webkit-overflow-scrolling: touch !important;
        }
        
        /* iPhone-specific scrolling fixes */
        @media (max-width: 767px) {
          html, body {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
            height: auto !important;
            min-height: 100vh !important;
          }
          
          /* Ensure header and logo are visible on iPhone */
          .top-header {
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            width: 100% !important;
          }
          
          
          /* Ensure main content doesn't get hidden */
          .main-content {
            padding-top: 20px !important;
          }
        }
        
        /* Force the root div to cover everything */
        #__next {
          min-height: 100vh !important;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%) !important;
        }
        
        /* Prevent any white space at the top */
        body::before {
          content: '';
          position: fixed;
          top: -100px;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          z-index: -1;
        }
        
        /* Global modal overlay fixes */
        .modal-overlay-fixed {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 999999 !important;
        }
        
        /* Ensure chat widget is always visible */
        button[aria-label="Open AI Chat Assistant"] {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          z-index: 9999999 !important;
          display: flex !important;
        }
        
        /* Ensure chat window is always visible */
        .chat-window-fade-in {
          position: fixed !important;
          z-index: 9999998 !important;
          display: flex !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        /* Mobile chat widget adjustments */
        @media (max-width: 767px) {
          button[aria-label="Open AI Chat Assistant"] {
            bottom: 20px !important;
            right: 20px !important;
            width: 56px !important;
            height: 56px !important;
            font-size: 24px !important;
          }
          
          /* Mobile chat window */
          .chat-window-fade-in {
            width: calc(100vw - 40px) !important;
            right: 20px !important;
            left: 20px !important;
            top: 80px !important;
            bottom: 80px !important;
            max-height: calc(100vh - 160px) !important;
          }
        }
      `}</style>
    </div>
  );
}
