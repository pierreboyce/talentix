'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import SignInModal from '../../components/SignInModal';

export default function SignInPage() {
  const [showModal, setShowModal] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // If user is already signed in, redirect to dashboard
  if (user) {
    router.push('/dashboard');
    return null;
  }

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In to Talentix</h1>
        <p className="text-gray-600 mb-8">Access your account to continue</p>
        
        <SignInModal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
        />
      </div>
    </div>
  );
} 
 
 
 
 
 
 
 