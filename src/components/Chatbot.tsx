'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  userName: string;
}

export default function Chatbot({ userName }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hey there! 👋 I'm your AI career assistant! I'm here to help you with job applications, CV tips, interview prep, and anything career-related. What can I help you with today?`,
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Listen for external open chat events
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openAIChat', handleOpenChat);
    return () => {
      window.removeEventListener('openAIChat', handleOpenChat);
    };
  }, [setIsOpen]);

  const promptQuestions = [
    "💼 How do I write a good CV?",
    "👔 What should I wear to an interview?", 
    "🆕 I have no experience, what should I do?",
    "⭐ What skills should I highlight?",
    "🎯 How do I prepare for an interview?",
    "😰 What if I'm nervous about applying?"
  ];

  const generateAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userName: userName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      
      
      // Enhanced fallback responses with emojis
      const responses = [
        "Great question! 📝 For CV writing, focus on highlighting your skills, any part-time work, volunteering, or school projects. Even without formal experience, you can showcase your potential and enthusiasm! ✨",
        "Perfect question! 👔 For interviews, dress slightly more formal than the workplace dress code. Business casual is usually safe - clean, well-fitted clothes show you're serious about the opportunity! 💼",
        "Don't worry at all! 🌟 Everyone starts somewhere. Focus on transferable skills from school, sports, volunteering, or personal projects. Employers often value enthusiasm and willingness to learn over experience! 🚀",
        "Excellent! ⭐ Highlight both technical skills and soft skills like communication, teamwork, problem-solving, and time management. Think about examples from school projects or activities that demonstrate these! 💪",
        "Smart thinking! 🎯 Research the company, practice common questions, prepare examples using the STAR method (Situation, Task, Action, Result), and have thoughtful questions ready to ask them! 📚",
        "Totally normal! 😊 Practice helps - do mock interviews with friends or family. Remember, the interviewer wants you to succeed. Take deep breaths and focus on your strengths! You've got this! 💪✨"
      ];

      const randomIndex = typeof window !== 'undefined' ? Math.floor(Math.random() * responses.length) : 0;
      return responses[randomIndex] + "\n\nWould you like me to dive deeper into any specific aspect? 🤔";
    }
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponseText = await generateAIResponse(currentInput);
      
      const aiResponse: Message = {
        id: messages.length + 2,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (question: string) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Floating Chat Icon - Modern & Fun */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          position: 'fixed', 
          bottom: '24px',
          right: '24px',
          zIndex: 999999,
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 8px 24px rgba(251, 191, 36, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(251, 191, 36, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(251, 191, 36, 0.4)';
        }}
        aria-label="Open AI Chat Assistant"
      >
        🤖
      </button>

      {/* Modern Chat Window */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          className="chat-window-fade-in"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            top: '20px',
            zIndex: 9999998,
            width: '400px',
            maxHeight: 'calc(100vh - 120px)',
            height: 'auto',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '3px solid #fbbf24',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            opacity: '1',
            visibility: 'visible'
          }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#000',
                  fontFamily: 'Fredoka'
                }}>
                  AI Career Assistant
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  color: 'rgba(0, 0, 0, 0.7)' 
                }}>
                  Always here to help! ✨
                </p>
            </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#000',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f8fafc'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: message.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  backgroundColor: message.isUser ? '#fbbf24' : '#ffffff',
                  color: message.isUser ? '#000' : '#374151',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: message.isUser ? 'none' : '1px solid #e5e7eb'
                }}>
                  {message.text}
                  </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s ease-in-out infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s ease-in-out 0.2s infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    animation: 'pulse 1.4s ease-in-out 0.4s infinite'
                  }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: '#ffffff'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0 0 12px 0',
                fontWeight: '500'
              }}>
                💡 Quick questions to get started:
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {promptQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(question)}
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #fbbf24',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fbbf24';
                      e.currentTarget.style.color = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef3c7';
                      e.currentTarget.style.color = '#92400e';
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#ffffff'
          }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
              <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                placeholder="Ask me anything about careers! 💼"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                  maxHeight: '100px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fbbf24';
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                style={{
                  width: '44px',
                  height: '44px',
                  background: inputMessage.trim() ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#e5e7eb',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: inputMessage.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (inputMessage.trim()) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isTyping ? '⏳' : '🚀'}
                </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .chat-window-fade-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
} 