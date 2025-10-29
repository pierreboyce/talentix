'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardDebug() {
  const { user, loading } = useAuth();
  const [mountCount, setMountCount] = useState(0);

  useEffect(() => {
    setMountCount(prev => prev + 1);
    console.log('🔍 MINIMAL DASHBOARD - Mount #', mountCount + 1);
    console.log('🔍 User:', user?.email || 'No user');
    console.log('🔍 Loading:', loading);
    
    // Track if this component is unmounting/remounting
    return () => {
      console.log('🚨 MINIMAL DASHBOARD - UNMOUNTING after mount #', mountCount + 1);
    };
  }, []);

  // Track any re-renders
  useEffect(() => {
    console.log('🔄 MINIMAL DASHBOARD - Re-render detected');
  });

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>🔍 Minimal Dashboard Debug</h1>
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Mount Count:</strong> {mountCount}</p>
        <p><strong>User:</strong> {user?.email || 'No user'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleTimeString()}</p>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Watch the console for mount/unmount messages</li>
          <li>Check if the mount count keeps increasing</li>
          <li>Look for continuous re-render messages</li>
          <li>Note the timestamp to see if page is refreshing</li>
        </ol>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2>What to Look For:</h2>
        <ul>
          <li><strong>Page Refresh:</strong> Timestamp resets, mount count resets to 1</li>
          <li><strong>Component Remount:</strong> Mount count increases, but timestamp stays</li>
          <li><strong>Re-render:</strong> Re-render messages without mount count change</li>
        </ul>
      </div>
    </div>
  );
}










