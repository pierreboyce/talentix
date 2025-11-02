'use client';

import { useEffect, useState } from 'react';

export default function RootPage() {
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Immediate redirect on mount
    if (!hasRedirected) {
      setHasRedirected(true);
      window.location.href = '/home';
    }
  }, [hasRedirected]);

  // Fallback: detect blank gradient screen and refresh
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndRefresh = () => {
      // Check if we're stuck on root path with blank gradient
      if (window.location.pathname === '/') {
        // Check if only navigation is visible (blank gradient)
        const hasMainContent = document.querySelector('section') !== null || 
                               document.querySelector('h1') !== null ||
                               (document.body.textContent?.trim().length ?? 0) > 100;
        
        const nav = document.querySelector('nav, header');
        const hasOnlyNav = nav !== null && document.body.children.length <= 2;
        
        // If we see blank gradient (only nav, no content), redirect
        if (!hasMainContent && hasOnlyNav) {
          console.log('🔄 Blank gradient detected on /, redirecting to /home');
          window.location.href = '/home';
        }
      }
    };

    // Check after a short delay
    const timer = setTimeout(checkAndRefresh, 1500);
    
    // Also check on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkAndRefresh();
      }
    });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', checkAndRefresh);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)'
    }}>
      <div style={{ textAlign: 'center', color: '#374151' }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '16px',
          animation: 'spin 1s linear infinite'
        }}>⏳</div>
        <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Redirecting to homepage...</p>
      </div>
    </div>
  );
}