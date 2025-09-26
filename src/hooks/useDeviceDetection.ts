'use client';

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  userAgent: string;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    userAgent: '',
  });
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const detectDevice = () => {
      if (typeof window === 'undefined') return;
      
      const userAgent = navigator.userAgent;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Enhanced mobile detection with multiple criteria
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
      const isMobileUserAgent = mobileRegex.test(userAgent);
      
      // More specific mobile screen detection
      const isMobileScreen = screenWidth <= 768;
      
      // Touch capability detection
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // iPhone/iOS specific detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // Android specific detection
      const isAndroid = /Android/.test(userAgent);
      
      // Combine multiple signals for more reliable detection
      const isMobile = isMobileUserAgent || (isMobileScreen && hasTouchSupport) || isIOS || isAndroid;
      
      // Tablet detection (larger mobile devices with touch)
      const isTablet = (screenWidth > 768 && screenWidth <= 1024 && (isMobileUserAgent || hasTouchSupport)) || 
                      (isIOS && screenWidth > 768);
      
      // Desktop is everything else
      const isDesktop = !isMobile && !isTablet;

      const newDeviceInfo = {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        userAgent,
      };

      setDeviceInfo(newDeviceInfo);
      
      // Mark as hydrated after first detection
      if (!isHydrated) {
        setIsHydrated(true);
      }
    };

    // Initial detection with a small delay to ensure proper hydration
    const timeoutId = setTimeout(detectDevice, 50);

    // Listen for resize and orientation change events
    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      setTimeout(detectDevice, 100);
    };

    const handleOrientationChange = () => {
      // Handle mobile orientation changes
      setTimeout(detectDevice, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isHydrated]);

  // During SSR and initial hydration, use conservative defaults
  if (!isClient || !isHydrated) {
    // Try to detect from user agent if available during client-side hydration
    if (typeof window !== 'undefined' && navigator?.userAgent) {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
      const isMobileUserAgent = mobileRegex.test(userAgent);
      
      // For known mobile user agents, return mobile immediately
      if (isMobileUserAgent) {
        return {
          isMobile: true,
          isTablet: false,
          isDesktop: false,
          screenWidth: 375, // Default mobile width
          userAgent,
        };
      }
    }
    
    // Default to desktop during SSR to prevent hydration mismatch
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      screenWidth: 1920,
      userAgent: '',
    };
  }

  return deviceInfo;
}

// Server-side device detection for initial render
export function detectDeviceFromUserAgent(userAgent: string): Partial<DeviceInfo> {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  
  return {
    isMobile: isMobileUserAgent,
    isTablet: false, // Can't detect screen size on server
    isDesktop: !isMobileUserAgent,
    userAgent,
  };
}
