'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You cancelled the authentication process.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An unexpected error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-slate-700 rounded-3xl p-8 max-w-md w-full text-center">
        <div className="text-red-400 text-6xl mb-6">⚠️</div>
        
        <h1 className="text-white text-3xl font-bold mb-4">
          Authentication Error
        </h1>
        
        <p className="text-gray-300 mb-8">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-transparent border border-gray-500 text-gray-400 py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg">
            <p className="text-gray-400 text-sm">
              Error code: <span className="font-mono text-red-400">{error}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 