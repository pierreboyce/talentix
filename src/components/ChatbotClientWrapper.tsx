'use client';
import dynamic from 'next/dynamic';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });

export default function ChatbotClientWrapper() {
  const { user } = useAuth();
  
  // Get user's first name only (not full name for privacy)
  const getUserName = () => {
    if (!user) return '';
    
    // If user has a name, extract first name
    if (user.name) {
      return user.name.split(' ')[0];
    }
    
    // Fallback to email username if no name
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return '';
  };

  return (
    <div className="chatbot-wrapper">
      <Chatbot userName={getUserName()} />
    </div>
  );
} 