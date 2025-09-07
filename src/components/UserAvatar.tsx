'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; // Use the correct AuthContext

export default function UserAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth(); // Get both user and signOut function

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      console.log('UserAvatar: Starting sign out...');
      setIsOpen(false); // Close the dropdown
      
      // Clear localStorage immediately
      localStorage.removeItem('talentix_session');
      localStorage.removeItem('talentix_user');
      console.log('UserAvatar: localStorage cleared');
      
      // Force redirect immediately
      console.log('UserAvatar: Redirecting...');
      window.location.href = '/';
      
    } catch (error) {
      console.error('UserAvatar sign out error:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          {/* Placeholder for user image, you can replace with a real one */}
          <Image
            src="/black-boy-smiling.jpg" // A placeholder image
            alt="User Avatar"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
        <span className="font-medium text-gray-700">Me</span>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
          <Link
            href="/our-story"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Our Story
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 