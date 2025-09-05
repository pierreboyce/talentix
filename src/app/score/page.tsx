'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Score() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new Talentix Points page
    router.push('/talentix-points');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)'
    }}>
      <div style={{
        textAlign: 'center',
        color: '#1f2937'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          Redirecting to Talentix Points...
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.8 }}>
          Loading your achievements and progress
        </p>
      </div>
    </div>
  );
} 