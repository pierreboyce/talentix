'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '../contexts/AuthContext';

interface SessionWrapperProps {
  children: ReactNode;
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
} 