'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface MobileRedirectProps {
  enabled?: boolean;
  excludePaths?: string[];
}

export default function MobileRedirect({ 
  enabled = false, // DISABLED FOR MOBILE DEVELOPMENT
  excludePaths = ['/terms', '/privacy'] 
}: MobileRedirectProps) {
  const { isMobile } = useMobileDetection();
  const router = useRouter();

  useEffect(() => {
    // MOBILE REDIRECT DISABLED FOR DEVELOPMENT
    console.log('🚫 MobileRedirect: DISABLED for mobile development');
    return;
    
    if (!enabled) return;

    const currentPath = window.location.pathname;
    
    // Don't redirect if we're already on an excluded path
    if (excludePaths.some(path => currentPath.startsWith(path))) {
      return;
    }

    // Don't redirect if user agent contains desktop indicators
    const userAgent = navigator.userAgent.toLowerCase();
    const desktopIndicators = ['windows nt', 'macintosh', 'linux x86'];
    const isDesktopOS = desktopIndicators.some(indicator => userAgent.includes(indicator));
    
    // Only redirect if it's truly a mobile device (not just a small desktop window)
    if (isMobile && !isDesktopOS) {
      // Add a small delay to prevent flash
      const timer = setTimeout(() => {
        router.replace('/home');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isMobile, enabled, excludePaths, router]);

  // This component doesn't render anything
  return null;
}

