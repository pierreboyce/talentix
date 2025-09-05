'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import SignUpModal from '../../components/SignUpModal';

export default function SignUpPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Talentix</h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>
        
        <SignUpModal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
        />
      </div>
    </div>
  );
} 
 
 
 
 
 
 
 