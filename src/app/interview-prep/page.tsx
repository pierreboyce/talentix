'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, Star, Mic, MicOff, Send, Sparkles } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import TailorInterviewModal from '../../components/TailorInterviewModal';
import TailoringLoadingModal from '../../components/TailoringLoadingModal';
import AuthGuard from '../../components/AuthGuard';

// Question database
const questionDatabase = {
  introductory: [
    'Tell me about yourself.',
    'Walk me through your resume.',
    'What are your greatest strengths?',
    'What are your biggest weaknesses?',
    'Where do you see yourself in 5 years?',
    'Why are you looking for a new job?',
    'What motivates you?',
    'Describe your ideal work environment.',
    'What are your salary expectations?',
    'Do you have any questions for us?'
  ],
  competency: [
    'Tell me about a time when you had to work under pressure.',
    'Give me an example of when you showed leadership.',
    'Describe a situation where you had to solve a difficult problem.',
    'Tell me about a time you failed and how you handled it.',
    'Give an example of when you had to work with a difficult colleague.',
    'Describe a time when you had to learn something new quickly.',
    'Tell me about a project you\'re particularly proud of.',
    'Give me an example of when you had to persuade someone.',
    'Describe a time when you had to handle multiple priorities.',
    'Tell me about a time when you received criticism.'
  ],
  research: [
    'Why do you want to work for this company?',
    'What do you know about our products/services?',
    'How would you improve our company?',
    'Who are our main competitors?',
    'What recent news about our company have you heard?',
    'How does this role fit into your career goals?',
    'What attracts you to this industry?',
    'How would you contribute to our company culture?',
    'What challenges do you think our industry faces?',
    'Why should we hire you over other candidates?'
  ],
  yourQuestions: [
    'Do you have any questions for us?'
  ]
};

const categories = [
  {
    id: 'introductory',
    name: 'Introductory',
    description: 'General questions about yourself and background',
    icon: '👋',
    color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  {
    id: 'competency',
    name: 'Competency',
    description: 'Behavioral questions about specific situations',
    icon: '💪',
    color: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Questions about the company and role',
    icon: '🔍',
    color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
  },
  {
    id: 'yourQuestions',
    name: 'Your Questions',
    description: 'Questions you should ask the interviewer',
    icon: '❓',
    color: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
  }
];

interface AIEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface ProgressData {
  [key: string]: {
    questionsAnswered: number;
    totalQuestions: number;
    averageScore: number;
    lastPracticed: Date | null;
  };
}

interface FeedbackHistory {
  id: string;
  category: string;
  question: string;
  answer: string;
  evaluation: AIEvaluation;
  timestamp: Date;
}

export default function InterviewPrepPage() {
  const { addPoints } = usePoints(); // Use shared points context
  const { updateQuestProgress } = useQuests(); // Use quest system
  const { isMobile, isTablet } = useDeviceDetection(); // Device detection
  const [currentView, setCurrentView] = useState<'categories' | 'flashcards' | 'progress' | 'feedback'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressData, setProgressData] = useState<ProgressData>({});
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistory[]>([]);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringDetails, setTailoringDetails] = useState({ companyName: '', jobRole: '' });

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQuestions(questionDatabase[categoryId as keyof typeof questionDatabase]);
    setCurrentQuestionIndex(0);
    setIsShuffled(false);
    setUserAnswer('');
    setEvaluation(null);
    setCurrentView('flashcards');
  };

  const handleTailorInterview = async (companyName: string, jobRole: string) => {
    console.log('🎯 Tailoring interview for:', { companyName, jobRole });
    setShowTailorModal(false);
    
    // Show loading modal
    setTailoringDetails({ companyName, jobRole });
    setIsTailoring(true);
    
    try {
      const response = await fetch('/api/interview/tailor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          jobRole,
          questionCount: 10
        }),
      });

      const data = await response.json();

      if (data.success && data.questions && data.questions.length > 0) {
        // Create a new custom category with the tailored questions
        const tailoredQuestions = data.questions.map((q: any) => q.question);
        
        // Set up a special tailored category
        setSelectedCategory('tailored');
        setQuestions(tailoredQuestions);
        setCurrentQuestionIndex(0);
        setIsShuffled(false);
        setUserAnswer('');
        setEvaluation(null);
        setCurrentView('flashcards');
        
        // Hide loading modal
        setIsTailoring(false);
        
        // Show success message
        const successMsg = `✅ Generated ${data.questions.length} tailored questions!\n${jobRole ? `For: ${jobRole}\n` : ''}${companyName ? `At: ${companyName}` : ''}`;
        setTimeout(() => alert(successMsg), 100);
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error: any) {
      console.error('Error tailoring interview:', error);
      setIsTailoring(false);
      alert(`❌ Failed to generate tailored questions.\n\n${error.message || 'Please try again.'}`);
    }
  };

  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setIsShuffled(true);
    setUserAnswer('');
    setEvaluation(null);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setIsEvaluating(true);
    
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: userAnswer,
          category: selectedCategory
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEvaluation(result);
        
        // Award points based on evaluation
        if (result.points) {
          addPoints(result.points, `Interview answer scored ${result.score}/5`);
        }
        
        // Update quest progress
        updateQuestProgress('interview_practice', 1);
        updateQuestProgress('interview_master', 1);
        updateQuestProgress('interview_veteran', 1);
        
        // Check for perfect score quest
        if (result.score === 5) {
          updateQuestProgress('perfect_score', 1);
          updateQuestProgress('first_perfect_score', 1);
        }
        
        // Save to feedback history
        const newFeedback: FeedbackHistory = {
          id: Date.now().toString(),
          category: selectedCategory,
          question: questions[currentQuestionIndex],
          answer: userAnswer,
          evaluation: result,
          timestamp: new Date()
        };
        setFeedbackHistory(prev => [newFeedback, ...prev]);
        
        // Update progress data
        setProgressData(prev => {
          const categoryData = prev[selectedCategory] || {
            questionsAnswered: 0,
            totalQuestions: questionDatabase[selectedCategory as keyof typeof questionDatabase].length,
            averageScore: 0,
            lastPracticed: null
          };
          
          const newQuestionsAnswered = categoryData.questionsAnswered + 1;
          const newAverageScore = ((categoryData.averageScore * categoryData.questionsAnswered) + result.score) / newQuestionsAnswered;
          
          return {
            ...prev,
            [selectedCategory]: {
              ...categoryData,
              questionsAnswered: newQuestionsAnswered,
              averageScore: newAverageScore,
              lastPracticed: new Date()
            }
          };
        });
      } else {
        const fallbackResult = {
          score: 3,
          feedback: "Your answer shows good understanding. Consider adding more specific examples and structuring your response for maximum impact.",
          strengths: ["Good communication", "Relevant content"],
          improvements: ["Add more specific examples", "Structure your response better"]
        };
        setEvaluation(fallbackResult);
        
        // Save fallback to feedback history too
        const newFeedback: FeedbackHistory = {
          id: Date.now().toString(),
          category: selectedCategory,
          question: questions[currentQuestionIndex],
          answer: userAnswer,
          evaluation: fallbackResult,
          timestamp: new Date()
        };
        setFeedbackHistory(prev => [newFeedback, ...prev]);
      }
    } catch (error) {
      
      setEvaluation({
        score: 3,
        feedback: "Your answer demonstrates good understanding. Consider adding more specific examples and structuring your response for maximum impact.",
        strengths: ["Good communication", "Relevant content"],
        improvements: ["Add specific examples", "Improve structure"]
      });
    }
    
    setIsEvaluating(false);
  };

  const startRecording = async () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          
          setIsRecording(true);
        };
        
        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setUserAnswer(prev => prev + finalTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          
          setIsRecording(false);
          
          switch (event.error) {
            case 'no-speech':
              // Don't show alert for no-speech, just stop recording
              break;
            case 'audio-capture':
              
              break;
            case 'not-allowed':
              
              break;
            case 'network':
              
              break;
            default:
              
              break;
          }
        };
        
        recognition.onend = () => {
          
          setIsRecording(false);
        };
        
        recognition.start();
      } catch (error) {
        
        setIsRecording(false);
        
      }
    } else {
      
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Responsive Sidebar Component - Desktop only
  const renderSidebar = () => {
    // Only render sidebar on desktop
    if (isMobile) return null;
    
    return (
      <div style={{
      width: '240px',
      backgroundColor: '#1f2937',
      color: '#ffffff',
      padding: '0',
      position: 'fixed',
      top: '0',
      left: '0',
      height: '100vh',
      overflowY: 'auto',
      zIndex: 10,
      flexShrink: 0,
      boxSizing: 'border-box'
    }}>
      {/* Logo/Title */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#fbbf24',
          margin: '0',
          fontFamily: "'Fredoka', 'Inter', sans-serif"
        }}>
          🎤 Interview Prep
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '0 16px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#9ca3af', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '12px',
            padding: '0 8px'
          }}>
            Practice
          </h3>
          <div 
            onClick={() => setCurrentView('categories')}
            style={{
              backgroundColor: (currentView as string) === 'categories' ? '#374151' : 'transparent',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '18px' }}>📚</span>
            <span style={{ fontWeight: '500', fontSize: '16px' }}>Question Sets</span>
          </div>
          <div 
            onClick={() => setCurrentView('progress')}
            style={{
              backgroundColor: (currentView as string) === 'progress' ? '#374151' : 'transparent',
              padding: '12px 16px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>📊</span>
            <span style={{ fontWeight: '500', fontSize: isMobile ? '14px' : '16px' }}>Progress</span>
          </div>
        </div>

        <div>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: '#9ca3af', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '12px',
            padding: '0 8px'
          }}>
            Tools
          </h3>
          <div 
            onClick={() => setCurrentView('feedback')}
            style={{
              backgroundColor: (currentView as string) === 'feedback' ? '#374151' : 'transparent',
              padding: '12px 16px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              borderRadius: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>🤖</span>
            <span style={{ fontWeight: '500', fontSize: '16px' }}>AI Feedback</span>
          </div>
        </div>
      </nav>
    </div>
    );
  };

  if ((currentView as string) === 'categories') {
    return (
      <AuthGuard>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
        position: 'relative',
        width: '100vw',
        overflow: isMobile ? 'hidden' : 'auto',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : undefined,
        justifyContent: isMobile ? 'flex-start' : undefined,
        alignItems: isMobile ? 'stretch' : undefined
      }}>
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <div 
          style={{ 
            marginLeft: isMobile ? '0' : '240px',
            padding: isMobile ? '16px' : '20px 40px',
            width: isMobile ? '100vw' : 'calc(100vw - 240px)',
            maxWidth: isMobile ? '100vw' : 'none',
            boxSizing: 'border-box',
            minHeight: isMobile ? 'auto' : '100vh',
            overflowX: 'hidden',
            display: isMobile ? 'flex' : 'block',
            flexDirection: isMobile ? 'column' : undefined,
            justifyContent: isMobile ? 'flex-start' : undefined,
            alignItems: isMobile ? 'stretch' : undefined
          }}>

          {/* Header */}
          <div style={{ 
            marginBottom: isMobile ? '24px' : '40px',
            paddingTop: isMobile ? '0' : '0'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '16px' : '0',
              marginBottom: isMobile ? '12px' : '8px'
            }}>
              <div>
                <h1 style={{ 
                  fontSize: isMobile ? '28px' : '48px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0',
                  fontFamily: "'Fredoka', 'Inter', sans-serif"
                }}>
                  Interview Preparation
                </h1>
              </div>
              <button
                onClick={() => setShowTailorModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '12px 20px' : '12px 24px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  fontFamily: "'Fredoka', 'Inter', sans-serif",
                  width: isMobile ? '100%' : 'auto',
                  justifyContent: 'center'
                }}
                onMouseEnter={!isMobile ? (e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                } : undefined}
                onMouseLeave={!isMobile ? (e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                } : undefined}
              >
                <Sparkles style={{ width: '18px', height: '18px' }} />
                Tailor Interview
              </button>
            </div>
            <p style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              color: '#4b5563', 
              margin: '0',
              fontWeight: '400',
              lineHeight: isMobile ? '1.5' : '1.4'
            }}>
              Master your interview skills with AI-powered feedback and practice
            </p>
          </div>

          {/* Search Bar */}
          <div 
            style={{ 
              marginBottom: isMobile ? '32px' : '30px',
              margin: isMobile ? '0 0 32px 0' : '0 auto 30px auto',
              maxWidth: isMobile ? '100%' : '800px',
              width: isMobile ? '100%' : '100%'
            }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isMobile ? '12px 0' : '16px 24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '12px' : '16px',
              margin: isMobile ? '0' : '0'
            }}>
              <span style={{ fontSize: isMobile ? '18px' : '20px', color: '#6b7280' }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question categories..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: isMobile ? '14px' : '16px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          {/* Question Categories - Responsive Grid */}
          <div>
            <h2 style={{ 
              fontSize: isMobile ? '22px' : '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: isMobile ? '24px' : '24px',
              margin: isMobile ? '0 0 24px 0' : '0 0 16px 0'
            }}>
              Question Categories
            </h2>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: isMobile ? '16px' : '20px',
                maxWidth: isMobile ? '100%' : 'none',
                padding: isMobile ? '0' : '0',
                margin: isMobile ? '0' : '0',
                width: isMobile ? '100%' : '100%'
              }}>
              {categories
                .filter(category => 
                  category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  category.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((category) => (
                <div
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: isMobile ? '20px 16px' : '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    position: 'relative',
                    minHeight: isMobile ? '160px' : '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = '#fbbf24';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: isMobile ? '12px' : '16px' }}>{category.icon}</div>
                  <h3 style={{ 
                    fontSize: isMobile ? '18px' : '24px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    marginBottom: isMobile ? '8px' : '12px',
                    margin: '0 0 8px 0'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{ 
                    fontSize: isMobile ? '14px' : '16px', 
                    color: '#6b7280', 
                    marginBottom: isMobile ? '12px' : '16px',
                    margin: '0 0 12px 0',
                    lineHeight: '1.5'
                  }}>
                    {category.description}
                  </p>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: isMobile ? '6px 12px' : '8px 16px',
                    borderRadius: '20px',
                    fontSize: isMobile ? '12px' : '14px',
                    fontWeight: '600'
                  }}>
                    {questionDatabase[category.id as keyof typeof questionDatabase].length} questions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tailor Interview Modal */}
        <TailorInterviewModal
          isOpen={showTailorModal}
          onClose={() => setShowTailorModal(false)}
          onSubmit={handleTailorInterview}
          isMobile={isMobile}
        />

        {/* Tailoring Loading Modal */}
        <TailoringLoadingModal
          isOpen={isTailoring}
          companyName={tailoringDetails.companyName}
          jobRole={tailoringDetails.jobRole}
          isMobile={isMobile}
        />
      </div>
      </AuthGuard>
    );
  }

  if (currentView === 'progress') {
    return (
      <AuthGuard>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
        position: 'relative',
        width: '100vw',
        overflow: isMobile ? 'hidden' : 'auto',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : undefined,
        justifyContent: isMobile ? 'flex-start' : undefined,
        alignItems: isMobile ? 'stretch' : undefined
      }}>
        {/* Sidebar */}
        {renderSidebar()}

        {/* Progress Content */}
        <div style={{ 
          marginLeft: isMobile ? '0' : '240px',
          padding: isMobile ? '64px 16px 16px 16px' : '20px 40px',
          width: isMobile ? '100vw' : 'calc(100vw - 240px)',
          maxWidth: isMobile ? '100vw' : 'none',
          boxSizing: 'border-box',
          minHeight: isMobile ? 'auto' : '100vh',
          overflowX: 'hidden',
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'column' : undefined,
          justifyContent: isMobile ? 'flex-start' : undefined,
          alignItems: isMobile ? 'stretch' : undefined
        }}>

          <div style={{ 
            marginBottom: isMobile ? '24px' : '40px',
            paddingTop: isMobile ? '0' : '0'
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '48px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: isMobile ? '0 0 12px 0' : '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              Your Progress
            </h1>
            <p style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              color: '#4b5563', 
              margin: '0',
              fontWeight: '400'
            }}>
              Track your interview preparation journey
            </p>
          </div>

          {/* Progress Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: isMobile ? '12px' : '24px',
            maxWidth: isMobile ? '100%' : '1200px',
            padding: isMobile ? '0' : '0',
            margin: isMobile ? '0' : '0 auto',
            width: isMobile ? '100%' : 'auto'
          }}>
            {categories.map((category) => {
              const progress = progressData[category.id] || {
                questionsAnswered: 0,
                totalQuestions: questionDatabase[category.id as keyof typeof questionDatabase].length,
                averageScore: 0,
                lastPracticed: null
              };
              
              const completionPercentage = (progress.questionsAnswered / progress.totalQuestions) * 100;
              
              return (
                <div key={category.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: isMobile ? '20px 16px' : '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: isMobile ? '28px' : '32px' }}>{category.icon}</span>
                    <h3 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1f2937' }}>
                        {progress.questionsAnswered}/{progress.totalQuestions} questions
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${completionPercentage}%`,
                        height: '100%',
                        backgroundColor: '#fbbf24',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '12px' : '16px' }}>
                    <div>
                      <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Average Score
                      </p>
                      <p style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                        {progress.averageScore > 0 ? `${progress.averageScore.toFixed(1)}/5` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Last Practiced
                      </p>
                      <p style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
                        {progress.lastPracticed 
                          ? progress.lastPracticed.toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => selectCategory(category.id)}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: isMobile ? '10px' : '12px',
                      backgroundColor: '#fbbf24',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: isMobile ? '14px' : '16px'
                    }}
                  >
                    Continue Practice
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tailor Interview Modal */}
        <TailorInterviewModal
          isOpen={showTailorModal}
          onClose={() => setShowTailorModal(false)}
          onSubmit={handleTailorInterview}
          isMobile={isMobile}
        />

        {/* Tailoring Loading Modal */}
        <TailoringLoadingModal
          isOpen={isTailoring}
          companyName={tailoringDetails.companyName}
          jobRole={tailoringDetails.jobRole}
          isMobile={isMobile}
        />
      </div>
      </AuthGuard>
    );
  }

  if ((currentView as string) === 'feedback') {
    return (
      <AuthGuard>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
        position: 'relative',
        width: '100vw',
        overflow: isMobile ? 'hidden' : 'auto',
        display: isMobile ? 'flex' : 'block',
        flexDirection: isMobile ? 'column' : undefined,
        justifyContent: isMobile ? 'flex-start' : undefined,
        alignItems: isMobile ? 'stretch' : undefined
      }}>
        {/* Sidebar */}
        {renderSidebar()}

        {/* Feedback History Content */}
        <div style={{ 
          marginLeft: isMobile ? '0' : '240px',
          padding: isMobile ? '64px 16px 16px 16px' : '20px 40px',
          width: isMobile ? '100vw' : 'calc(100vw - 240px)',
          maxWidth: isMobile ? '100vw' : 'none',
          boxSizing: 'border-box',
          minHeight: isMobile ? 'auto' : '100vh',
          overflowX: 'hidden',
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'column' : undefined,
          justifyContent: isMobile ? 'flex-start' : undefined,
          alignItems: isMobile ? 'stretch' : undefined
        }}>
          <div style={{ 
            marginBottom: isMobile ? '24px' : '40px',
            paddingTop: isMobile ? '0' : '0'
          }}>
            <h1 style={{ 
              fontSize: isMobile ? '28px' : '48px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: isMobile ? '0 0 12px 0' : '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              AI Feedback History
            </h1>
            <p style={{ 
              fontSize: isMobile ? '16px' : '20px', 
              color: '#4b5563', 
              margin: '0',
              fontWeight: '400'
            }}>
              Review all your previous interview practice sessions
            </p>
          </div>

          {feedbackHistory.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: isMobile ? '24px 6px' : '48px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '16px', display: 'block' }}>🤖</span>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                No feedback yet
              </h3>
              <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#6b7280', marginBottom: '24px' }}>
                Start practicing with our question sets to receive AI-powered feedback
              </p>
              <button
                onClick={() => setCurrentView('categories')}
                style={{
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '16px'
                }}
              >
                Start Practicing
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
              {feedbackHistory.map((feedback) => (
                <div key={feedback.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: isMobile ? '16px 6px' : '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '16px',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '12px' : '0'
                  }}>
                    <div>
                      <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {categories.find(c => c.id === feedback.category)?.name} Question
                      </h3>
                      <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280', margin: '0' }}>
                        {feedback.timestamp.toLocaleDateString()} at {feedback.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {renderStars(feedback.evaluation.score)}
                      <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {feedback.evaluation.score}/5
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      Question:
                    </h4>
                    <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#374151', margin: '0', fontStyle: 'italic' }}>
                      "{feedback.question}"
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      Your Answer:
                    </h4>
                    <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#4b5563', margin: '0', lineHeight: '1.5' }}>
                      {feedback.answer}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      AI Feedback:
                    </h4>
                    <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#374151', margin: '0', lineHeight: '1.5' }}>
                      {feedback.evaluation.feedback}
                    </p>
                  </div>
                  
                  {feedback.evaluation.strengths.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#059669', margin: '0 0 8px 0' }}>
                        Strengths:
                      </h4>
                      <ul style={{ margin: '0', paddingLeft: isMobile ? '16px' : '20px' }}>
                        {feedback.evaluation.strengths.map((strength, index) => (
                          <li key={index} style={{ fontSize: isMobile ? '12px' : '14px', color: '#065f46', marginBottom: '4px' }}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#dc2626', margin: '0 0 8px 0' }}>
                      Areas for Improvement:
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: isMobile ? '16px' : '20px' }}>
                      {feedback.evaluation.improvements.map((improvement, index) => (
                        <li key={index} style={{ fontSize: isMobile ? '12px' : '14px', color: '#991b1b', marginBottom: '4px' }}>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tailor Interview Modal */}
        <TailorInterviewModal
          isOpen={showTailorModal}
          onClose={() => setShowTailorModal(false)}
          onSubmit={handleTailorInterview}
          isMobile={isMobile}
        />

        {/* Tailoring Loading Modal */}
        <TailoringLoadingModal
          isOpen={isTailoring}
          companyName={tailoringDetails.companyName}
          jobRole={tailoringDetails.jobRole}
          isMobile={isMobile}
        />
      </div>
      </AuthGuard>
    );
  }

  if (currentView === 'flashcards') {
    const currentCategory = selectedCategory === 'tailored' 
      ? { id: 'tailored', name: '✨ Tailored Questions', icon: '🎯', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' }
      : categories.find(c => c.id === selectedCategory);
    
    return (
      <AuthGuard>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#e5e7eb', 
        padding: isMobile ? '0' : '20px 40px',
        paddingTop: isMobile ? '0' : '20px',
        width: '100vw',
        boxSizing: 'border-box',
        overflow: isMobile ? 'auto' : 'auto'
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1f2937',
            padding: '12px 16px',
            zIndex: 100,
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <button
                onClick={() => setCurrentView('categories')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '14px' }}>Back</span>
              </button>
              <button
                onClick={shuffleQuestions}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <Shuffle style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fbbf24',
                margin: '0 0 4px 0',
                fontFamily: "'Fredoka', 'Inter', sans-serif"
              }}>
                {currentCategory?.name}
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0',
                fontWeight: '500'
              }}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        )}

        <div style={{ 
          maxWidth: isMobile ? '100%' : 'none', 
          margin: '0 auto', 
          padding: isMobile ? '80px 16px 16px 16px' : '0 20px',
          width: isMobile ? '100%' : '100%'
        }}>
          {/* Desktop Header */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
              <button
                onClick={() => setCurrentView('categories')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  color: '#374151', 
                  fontSize: '18px',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                <ArrowLeft style={{ width: '24px', height: '24px' }} />
                Back to Categories
              </button>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px', margin: '0' }}>
                  {currentCategory?.name} Questions
                </h1>
                <p style={{ color: '#6b7280', fontSize: '20px', margin: '0' }}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <button
                onClick={shuffleQuestions}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  backgroundColor: '#fde047',
                  color: '#000',
                  fontWeight: 'bold',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Shuffle style={{ width: '20px', height: '20px' }} />
                Shuffle
              </button>
            </div>
          )}

          {/* FLASHCARD */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '24px' : '48px', margin: isMobile ? '0 0 24px 0' : '0 auto 48px auto' }}>
            <div style={{ width: '100%', maxWidth: isMobile ? '100%' : '900px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: isMobile ? '20px 16px' : '48px 32px',
                minHeight: isMobile ? '280px' : '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '3px solid #fde047'
              }}>
                {/* Question */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '32px', width: '100%' }}>
                  <h2 style={{ 
                    fontSize: isMobile ? '20px' : '42px', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    lineHeight: '1.2',
                    margin: '0',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    {questions[currentQuestionIndex]}
                  </h2>
                </div>
                
                {/* Answer Section */}
                <div style={{ width: '100%', maxWidth: isMobile ? '100%' : '700px' }}>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: isMobile ? '12px 8px' : '24px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: isMobile ? '12px' : '14px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '12px' 
                    }}>
                      Your Answer
                    </label>
                    
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here... Be specific and use examples where possible."
                      style={{
                        width: '100%',
                        height: isMobile ? '80px' : '120px',
                        padding: isMobile ? '12px' : '16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        resize: 'none',
                        fontSize: isMobile ? '14px' : '16px',
                        marginBottom: '16px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: isMobile ? '8px' : '12px',
                      flexDirection: isMobile ? 'column' : 'row'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: isMobile ? '8px' : '12px', 
                        flexWrap: 'wrap',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        width: isMobile ? '100%' : 'auto'
                      }}>
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          style={{
                            padding: isMobile ? '10px' : '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: isRecording ? '#ef4444' : '#3b82f6',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title={isRecording ? 'Stop recording' : 'Start voice input'}
                        >
                          {isRecording ? <MicOff style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }} /> : <Mic style={{ width: isMobile ? '16px' : '20px', height: isMobile ? '16px' : '20px' }} />}
                        </button>
                        <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#6b7280' }}>
                          {userAnswer.length} characters
                        </span>
                        {isRecording && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}>
                            <div style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: '#ef4444', 
                              borderRadius: '50%',
                              animation: 'pulse 2s infinite'
                            }}></div>
                            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '500' }}>Recording...</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={evaluateAnswer}
                        disabled={!userAnswer.trim() || isEvaluating}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: isMobile ? '10px 16px' : '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: !userAnswer.trim() || isEvaluating ? 'not-allowed' : 'pointer',
                          backgroundColor: !userAnswer.trim() || isEvaluating ? '#f3f4f6' : '#fde047',
                          color: !userAnswer.trim() || isEvaluating ? '#9ca3af' : '#000',
                          fontSize: isMobile ? '14px' : '16px',
                          width: isMobile ? '100%' : 'auto',
                          justifyContent: 'center'
                        }}
                      >
                        {isEvaluating ? (
                          <>
                            <div style={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid #000',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Send style={{ width: '16px', height: '16px' }} />
                            Get AI Feedback
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: isMobile ? '24px' : '48px', 
            gap: isMobile ? '20px' : '48px',
            padding: isMobile ? '0 4px' : '0'
          }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                previousQuestion();
              }}
              disabled={currentQuestionIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                borderRadius: '50%',
                fontSize: isMobile ? '20px' : '32px',
                fontWeight: 'bold',
                border: 'none',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                backgroundColor: currentQuestionIndex === 0 ? '#6b7280' : '#fde047',
                color: currentQuestionIndex === 0 ? '#9ca3af' : '#000',
                boxShadow: currentQuestionIndex === 0 ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                position: 'relative'
              }}
            >
              ←
            </button>
            
            {!isMobile && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#fde047', margin: '0' }}>
                  {currentQuestionIndex + 1} / {questions.length}
                </div>
                {isShuffled && (
                  <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>
                    🔀 SHUFFLED MODE
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextQuestion();
              }}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                borderRadius: '50%',
                fontSize: isMobile ? '20px' : '32px',
                fontWeight: 'bold',
                border: 'none',
                cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                backgroundColor: currentQuestionIndex === questions.length - 1 ? '#6b7280' : '#fde047',
                color: currentQuestionIndex === questions.length - 1 ? '#9ca3af' : '#000',
                boxShadow: currentQuestionIndex === questions.length - 1 ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                position: 'relative'
              }}
            >
              →
            </button>
          </div>

          {/* AI Evaluation Results */}
          {evaluation && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
              padding: isMobile ? '20px' : '32px',
              marginBottom: isMobile ? '32px' : '64px',
              border: '3px solid #fde047',
              maxWidth: isMobile ? '100%' : '900px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>AI Evaluation</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {renderStars(evaluation.score)}
                  <span style={{ marginLeft: '8px', fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', color: '#111827' }}>
                    {evaluation.score}/5
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
                <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '12px', fontSize: isMobile ? '16px' : '18px' }}>Overall Feedback</h4>
                <p style={{ color: '#374151', lineHeight: '1.6', fontSize: isMobile ? '14px' : '16px', margin: '0' }}>{evaluation.feedback}</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: isMobile ? '24px' : '32px' 
              }}>
                <div>
                  <h4 style={{ 
                    fontWeight: '600', 
                    color: '#065f46', 
                    marginBottom: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: isMobile ? '16px' : '18px' 
                  }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                    Strengths
                  </h4>
                  {evaluation.strengths && evaluation.strengths.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index} style={{ 
                          color: '#065f46', 
                          marginBottom: '8px', 
                          fontSize: isMobile ? '14px' : '16px', 
                          paddingLeft: '20px', 
                          position: 'relative' 
                        }}>
                          <span style={{ position: 'absolute', left: '0', color: '#10b981' }}>✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic', margin: '0', fontSize: isMobile ? '14px' : '16px' }}>Keep working to identify your strengths!</p>
                  )}
                </div>
                <div>
                  <h4 style={{ 
                    fontWeight: '600', 
                    color: '#dc2626', 
                    marginBottom: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: isMobile ? '16px' : '18px' 
                  }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                    Areas for Improvement
                  </h4>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} style={{ 
                        color: '#dc2626', 
                        marginBottom: '8px', 
                        fontSize: isMobile ? '14px' : '16px', 
                        paddingLeft: '20px', 
                        position: 'relative' 
                      }}>
                        <span style={{ position: 'absolute', left: '0', color: '#ef4444' }}>•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Tailor Interview Modal */}
        <TailorInterviewModal
          isOpen={showTailorModal}
          onClose={() => setShowTailorModal(false)}
          onSubmit={handleTailorInterview}
          isMobile={isMobile}
        />

        {/* Tailoring Loading Modal */}
        <TailoringLoadingModal
          isOpen={isTailoring}
          companyName={tailoringDetails.companyName}
          jobRole={tailoringDetails.jobRole}
          isMobile={isMobile}
        />
      </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div style={{ 
        minHeight: '100vh', 
        padding: isMobile ? '16px' : '24px',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)'
      }}>
        <p>Loading interview prep...</p>
      </div>
    </AuthGuard>
  );
}
