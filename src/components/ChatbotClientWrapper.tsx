'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Chatbot = dynamic(() => import('./Chatbot'), { ssr: false });

export default function ChatbotClientWrapper() {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    setUserName(localStorage.getItem('talentix_user') || '');
  }, []);

  return <Chatbot userName={userName} />;
} 