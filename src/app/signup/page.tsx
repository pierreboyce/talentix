'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import dynamicImport from 'next/dynamic';

// Dynamically import SignUpModal to avoid SSR issues
const SignUpModalDynamic = dynamicImport(() => import('../../components/SignUpModal'), {
  ssr: false
});

export default function SignUpPage() {
  const [showModal, setShowModal] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wait for mount and auth to load before redirecting
  if (!isMounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (user && isMounted) {
      router.push('/dashboard');
    }
  }, [user, isMounted, router]);

  if (user) {
    return null;
  }

  const handleCloseModal = () => {
    setShowModal(false);
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Talentix</h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>
        
        <SignUpModalDynamic 
          isOpen={showModal} 
          onClose={handleCloseModal} 
        />
      </div>
    </div>
  );
} 
 
 
 
 
 
 
 