"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ComingSoon() {
  const [password, setPassword] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const correctPassword = 'yourfirstjob129!';

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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 8s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden'
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

      <div style={{
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
            color: '#1f2937',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            talentix
          </h1>
          <div style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            🚀 Your Career Journey Starts Here! 🌟
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
            🎉 Something Amazing is Coming! 🎉
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#4b5563',
            lineHeight: '1.6',
            margin: '0 0 30px 0'
          }}>
            We're putting the final touches on your new favorite job platform! 
            Enter the secret password to get an exclusive sneak peek! 👀✨
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '40px' }}>
          <div style={{
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
          >
            🚀 Launch Into Talentix! 🌟
          </button>
        </form>

        {/* Hint System */}
        {showHint && (
          <div style={{
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

        {/* Fun Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #0ea5e9'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0c4a6e' }}>1000+</div>
            <div style={{ fontSize: '0.9rem', color: '#075985' }}>Dream Jobs</div>
          </div>
          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d' }}>AI-Powered</div>
            <div style={{ fontSize: '0.9rem', color: '#166534' }}>CV Reviews</div>
          </div>
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #f59e0b'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🚀</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>24/7</div>
            <div style={{ fontSize: '0.9rem', color: '#a16207' }}>Career Support</div>
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
      `}</style>
    </div>
  );
}
