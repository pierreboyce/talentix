'use client';

import { usePoints } from '../contexts/PointsContext';

export default function PointsNotification() {
  const { showPointsNotification, pointsNotification, clearNotification } = usePoints();

  if (!showPointsNotification || !pointsNotification) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        animation: 'slideInRight 0.3s ease-out',
        border: '2px solid #059669'
      }}
      onClick={clearNotification}
    >
      <div
        style={{
          backgroundColor: '#059669',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        +{pointsNotification.amount}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>
          Points Earned!
        </div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          {pointsNotification.reason}
        </div>
      </div>
      <div style={{ fontSize: '18px' }}>
        🎉
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

