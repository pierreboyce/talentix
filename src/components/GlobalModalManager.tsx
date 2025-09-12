'use client';

import { useState, useEffect } from 'react';
import SignOutConfirmModal from './SignOutConfirmModal';

export default function GlobalModalManager() {
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    // Listen for global sign-out modal events
    const handleShowSignOut = () => setShowSignOutModal(true);
    const handleHideSignOut = () => setShowSignOutModal(false);

    window.addEventListener('talentix-show-signout-modal', handleShowSignOut);
    window.addEventListener('talentix-hide-signout-modal', handleHideSignOut);

    return () => {
      window.removeEventListener('talentix-show-signout-modal', handleShowSignOut);
      window.removeEventListener('talentix-hide-signout-modal', handleHideSignOut);
    };
  }, []);

  return (
    <SignOutConfirmModal 
      isOpen={showSignOutModal} 
      onClose={() => setShowSignOutModal(false)} 
    />
  );
}
