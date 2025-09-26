'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Chatbot from '../../components/Chatbot';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const userName = getUserName();

  const generateAIResponse = (userMessage: string) => {
    const responses = {
      'hello': `Hi ${userName || 'there'}! How can I help you with your job search today?`,
      'cv': "For a great CV, focus on: 1) Clean, simple layout 2) Include education and any experience 3) List relevant skills 4) Add volunteer work or activities 5) Keep it to 1-2 pages maximum. Would you like me to review your CV?",
      'interview': "Interview tips: 1) Research the company 2) Practice common questions 3) Dress appropriately 4) Arrive early 5) Be confident and honest 6) Ask questions back 7) Follow up with a thank you email!",
      'experience': "Don't worry about lack of experience! Focus on: 1) Transferable skills from school/clubs 2) Volunteer work 3) Part-time jobs like babysitting or tutoring 4) Projects you've worked on 5) Show enthusiasm and willingness to learn!",
      'skills': "Great skills to highlight: 1) Computer skills (Microsoft Office, social media) 2) Communication skills 3) Teamwork 4) Problem-solving 5) Time management 6) Customer service 7) Any languages you speak!",
      'salary': "For your first job, focus on gaining experience rather than salary. Typical teen jobs pay minimum wage or slightly above. The experience and skills you gain are more valuable!",
      'application': "When applying: 1) Follow instructions carefully 2) Customize your CV for each job 3) Write a brief cover letter 4) Proofread everything 5) Apply to multiple places 6) Follow up after applying!",
      'nervous': "It's normal to be nervous! Remember: 1) Everyone starts somewhere 2) Employers expect you to be learning 3) Show enthusiasm and willingness to learn 4) Be honest about your experience 5) Practice makes perfect!",
      'help': "I can help with: 1) CV advice 2) Interview tips 3) Job search strategies 4) Skills development 5) Application guidance 6) Career planning. What would you like to know more about?"
    };

    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }

    return "That's a great question! For job hunting as a teenager, I'd recommend focusing on gaining experience, building skills, and showing enthusiasm. What specific aspect would you like to know more about?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Add points for using the chatbot
      const currentScore = parseInt(localStorage.getItem('talentix_score') || '0');
      const newScore = currentScore + 5;
      localStorage.setItem('talentix_score', newScore.toString());
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Career Coach</h1>
          <p className="text-lg text-gray-600">Ask me anything about getting your first job!</p>
        </div>

        {/* Chat Area */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 minimalist-card h-[60vh] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-lg p-3 rounded-lg ${message.isUser ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            )}
          </div>
          {/* Input */}
          <div className="mt-4 flex gap-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me about writing a CV..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary-yellow"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 