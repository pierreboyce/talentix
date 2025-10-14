'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import NavigationMobile from './NavigationMobile';

export default function NavigationWrapper() {
  const pathname = usePathname();
  
  // Hide navigation on mobile coming soon page
  if (pathname === '/mobile-coming-soon') {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation - shown only on desktop */}
      <div className="desktop-nav">
        <Navigation />
      </div>
      {/* Mobile Navigation - shown only on mobile */}
      <div className="mobile-nav">
        <NavigationMobile />
      </div>
    </>
  );
}

