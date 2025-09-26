'use client';

import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface MobileResponsiveWrapperProps {
  children: React.ReactNode;
  mobileClassName?: string;
  desktopClassName?: string;
}

export default function MobileResponsiveWrapper({ 
  children, 
  mobileClassName = '', 
  desktopClassName = '' 
}: MobileResponsiveWrapperProps) {
  const { isMobile } = useDeviceDetection();

  return (
    <div className={isMobile ? mobileClassName : desktopClassName}>
      {children}
    </div>
  );
}

// Utility hook for mobile-specific styling
export function useMobileStyles() {
  const { isMobile } = useDeviceDetection();
  
  const getMobileStyle = (mobileStyle: React.CSSProperties, desktopStyle: React.CSSProperties = {}) => {
    return isMobile ? mobileStyle : desktopStyle;
  };

  const getMobileClassName = (mobileClass: string, desktopClass: string = '') => {
    return isMobile ? mobileClass : desktopClass;
  };

  return { isMobile, getMobileStyle, getMobileClassName };
}



