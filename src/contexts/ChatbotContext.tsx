'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ChatbotContextType {
  openChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | null>(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [openChatTrigger, setOpenChatTrigger] = useState(0);

  const openChat = () => {
    // Trigger a custom event to open the chat
    window.dispatchEvent(new CustomEvent('openAIChat'));
  };

  return (
    <ChatbotContext.Provider value={{ openChat }}>
      {children}
    </ChatbotContext.Provider>
  );
};

