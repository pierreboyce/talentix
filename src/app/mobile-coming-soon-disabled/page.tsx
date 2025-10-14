"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export default function MobileComingSoon() {
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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const router = useRouter();

  const correctPassword = 'yourfirstjob129!';

  // Countdown timer logic - same as desktop version
  useEffect(() => {
    const targetDate = new Date('2025-10-02T20:00:00+01:00'); // 8pm UK time tomorrow (BST)
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance < 0) {
        setIsCountdownComplete(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        
        // 📱 Just remove the countdown timer on mobile (don't redirect since mobile isn't ready)
        console.log('🎉 Mobile countdown complete! Removing countdown timer...');
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [router]);

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
        
        
        // Reset form and show success
        resetForm();
        setShowCommunityModal(false);
        setShowSuccessModal(true);
      } else {
        
        
      }
    } catch (error) {
      
      
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
    if (typeof window === 'undefined') return;
    
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
    if (typeof window === 'undefined') return;
    
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      // Set session cookie and redirect to main homepage
      if (typeof document !== 'undefined') {
        document.cookie = `talentix_mobile_access=authenticated; path=/; max-age=86400`; // 24 hours
      }
      console.log('🎉 Mobile access granted! Redirecting to homepage...');
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
            fontSize: '1.6rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Mobile Not Ready - Use Desktop! 🖥️
        </div>
      </div>

      {/* Countdown Timer - Mobile Version */}
      {!isCountdownComplete ? (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          padding: '20px',
          margin: '15px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '2px solid rgba(253, 224, 71, 0.3)',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '15px',
            fontFamily: "'Fredoka', sans-serif"
          }}>
            🎉 Launch Countdown! 🎉
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              borderRadius: '15px',
              padding: '10px 5px',
              border: '2px solid #fde047'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>📅</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d97706',
                fontFamily: "'Fredoka', monospace"
              }}>
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Days
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              borderRadius: '15px',
              padding: '10px 5px',
              border: '2px solid #fde047'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>⏰</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d97706',
                fontFamily: "'Fredoka', monospace"
              }}>
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Hours
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              borderRadius: '15px',
              padding: '10px 5px',
              border: '2px solid #fde047'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>⏱️</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d97706',
                fontFamily: "'Fredoka', monospace"
              }}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Minutes
              </div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(253, 224, 71, 0.2)',
              borderRadius: '15px',
              padding: '10px 5px',
              border: '2px solid #fde047'
            }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>⚡</div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d97706',
                fontFamily: "'Fredoka', monospace"
              }}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#92400e',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Seconds
              </div>
            </div>
          </div>
          
          <p style={{
            fontSize: '1rem',
            color: '#d97706',
            fontWeight: '600',
            margin: '0'
          }}>
            Until Talentix desktop launches! 🚀
          </p>
        </div>
      ) : null}

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
        }}>📱</div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          fontSize: '3rem',
          opacity: 0.15,
          animation: 'float 4s ease-in-out infinite 1s'
        }}>⚡</div>
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
        }}>📲</div>
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
              mobile app coming soon...
          </div>
        </div>

        {/* Coming Soon Message */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 20px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            📱 Mobile Version Coming Later! 📱
          </h2>
          <p style={{
            fontSize: '1.3rem',
            color: '#dc2626',
            fontWeight: '600',
            lineHeight: '1.6',
            margin: '0 0 20px 0'
          }}>
            🚧 The mobile version isn't ready yet! 🚧
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#4b5563',
            lineHeight: '1.6',
            margin: '0 0 30px 0'
          }}>
            We're still optimizing the website for mobile devices. For the best experience and to guarantee your first job, please visit <strong>'talentix.co.uk'</strong> on a desktop or laptop computer (screen size 768x1024 or larger).
          </p>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <p style={{
              color: '#92400e',
              fontSize: '1rem',
              margin: '0',
              fontWeight: '600'
            }}>
              💡 <strong>Tip:</strong> Use a desktop, laptop, or large tablet to access the full Talentix experience right now!
            </p>
          </div>
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
            📱 Launch Mobile Talentix! ✨
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

        {/* Amazing Mobile Features */}
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e' }}>Touch</div>
            <div style={{ fontSize: '0.9rem', color: '#075985' }}>Optimized UI</div>
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>Lightning</div>
            <div style={{ fontSize: '0.9rem', color: '#166534' }}>Fast Performance</div>
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>Smart</div>
            <div style={{ fontSize: '0.9rem', color: '#a16207' }}>Job Matching</div>
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📲</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#be185d' }}>Push</div>
            <div style={{ fontSize: '0.9rem', color: '#9d174d' }}>Notifications</div>
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#374151' }}>Offline</div>
            <div style={{ fontSize: '0.9rem', color: '#4b5563' }}>Sync Support</div>
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
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌟</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6d28d9' }}>Mobile-First</div>
            <div style={{ fontSize: '0.9rem', color: '#5b21b6' }}>Design</div>
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
            📱 Get ready for job hunting in your pocket! Coming to mobile soon! 🚀
          </p>
        </div>
      </div>
      </div>
      
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
      `}</style>

      {/* Hide global navigation on this page */}
      <style jsx global>{`
        header { display: none !important; }
        
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
      `}</style>
    </div>
  );
}
