'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedPageProps {
  children: React.ReactNode;
}

export default function ProtectedPage({ children }: ProtectedPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If no user after loading is complete, redirect to homepage
    if (!user) {
      console.log('🔒 Protected page accessed without authentication, redirecting to homepage');
      router.replace('/');
    }
  }, [user, loading, router]);

  // Show nothing while checking auth or if not authenticated
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#374151',
          fontFamily: 'Fredoka, sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ fontSize: '1.2rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated, show the page
  return <>{children}</>;
}

