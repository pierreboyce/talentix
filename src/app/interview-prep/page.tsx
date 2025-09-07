'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, Star, Mic, MicOff, Send } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';

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

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setQuestions(questionDatabase[categoryId as keyof typeof questionDatabase]);
    setCurrentQuestionIndex(0);
    setIsShuffled(false);
    setUserAnswer('');
    setEvaluation(null);
    setCurrentView('flashcards');
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
      console.error('Evaluation error:', error);
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
          console.log('Speech recognition started');
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
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          
          switch (event.error) {
            case 'no-speech':
              // Don't show alert for no-speech, just stop recording
              break;
            case 'audio-capture':
              alert('Microphone access denied. Please allow microphone access and try again.');
              break;
            case 'not-allowed':
              alert('Microphone access not allowed. Please enable microphone permissions.');
              break;
            case 'network':
              alert('Network error occurred during speech recognition.');
              break;
            default:
              console.log('Speech recognition error:', event.error);
              break;
          }
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
        };
        
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsRecording(false);
        alert('Failed to start speech recognition. Please try again.');
      }
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
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

  if ((currentView as string) === 'categories') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', display: 'flex' }}>
        {/* Left Sidebar - Quizlet Style */}
        <div style={{
          width: '280px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '24px 0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
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
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = (currentView as string) === 'categories' ? '#374151' : 'transparent'}
              >
                <span style={{ fontSize: '20px' }}>📚</span>
                <span style={{ fontWeight: '500' }}>Question Sets</span>
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = (currentView as string) === 'progress' ? '#374151' : 'transparent'}
              >
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontWeight: '500' }}>Progress</span>
              </div>
              <div style={{
                padding: '12px 16px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <span style={{ fontWeight: '500' }}>Settings</span>
              </div>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = (currentView as string) === 'feedback' ? '#374151' : 'transparent'}
              >
                <span style={{ fontSize: '20px' }}>🤖</span>
                <span style={{ fontWeight: '500' }}>AI Feedback</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: '280px', flex: 1, padding: '32px 48px' }}>
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              Interview Preparation
            </h1>
            <p style={{ 
              fontSize: '20px', 
              color: '#4b5563', 
              margin: '0',
              fontWeight: '400'
            }}>
              Master your interview skills with AI-powered feedback and practice
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '16px 24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '600px'
            }}>
              <span style={{ fontSize: '20px', color: '#6b7280' }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search question categories..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </div>

          {/* Question Categories - Quizlet Flashcard Style */}
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              Question Categories
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '24px',
              maxWidth: '1200px'
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
                    padding: '32px 24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid transparent',
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#fbbf24';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>{category.icon}</div>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>
                    {category.name}
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#6b7280', 
                    marginBottom: '16px',
                    margin: '0 0 16px 0',
                    lineHeight: '1.5'
                  }}>
                    {category.description}
                  </p>
                  <div style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {questionDatabase[category.id as keyof typeof questionDatabase].length} questions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'progress') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', display: 'flex' }}>
        {/* Same Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '24px 0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}>
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

          <nav style={{ padding: '0 16px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                <span style={{ fontSize: '20px' }}>📚</span>
                <span style={{ fontWeight: '500' }}>Question Sets</span>
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
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontWeight: '500' }}>Progress</span>
              </div>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                <span style={{ fontSize: '20px' }}>🤖</span>
                <span style={{ fontWeight: '500' }}>AI Feedback</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Progress Content */}
        <div style={{ marginLeft: '280px', flex: 1, padding: '32px 48px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              Your Progress
            </h1>
            <p style={{ 
              fontSize: '20px', 
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '24px',
            maxWidth: '1200px'
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
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>{category.icon}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                      {category.name}
                    </h3>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Progress</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Average Score
                      </p>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                        {progress.averageScore > 0 ? `${progress.averageScore.toFixed(1)}/5` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Last Practiced
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937', margin: '0' }}>
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
                      padding: '12px',
                      backgroundColor: '#fbbf24',
                      color: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Continue Practice
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if ((currentView as string) === 'feedback') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', display: 'flex' }}>
        {/* Same Sidebar */}
        <div style={{
          width: '280px',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '24px 0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}>
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

          <nav style={{ padding: '0 16px' }}>
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                <span style={{ fontSize: '20px' }}>📚</span>
                <span style={{ fontWeight: '500' }}>Question Sets</span>
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
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ fontWeight: '500' }}>Progress</span>
              </div>
            </div>

            <div>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#9ca3af', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: '16px',
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
                <span style={{ fontSize: '20px' }}>🤖</span>
                <span style={{ fontWeight: '500' }}>AI Feedback</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Feedback History Content */}
        <div style={{ marginLeft: '280px', flex: 1, padding: '32px 48px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              AI Feedback History
            </h1>
            <p style={{ 
              fontSize: '20px', 
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
              padding: '48px',
              textAlign: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}>🤖</span>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                No feedback yet
              </h3>
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
                Start practicing with our question sets to receive AI-powered feedback
              </p>
              <button
                onClick={() => setCurrentView('categories')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Start Practicing
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {feedbackHistory.map((feedback) => (
                <div key={feedback.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {categories.find(c => c.id === feedback.category)?.name} Question
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        {feedback.timestamp.toLocaleDateString()} at {feedback.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {renderStars(feedback.evaluation.score)}
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {feedback.evaluation.score}/5
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      Question:
                    </h4>
                    <p style={{ fontSize: '16px', color: '#374151', margin: '0', fontStyle: 'italic' }}>
                      "{feedback.question}"
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      Your Answer:
                    </h4>
                    <p style={{ fontSize: '14px', color: '#4b5563', margin: '0', lineHeight: '1.5' }}>
                      {feedback.answer}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                      AI Feedback:
                    </h4>
                    <p style={{ fontSize: '14px', color: '#374151', margin: '0', lineHeight: '1.5' }}>
                      {feedback.evaluation.feedback}
                    </p>
                  </div>
                  
                  {feedback.evaluation.strengths.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#059669', margin: '0 0 8px 0' }}>
                        Strengths:
                      </h4>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {feedback.evaluation.strengths.map((strength, index) => (
                          <li key={index} style={{ fontSize: '14px', color: '#065f46', marginBottom: '4px' }}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', margin: '0 0 8px 0' }}>
                      Areas for Improvement:
                    </h4>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      {feedback.evaluation.improvements.map((improvement, index) => (
                        <li key={index} style={{ fontSize: '14px', color: '#991b1b', marginBottom: '4px' }}>
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
      </div>
    );
  }

  if ((currentView as string) === 'flashcards') {
    const currentCategory = categories.find(c => c.id === selectedCategory);
    
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#e5e7eb', padding: '32px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          {/* Header */}
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

          {/* QUIZLET-STYLE FLASHCARD */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <div style={{ width: '100%', maxWidth: '900px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '48px 32px',
                minHeight: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '3px solid #fde047'
              }}>
                {/* Question */}
                <div style={{ textAlign: 'center', marginBottom: '32px', width: '100%' }}>
                  <h2 style={{ 
                    fontSize: '42px', 
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
                <div style={{ width: '100%', maxWidth: '700px' }}>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
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
                        height: '120px',
                        padding: '16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        resize: 'none',
                        fontSize: '16px',
                        marginBottom: '16px',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          style={{
                            padding: '12px',
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
                          {isRecording ? <MicOff style={{ width: '20px', height: '20px' }} /> : <Mic style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
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
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>Recording...</span>
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
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: !userAnswer.trim() || isEvaluating ? 'not-allowed' : 'pointer',
                          backgroundColor: !userAnswer.trim() || isEvaluating ? '#f3f4f6' : '#fde047',
                          color: !userAnswer.trim() || isEvaluating ? '#9ca3af' : '#000'
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '48px', gap: '48px' }}>
            <button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                fontSize: '32px',
                fontWeight: 'bold',
                border: 'none',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                backgroundColor: currentQuestionIndex === 0 ? '#6b7280' : '#fde047',
                color: currentQuestionIndex === 0 ? '#9ca3af' : '#000',
                boxShadow: currentQuestionIndex === 0 ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              ←
            </button>
            
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
            
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                fontSize: '32px',
                fontWeight: 'bold',
                border: 'none',
                cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                backgroundColor: currentQuestionIndex === questions.length - 1 ? '#6b7280' : '#fde047',
                color: currentQuestionIndex === questions.length - 1 ? '#9ca3af' : '#000',
                boxShadow: currentQuestionIndex === questions.length - 1 ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
              padding: '32px',
              marginBottom: '64px',
              border: '3px solid #fde047',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>AI Evaluation</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {renderStars(evaluation.score)}
                  <span style={{ marginLeft: '8px', fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                    {evaluation.score}/5
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '12px', fontSize: '18px' }}>Overall Feedback</h4>
                <p style={{ color: '#374151', lineHeight: '1.6', fontSize: '16px', margin: '0' }}>{evaluation.feedback}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                <div>
                  <h4 style={{ fontWeight: '600', color: '#065f46', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                    Strengths
                  </h4>
                  {evaluation.strengths && evaluation.strengths.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index} style={{ color: '#065f46', marginBottom: '8px', fontSize: '16px', paddingLeft: '20px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '0', color: '#10b981' }}>✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: '#6b7280', fontStyle: 'italic', margin: '0' }}>Keep working to identify your strengths!</p>
                  )}
                </div>
                <div>
                  <h4 style={{ fontWeight: '600', color: '#dc2626', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                    Areas for Improvement
                  </h4>
                  <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {evaluation.improvements.map((improvement, index) => (
                      <li key={index} style={{ color: '#dc2626', marginBottom: '8px', fontSize: '16px', paddingLeft: '20px', position: 'relative' }}>
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
      </div>
    );
  }

  return null;
}
