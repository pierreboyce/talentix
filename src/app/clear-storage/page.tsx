'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearStoragePage() {
  const [isClearing, setIsClearing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();

  const clearAllStorage = () => {
    setIsClearing(true);
    
    // Clear all talentix-related localStorage items
    const keysToRemove = [
      'talentix_user',
      'talentix_session', 
      'talentix_signin_success',
      'signin_in_progress',
      'auth_token',
      'talentix_access',
      'token',
      'talentix_points',
      'talentix_quests'
    ];
    
    console.log('🧹 Clearing browser storage...');
    
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Removing localStorage item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    console.log('🗑️ Cleared sessionStorage');
    
    // Clear any remaining talentix items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('talentix')) {
        console.log(`🗑️ Removing remaining item: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    setTimeout(() => {
      setIsClearing(false);
      setIsComplete(true);
    }, 2000);
  };

  const handleRedirect = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #f59e0b 100%)',
      padding: '20px',
      fontFamily: "'Fredoka', sans-serif"
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🧹 Clear Browser Storage
        </h1>
        
        {!isComplete ? (
          <>
            <p style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              marginBottom: '30px',
              lineHeight: '1.5'
            }}>
              If you're experiencing continuous page refreshing or signin issues, this tool will clear all stored data and give you a fresh start.
            </p>

            <button
              onClick={clearAllStorage}
              disabled={isClearing}
              style={{
                width: '100%',
                background: isClearing 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                  : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: isClearing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                fontFamily: 'inherit'
              }}
            >
              {isClearing ? '🧹 Clearing Storage...' : '🗑️ Clear All Storage'}
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
            <h2 style={{
              fontSize: '1.8rem',
              color: '#10b981',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              Storage Cleared Successfully!
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              marginBottom: '30px',
              lineHeight: '1.5'
            }}>
              All browser data has been cleared. You can now sign in fresh without any issues.
            </p>
            
            <button
              onClick={handleRedirect}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                fontFamily: 'inherit'
              }}
            >
              🏠 Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
}












