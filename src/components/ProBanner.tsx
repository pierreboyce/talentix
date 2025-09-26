'use client';

import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface ProBannerProps {
  showBanner?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProBanner({ 
  showBanner = true, 
  className = '',
  style = {} 
}: ProBannerProps) {
  const { subscription } = useSubscription();

  // Only show banner for free tier users
  if (!showBanner || subscription.tier !== 'free') {
    return null;
  }

  return (
    <div 
      className={`pro-banner responsive-container ${className}`}
      style={{
        position: 'relative',
        zIndex: 10,
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 0.5rem',
        ...style
      }}
    >
      <div
        className="pro-banner-content"
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: '700',
          color: '#1f2937',
          boxShadow: '0 4px 12px rgba(254, 243, 199, 0.6), 0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1.5px solid rgba(255, 255, 255, 0.8)',
          whiteSpace: 'nowrap',
          fontFamily: 'Fredoka, sans-serif',
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'default',
          transform: 'scale(1)',
          maxWidth: '95vw',
          textAlign: 'center',
          minHeight: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '44px',
        }}
      >
        <span style={{ 
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%'
        }}>
          Available with Talentix Pro ✨
        </span>
        
        {/* Tooltip arrow */}
        <div 
          className="pro-banner-arrow"
          style={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #fde047',
            marginTop: '0px'
          }}
        />
      </div>
    </div>
  );
}
