'use client';

import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
  screenWidth: number;
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    userAgent: '',
    screenWidth: 1024
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const screenWidth = window.innerWidth;

      // Mobile device detection patterns
      const mobilePatterns = [
        /android/i,
        /webos/i,
        /iphone/i,
        /ipod/i,
        /blackberry/i,
        /windows phone/i,
        /mobile/i
      ];

      // Tablet detection patterns
      const tabletPatterns = [
        /ipad/i,
        /android(?!.*mobile)/i,
        /tablet/i
      ];

      const isMobileUserAgent = mobilePatterns.some(pattern => pattern.test(userAgent));
      const isTabletUserAgent = tabletPatterns.some(pattern => pattern.test(userAgent));

      // Screen size based detection (fallback)
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      const isDesktopScreen = screenWidth >= 1024;

      // Combine user agent and screen size detection
      const isMobile = isMobileUserAgent || (isMobileScreen && !isTabletUserAgent);
      const isTablet = isTabletUserAgent || (isTabletScreen && !isMobileUserAgent);
      const isDesktop = !isMobile && !isTablet;

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        userAgent,
        screenWidth
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    const handleResize = () => {
      detectDevice();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return detection;
}

