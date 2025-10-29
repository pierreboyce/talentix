'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Play, Square, RotateCcw, Send, Clock, Mic, Video, ArrowLeft, CheckCircle, Search, Settings, Lightbulb, Shuffle, Menu, Sparkles } from 'lucide-react';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import TailorInterviewModal from '../../components/TailorInterviewModal';
import TailoringLoadingModal from '../../components/TailoringLoadingModal';

// Hardcoded interview questions
const interviewQuestions = [
  {
    id: 1,
    category: 'General',
    question: 'Tell me about yourself and why you\'re interested in this role.',
    difficulty: 'Easy'
  },
  {
    id: 2,
    category: 'Experience',
    question: 'Describe a challenging situation at work and how you handled it.',
    difficulty: 'Medium'
  },
  {
    id: 3,
    category: 'Skills',
    question: 'What are your greatest strengths and how do they apply to this position?',
    difficulty: 'Easy'
  },
  {
    id: 4,
    category: 'Problem Solving',
    question: 'Walk me through how you would approach solving a problem you\'ve never encountered before.',
    difficulty: 'Hard'
  },
  {
    id: 5,
    category: 'Leadership',
    question: 'Describe a time when you had to lead a team or project. What was your approach?',
    difficulty: 'Medium'
  },
  {
    id: 6,
    category: 'Goals',
    question: 'Where do you see yourself in 5 years and how does this role fit into your career goals?',
    difficulty: 'Medium'
  },
  {
    id: 7,
    category: 'Teamwork',
    question: 'Tell me about a time when you had to work with someone difficult. How did you handle it?',
    difficulty: 'Medium'
  },
  {
    id: 8,
    category: 'Motivation',
    question: 'What motivates you to do your best work, and how do you stay motivated during challenging times?',
    difficulty: 'Easy'
  },
  {
    id: 9,
    category: 'Adaptability',
    question: 'Describe a situation where you had to quickly adapt to significant changes. How did you manage?',
    difficulty: 'Hard'
  },
  {
    id: 10,
    category: 'Communication',
    question: 'Give me an example of a time when you had to explain something complex to someone. How did you approach it?',
    difficulty: 'Medium'
  }
];

interface FeedbackData {
  clarity: number;
  confidence: number;
  relevance: number;
  fillerWords: string[];
  strengths: string[];
  improvements: string[];
  transcript: string;
  overallScore: number;
}

export default function VideoInterviewPage(): React.ReactElement {
  const { user, loading } = useAuth();
  const { addPoints } = usePoints();
  const { subscription } = useSubscription();
  const router = useRouter();
  const { isMobile, isTablet } = useDeviceDetection();
  
  // Core state
  const [currentQuestion, setCurrentQuestion] = useState(interviewQuestions[0]);
  const [stage, setStage] = useState<'welcome' | 'planning' | 'recording' | 'playback' | 'feedback'>('welcome');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0); // Track questions used for free tier
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoringDetails, setTailoringDetails] = useState({ companyName: '', jobRole: '' });
  
  // Initialize questions used from localStorage (user-specific)
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.email) {
      const currentUsage = parseInt(localStorage.getItem(`video_interview_questions_used_${user.email}`) || '0');
      setQuestionsUsed(currentUsage);
    }
  }, [user?.email]);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  // Handle video source switching
  useEffect(() => {
    if (stage === 'playback' && recordedBlob && videoRef.current) {
      console.log('🎬 Switching to playback mode with recorded blob');
      const url = URL.createObjectURL(recordedBlob);
      console.log('🎬 Setting video source for playback:', url);
      
      // Clear the live stream first
      videoRef.current.srcObject = null;
      // Set the recorded video
      videoRef.current.src = url;
      videoRef.current.load(); // Force reload of the video element
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if ((stage === 'planning' || stage === 'recording') && streamRef.current && videoRef.current) {
      console.log('🎬 Switching to live camera mode');
      console.log('🎬 Stream active:', streamRef.current.active);
      console.log('🎬 Video tracks:', streamRef.current.getVideoTracks().length);
      console.log('🎬 Audio tracks:', streamRef.current.getAudioTracks().length);
      
      // Clear any existing src
      videoRef.current.src = '';
      // Set the live stream
      videoRef.current.srcObject = streamRef.current;
      
      // Try to play the video
      videoRef.current.play().then(() => {
        console.log('✅ Live video preview started');
      }).catch((playError) => {
        console.warn('⚠️ Live video preview autoplay failed:', playError.message);
      });
    } else if ((stage === 'planning' || stage === 'recording') && !streamRef.current) {
      console.error('❌ No stream available for live camera mode');
    }
  }, [stage, recordedBlob]);

  const checkCanUseVideoInterview = () => {
    // Check subscription limits for free tier users (user-specific)
    if (!user?.email) {
      console.error('User email not available for usage tracking');
      return false;
    }
    
    const currentUsage = parseInt(localStorage.getItem(`video_interview_questions_used_${user.email}`) || '0');
    console.log('🔍 Video interview usage check:');
    console.log('  - User email:', user.email);
    
    if (subscription.tier === 'free' && currentUsage >= 2) {
      // Trigger pricing modal for upgrade
      window.dispatchEvent(new CustomEvent('openPricingModal'));
      return false;
    }
    
    return true;
  };

  const getRandomQuestionAndTrackUsage = () => {
    // Only increment usage when user actually gets a question
    if (!user?.email) {
      console.error('User email not available for usage tracking');
      return;
    }
    
    const currentUsage = parseInt(localStorage.getItem(`video_interview_questions_used_${user.email}`) || '0');
    const newUsage = currentUsage + 1;
    localStorage.setItem(`video_interview_questions_used_${user.email}`, newUsage.toString());
    setQuestionsUsed(newUsage);
    
    // Notify other components of usage update
    window.dispatchEvent(new CustomEvent('talentix-usage-update'));
    
    const randomIndex = Math.floor(Math.random() * interviewQuestions.length);
    setCurrentQuestion(interviewQuestions[randomIndex]);
  };

  const startPractice = async (skipQuestionGeneration = false) => {
    console.log('🚀 startPractice function called');
    console.log('🔍 Current URL before startPractice:', window.location.href);
    
    // Check if user can use video interview feature
    const canProceed = checkCanUseVideoInterview();
    if (!canProceed) {
      return; // Paywall triggered, stop here
    }

    // Get random question and track usage (unless we already have a tailored question)
    if (!skipQuestionGeneration) {
    getRandomQuestionAndTrackUsage();
    }
    
    console.log('🎯 Setting stage to planning...');
    setStage('planning');
    setTimeLeft(60);
    setFeedback(null);
    setRecordedBlob(null);
    console.log('✅ State updated - stage: planning, timeLeft: 60');
    
    try {
      console.log('🎥 Requesting camera and microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      console.log('✅ Media stream acquired');
      console.log('🎤 Audio tracks:', stream.getAudioTracks().length);
      console.log('📹 Video tracks:', stream.getVideoTracks().length);
      
      // Log track details
      stream.getAudioTracks().forEach((track, index) => {
        console.log(`🎤 Audio track ${index}:`, track.label, track.enabled);
      });
      stream.getVideoTracks().forEach((track, index) => {
        console.log(`📹 Video track ${index}:`, track.label, track.enabled);
      });
      
      streamRef.current = stream;
      
      // Immediately connect video element to stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('📹 Video element connected to stream immediately');
        
        // Try to play the video to ensure it's working
        videoRef.current.play().then(() => {
          console.log('✅ Video preview started successfully');
        }).catch((playError) => {
          console.warn('⚠️ Video preview autoplay failed (this is normal):', playError.message);
        });
      }
      
      console.log('📹 Camera initialized successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera/microphone. Please check your permissions and try again.');
      setStage('welcome');
    }
  };

  const goToWelcome = () => {
    setStage('welcome');
    setTimeLeft(60);
    setIsRecording(false);
    setRecordedBlob(null);
    setFeedback(null);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startRecording = useCallback(async () => {
    try {
      if (!streamRef.current) {
        console.error('No camera stream available');
        alert('Camera not available. Please ensure camera access is granted and try again.');
        return;
      }

      // Check if stream has audio and video tracks
      const audioTracks = streamRef.current.getAudioTracks();
      const videoTracks = streamRef.current.getVideoTracks();
      console.log('🎤 Audio tracks:', audioTracks.length);
      console.log('📹 Video tracks:', videoTracks.length);
      
      if (audioTracks.length === 0) {
        console.warn('⚠️ No audio tracks found in stream');
      }
      if (videoTracks.length === 0) {
        console.warn('⚠️ No video tracks found in stream');
        alert('Camera not available. Please ensure camera access is granted and try again.');
        return;
      }

      // Ensure video element is connected to stream
      if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        console.log('📹 Video element connected to stream');
      }

      // Configure MediaRecorder with compression for smaller file size
      let options: MediaRecorderOptions = { 
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 500000, // 500kbps for smaller file size
        audioBitsPerSecond: 64000   // 64kbps for audio
      };
      
      if (!MediaRecorder.isTypeSupported(options.mimeType || '')) {
        options = { 
          mimeType: 'video/webm;codecs=vp8,opus',
          videoBitsPerSecond: 500000,
          audioBitsPerSecond: 64000
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType || '')) {
          options = { 
            mimeType: 'video/webm',
            videoBitsPerSecond: 500000,
            audioBitsPerSecond: 64000
          };
        }
      }
      console.log('🎬 Using MIME type:', options.mimeType);
      console.log('🎬 Video bitrate:', options.videoBitsPerSecond, 'bps');

      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        console.log('📦 Data chunk received:', event.data.size, 'bytes');
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        console.log('🎬 Recording complete. Blob size:', blob.size, 'bytes');
        setRecordedBlob(blob);
        setStage('playback');
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      console.log('🎬 Recording started with options:', options);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to start recording. Please check your camera permissions and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('🛑 Stopping recording...');
    if (mediaRecorderRef.current && isRecording) {
      console.log('🛑 MediaRecorder state:', mediaRecorderRef.current.state);
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        console.log('✅ Recording stopped successfully');
      } catch (error) {
        console.error('❌ Error stopping recording:', error);
        setIsRecording(false); // Reset state even if stop fails
      }
    } else {
      console.log('⚠️ No active recording to stop');
    }
  }, [isRecording]);

  // Timer effect - moved after function declarations to avoid hoisting issues
  useEffect(() => {
    if (timeLeft > 0 && (stage === 'planning' || stage === 'recording')) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      } else if (timeLeft === 0) {
        if (stage === 'planning') {
          setStage('recording');
          setTimeLeft(60);
          startRecording();
        } else if (stage === 'recording' && isRecording) {
          stopRecording();
        }
      }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, stage, isRecording, startRecording, stopRecording]);

  const submitForFeedback = async () => {
    if (!recordedBlob) {
      alert('No recording found. Please record your answer first.');
      return;
    }
    
    console.log('📤 Submitting video for analysis...');
    console.log('📁 Video blob size:', recordedBlob.size, 'bytes');
    console.log('📁 Video blob type:', recordedBlob.type);
    console.log('❓ Question:', currentQuestion.question);
    console.log('📂 Category:', currentQuestion.category);
    
    // Check file size before submitting
    const maxSize = 20 * 1024 * 1024; // 20MB limit
    const fileSizeMB = recordedBlob.size / (1024 * 1024);
    
    if (recordedBlob.size > maxSize) {
      alert(`Video file is too large (${fileSizeMB.toFixed(1)}MB). Please try recording a shorter answer (maximum 1 minute) or refresh the page to try again with better compression.`);
      return;
    }
    
    console.log(`📁 Video size: ${fileSizeMB.toFixed(2)}MB - OK to submit`);
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('video', recordedBlob, 'interview-answer.webm');
      formData.append('question', currentQuestion.question);
      formData.append('category', currentQuestion.category);
      formData.append('userId', user?.id || 'anonymous');
      
      console.log('🌐 Sending request to API...');
      const response = await fetch('/api/video-interview/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Received feedback:', result);
      setFeedback(result);
      setStage('feedback');
      
      if (result.attemptData) {
        const existingAttempts = JSON.parse(localStorage.getItem('video_interview_attempts') || '[]');
        existingAttempts.push(result.attemptData);
        localStorage.setItem('video_interview_attempts', JSON.stringify(existingAttempts));
      }
      
      addPoints(15, 'Video Interview Practice completed');
      
    } catch (error) {
      console.error('❌ Error submitting for feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to analyze your answer: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPractice = () => {
    setStage('welcome');
    setTimeLeft(60);
    setIsRecording(false);
    setRecordedBlob(null);
    setFeedback(null);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleTailorInterview = async (companyName: string, jobRole: string) => {
    console.log('🎯 Tailoring video interview for:', { companyName, jobRole });
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
          questionCount: 5
        }),
      });

      const data = await response.json();

      if (data.success && data.questions && data.questions.length > 0) {
        // Get a random tailored question
        const randomIndex = Math.floor(Math.random() * data.questions.length);
        const tailoredQuestion = data.questions[randomIndex];
        
        setCurrentQuestion({
          id: tailoredQuestion.id,
          category: tailoredQuestion.category,
          question: tailoredQuestion.question,
          difficulty: tailoredQuestion.difficulty
        });
        
        // Track usage for tailored questions too
        if (user?.email) {
          const currentUsage = parseInt(localStorage.getItem(`video_interview_questions_used_${user.email}`) || '0');
          const newUsage = currentUsage + 1;
          localStorage.setItem(`video_interview_questions_used_${user.email}`, newUsage.toString());
          setQuestionsUsed(newUsage);
          window.dispatchEvent(new CustomEvent('talentix-usage-update'));
        }
        
        // Hide loading modal
        setIsTailoring(false);
        
        // Show success message
        const successMsg = `✅ Generated tailored question!\n${jobRole ? `For: ${jobRole}\n` : ''}${companyName ? `At: ${companyName}\n` : ''}\n\nStarting practice now...`;
        alert(successMsg);
        
        // Automatically start practice with the tailored question (skip random question generation)
        setTimeout(() => {
          startPractice(true); // true = skip question generation
        }, 300);
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error: any) {
      console.error('Error tailoring video interview:', error);
      setIsTailoring(false);
      alert(`❌ Failed to generate tailored questions.\n\n${error.message || 'Please try again.'}`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
            borderBottom: '2px solid #fbbf24',
            margin: '0 auto 16px auto'
          }}></div>
          <p style={{ color: '#4b5563' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>

      {/* Desktop Header */}
      {!isMobile && (
        <div style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => router.push('/dashboard')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#4b5563',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease'
                  }}
                >
                  <ArrowLeft style={{ width: '20px', height: '20px' }} />
                  Back to Dashboard
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Video style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0' }}>Video Interview Practice</h1>
              </div>
              <div style={{ width: '128px' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Screen */}
      {stage === 'welcome' && (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', display: isMobile ? 'block' : 'flex' }}>
          {/* Desktop Sidebar */}
          {!isMobile && (
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
                🎥 Video Interview Prep
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
                <div style={{
                  backgroundColor: '#374151',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}>
                  <span style={{ fontSize: '20px' }}>🎥</span>
                  <span style={{ fontWeight: '500' }}>Video Practice</span>
                </div>
              </div>
            </nav>
            </div>
          )}

          <div style={{ 
            marginLeft: isMobile ? '0' : '280px', 
            flex: 1, 
            padding: isMobile ? '70px 0 20px 0' : '32px 48px' 
          }}>
            {/* Mobile Hero Section */}
            {isMobile && (
              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #fbbf24 100%)',
                margin: '-70px 0 32px 0',
                padding: '110px 20px 40px 20px',
                textAlign: 'center',
                borderRadius: '0 0 24px 24px',
                boxShadow: '0 8px 25px -3px rgba(251, 191, 36, 0.3)'
              }}>
                <div style={{ 
                  fontSize: '72px', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))'
                }}>
                  🎥
                </div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0 0 16px 0',
                  fontFamily: "'Fredoka', 'Inter', sans-serif",
                  textShadow: '0 2px 4px rgba(255,255,255,0.8)'
                }}>
                  Video Interview Practice
                </h1>
                <p style={{ 
                  fontSize: '18px', 
                  color: '#374151', 
                  margin: '0',
                  fontWeight: '500',
                  lineHeight: '1.5'
                }}>
                  🌟 Get ready to ace your interviews with video recording and AI‑powered feedback!
                </p>
              </div>
            )}

            <div style={{ 
              marginBottom: isMobile ? '32px' : '40px',
              padding: isMobile ? '0 16px' : '0'
            }}>
              {!isMobile && (
                <>
                  <h1 style={{ 
                    fontSize: '48px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    margin: '0 0 8px 0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    Video Interview Practice 🎥
                  </h1>
                  <p style={{ 
                    fontSize: '20px', 
                    color: '#4b5563', 
                    margin: '0 0 16px 0',
                    fontWeight: '400'
                  }}>
                    Get ready to practice interview questions with video recording and AI‑powered feedback
                  </p>
                </>
              )}
              
              {/* Usage Limits Display */}
              {subscription.tier === 'free' && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  padding: isMobile ? '12px' : '16px',
                  marginBottom: isMobile ? '16px' : '24px',
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '8px' : '12px',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <div>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#92400e', 
                      margin: '0 0 4px 0' 
                    }}>
                      Free Tier Limit: {questionsUsed}/2 video interviews used
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#92400e', 
                      margin: '0' 
                    }}>
                      {questionsUsed >= 2 ? 'Upgrade to Pro for unlimited video interviews!' : `You have ${2 - questionsUsed} interview${2 - questionsUsed === 1 ? '' : 's'} remaining.`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ 
              padding: isMobile ? '0 16px' : '0',
              margin: isMobile ? '0 0 40px 0' : '0 auto',
              maxWidth: isMobile ? '100%' : '600px'
            }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: isMobile ? '24px' : '16px',
                  padding: isMobile ? '40px 24px' : '32px 24px',
                  boxShadow: isMobile ? '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 25px -8px rgba(251, 191, 36, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  cursor: 'default',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isMobile ? '3px solid #fde047' : '2px solid transparent',
                  position: 'relative',
                  minHeight: isMobile ? '240px' : '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                  background: isMobile ? 'linear-gradient(135deg, #ffffff 0%, #fefbf0 100%)' : '#ffffff'
                }}
                onMouseEnter={isMobile ? undefined : (e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={isMobile ? undefined : (e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Decorative elements for mobile */}
                {isMobile && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      fontSize: '24px',
                      opacity: 0.6
                    }}>
                      ✨
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      fontSize: '20px',
                      opacity: 0.5
                    }}>
                      💫
                    </div>
                  </>
                )}
                
                <div style={{ 
                  fontSize: isMobile ? '64px' : '64px', 
                  marginBottom: isMobile ? '20px' : '16px',
                  filter: 'drop-shadow(2px 2px 8px rgba(251, 191, 36, 0.3))'
                }}>
                  🎥
                </div>
                <h3 style={{ 
                  fontSize: isMobile ? '24px' : '24px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: isMobile ? '0 0 12px 0' : '0 0 12px 0',
                  fontFamily: "'Fredoka', 'Inter', sans-serif"
                }}>
                  Start Video Practice
                </h3>
                <p style={{ 
                  fontSize: isMobile ? '16px' : '16px', 
                  color: '#6b7280', 
                  margin: isMobile ? '0 0 28px 0' : '0 0 16px 0',
                  lineHeight: '1.6',
                  maxWidth: isMobile ? '280px' : 'none'
                }}>
                  🎯 Practice interview questions with video recording and get instant AI feedback
                </p>
                <button
                  style={{
                    background: isMobile ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#fbbf24',
                    color: '#1f2937',
                    padding: isMobile ? '18px 40px' : '12px 24px',
                    borderRadius: isMobile ? '16px' : '12px',
                    fontSize: isMobile ? '18px' : '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    width: isMobile ? '100%' : 'auto',
                    minHeight: isMobile ? '56px' : 'auto',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isMobile ? '0 8px 20px -6px rgba(251, 191, 36, 0.4)' : 'none',
                    fontFamily: "'Fredoka', 'Inter', sans-serif",
                    // Enhanced hitbox properties
                    position: 'relative',
                    zIndex: 999999,
                    outline: 'none',
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    // Ensure button is above any other elements
                    isolation: 'isolate'
                  }}
                  onClick={(e) => {
                    console.log('🎯 Start Practice button clicked - calling startPractice()');
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation();
                    startPractice();
                  }}
                  onTouchStart={isMobile ? (e) => {
                    console.log('🎯 Start Practice button touch start!');
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(0.98)';
                  } : undefined}
                  onTouchEnd={isMobile ? (e) => {
                    console.log('🎯 Start Practice button touch end!');
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(1)';
                    startPractice();
                  } : undefined}
                  onMouseEnter={isMobile ? undefined : (e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 25px -8px rgba(251, 191, 36, 0.5)';
                  }}
                  onMouseLeave={isMobile ? undefined : (e) => {
                    e.currentTarget.style.background = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Play style={{ width: '22px', height: '22px', pointerEvents: 'none' }} />
                  <span style={{ pointerEvents: 'none' }}>Start Practice 🚀</span>
                </button>
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: isMobile ? '20px' : '32px',
              paddingBottom: isMobile ? '40px' : '0',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <button
                onClick={(e) => {
                  console.log('✨ Tailor interview button clicked!');
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation();
                  setShowTailorModal(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #f59e0b 100%)',
                  backgroundSize: '200% 100%',
                  border: isMobile ? '3px solid #fbbf24' : '3px solid #fde047',
                  borderRadius: isMobile ? '20px' : '16px',
                  color: '#ffffff',
                  fontSize: isMobile ? '18px' : '18px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  padding: isMobile ? '18px 32px' : '16px 32px',
                  minHeight: isMobile ? '60px' : '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  maxWidth: isMobile ? '100%' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontFamily: "'Fredoka', 'Inter', sans-serif",
                  boxShadow: '0 8px 25px -6px rgba(245, 158, 11, 0.5), 0 0 0 0 rgba(245, 158, 11, 0.4)',
                  position: 'relative',
                  zIndex: 999998,
                  outline: 'none',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  isolation: 'isolate',
                  width: isMobile ? '100%' : 'auto',
                  overflow: 'hidden',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  animation: 'shimmer 3s infinite linear'
                }}
                onMouseEnter={isMobile ? undefined : (e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 35px -8px rgba(245, 158, 11, 0.7), 0 0 20px 2px rgba(251, 191, 36, 0.3)';
                  e.currentTarget.style.backgroundPosition = '100% 0';
                }}
                onMouseLeave={isMobile ? undefined : (e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px -6px rgba(245, 158, 11, 0.5), 0 0 0 0 rgba(245, 158, 11, 0.4)';
                  e.currentTarget.style.backgroundPosition = '0% 0';
                }}
                onTouchStart={isMobile ? (e) => {
                  console.log('✨ Tailor interview button touch start!');
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(0.95)';
                } : undefined}
                onTouchEnd={isMobile ? (e) => {
                  console.log('✨ Tailor interview button touch end!');
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(1)';
                  setShowTailorModal(true);
                } : undefined}
              >
                {/* Shine effect overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shine 3s infinite',
                  pointerEvents: 'none'
                }}></div>
                
                <Sparkles style={{ 
                  width: isMobile ? '24px' : '22px', 
                  height: isMobile ? '24px' : '22px', 
                  pointerEvents: 'none',
                  animation: 'sparkle 2s infinite ease-in-out',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} />
                <span style={{ 
                  pointerEvents: 'none',
                  position: 'relative',
                  zIndex: 1,
                  letterSpacing: '0.3px'
                }}>
                  ✨ Tailor Your Interview ✨
                </span>
              </button>
              
              <button
                onClick={(e) => {
                  console.log('💡 Learn how it works button clicked!');
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent?.stopImmediatePropagation();
                  setShowHowItWorksModal(true);
                }}
                style={{
                  background: isMobile ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' : 'none',
                  border: isMobile ? '2px solid #a5b4fc' : 'none',
                  borderRadius: isMobile ? '16px' : '0',
                  color: isMobile ? '#4338ca' : '#4b5563',
                  fontSize: isMobile ? '16px' : '16px',
                  fontWeight: isMobile ? '600' : 'normal',
                  textDecoration: isMobile ? 'none' : 'underline',
                  cursor: 'pointer',
                  padding: isMobile ? '16px 24px' : '8px 16px',
                  minHeight: isMobile ? '52px' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: isMobile ? '0 auto' : '0',
                  maxWidth: isMobile ? '240px' : 'auto',
                  transition: 'all 0.2s ease',
                  fontFamily: isMobile ? "'Fredoka', 'Inter', sans-serif" : 'inherit',
                  boxShadow: isMobile ? '0 4px 12px rgba(67, 56, 202, 0.15)' : 'none',
                  // Enhanced hitbox properties
                  position: 'relative',
                  zIndex: 999998,
                  outline: 'none',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  isolation: 'isolate'
                }}
                onMouseEnter={isMobile ? undefined : (e) => {
                  e.currentTarget.style.color = '#6366f1';
                  e.currentTarget.style.textDecoration = 'none';
                }}
                onMouseLeave={isMobile ? undefined : (e) => {
                  e.currentTarget.style.color = '#4b5563';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onTouchStart={isMobile ? (e) => {
                  console.log('💡 Learn how it works button touch start!');
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)';
                } : undefined}
                onTouchEnd={isMobile ? (e) => {
                  console.log('💡 Learn how it works button touch end!');
                  e.stopPropagation();
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
                  setShowHowItWorksModal(true);
                } : undefined}
              >
                <span style={{ fontSize: isMobile ? '20px' : '16px', pointerEvents: 'none' }}>💡</span>
                <span style={{ pointerEvents: 'none' }}>Learn how it works</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Session */}
      {stage !== 'welcome' && (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', padding: '32px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
              padding: '24px 32px',
              marginBottom: '32px',
              border: '3px solid #fde047'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    🎥
                  </div>
                  <div>
                    <h1 style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: '0 0 4px 0',
                      fontFamily: "'Fredoka', 'Inter', sans-serif"
                    }}>
                      Video Interview Practice
                    </h1>
                    <p style={{ 
                      fontSize: '16px', 
                      color: '#6b7280', 
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      {stage === 'planning' && '🧠 Plan your answer - think about key points to cover'}
                      {stage === 'recording' && '🎬 Recording in progress - speak clearly and confidently!'}
                      {stage === 'playback' && '👀 Review your response before submitting'}
                      {stage === 'feedback' && '🤖 AI analysis complete - review your feedback'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (checkCanUseVideoInterview()) {
                        getRandomQuestionAndTrackUsage();
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      backgroundColor: '#fde047',
                      color: '#000',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    <Shuffle style={{ width: '16px', height: '16px' }} />
                    New Question
                  </button>
                  <button
                    onClick={resetPractice}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      fontWeight: '500',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Exit Practice
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? '16px' : '32px', alignItems: 'start' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                padding: isMobile ? '16px' : '32px',
                border: '3px solid #fde047',
                minHeight: isMobile ? 'auto' : '500px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                  padding: '20px',
                  backgroundColor: stage === 'planning' ? '#dbeafe' : '#fef2f2',
                  borderRadius: '16px',
                  border: `2px solid ${stage === 'planning' ? '#3b82f6' : '#ef4444'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: stage === 'planning' ? '#3b82f6' : '#ef4444',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}>
                      {stage === 'planning' ? '🧠' : '🎬'}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: stage === 'planning' ? '#1e40af' : '#dc2626',
                        margin: '0'
                      }}>
                        {stage === 'planning' ? 'Planning Time' : 'Recording Time'}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                        {stage === 'planning' ? 'Think about your answer' : 'Speak clearly and confidently'}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: isMobile ? '32px' : '48px',
                      fontWeight: 'bold',
                      color: stage === 'planning' ? '#1e40af' : '#dc2626',
                      fontFamily: 'monospace',
                      lineHeight: '1'
                    }}>
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '16px'
                  }}>
                    {currentQuestion.category}
                  </div>
                  <h2 style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    lineHeight: '1.2',
                    margin: '0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                border: '3px solid #fde047',
                position: 'sticky',
                top: '24px'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    aspectRatio: '4/3',
                    backgroundColor: '#1f2937',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    border: '3px solid #374151'
                  }}>
                    <video
                      ref={videoRef}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      autoPlay={stage === 'planning' || stage === 'recording'}
                      controls={stage === 'playback'}
                      muted={stage === 'planning'}
                      playsInline
                      onLoadedData={() => {
                        if (stage === 'playback') {
                          console.log('🎬 Video loaded for playback');
                        }
                      }}
                      onError={(e) => {
                        console.error('❌ Video error:', e);
                      }}
                    />
                    
                    {!streamRef.current && stage === 'planning' && (
                      <div style={{
                        position: 'absolute',
                        inset: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '16px'
                      }}>
                        <div style={{ fontSize: '48px' }}>📹</div>
                        <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>
                          Camera will start automatically
                        </p>
                      </div>
                    )}
                    
                    {isRecording && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite'
                        }}></div>
                        REC
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stage === 'planning' && timeLeft <= 0 && (
                    <button
                      onClick={startRecording}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>
                      Start Recording 🎬
                    </button>
                  )}

                  {stage === 'planning' && timeLeft > 0 && (
                    <button
                      onClick={() => setTimeLeft(0)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Play style={{ width: '16px', height: '16px' }} />
                      Ready to Record ⚡
                    </button>
                  )}

                  {stage === 'recording' && (
                    <button
                      onClick={stopRecording}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(55, 65, 81, 0.3)'
                      }}
                    >
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#ffffff', borderRadius: '2px' }}></div>
                      Stop Recording ⏹️
                    </button>
                  )}

                  {stage === 'playback' && (
                    <button
                      onClick={submitForFeedback}
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        background: isSubmitting 
                          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #ffffff',
                            borderTop: '2px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Analyzing... 🤖
                        </>
                      ) : (
                        <>
                          <CheckCircle style={{ width: '20px', height: '20px' }} />
                          Submit Answer ✨
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Feedback Section - Moved upwards with 2-column layout */}
            {stage === 'feedback' && feedback && (
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
                {/* Left Column - Main Feedback */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Score Breakdown - Compact Progress Bars */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '20px',
                  border: '2px solid #fde047'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 0 16px 0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    📊 Score Breakdown
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { label: 'Clarity', score: feedback.clarity, description: 'How clear and articulate your speech was', emoji: '🗣️', color: '#3b82f6' },
                      { label: 'Confidence', score: feedback.confidence, description: 'Your level of confidence and composure', emoji: '💪', color: '#8b5cf6' },
                      { label: 'Relevance', score: feedback.relevance, description: 'How well you answered the question', emoji: '🎯', color: '#10b981' }
                    ].map((item) => (
                      <div key={item.label} style={{
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: 'bold',
                              color: '#1f2937'
                            }}>
                              {item.label}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: item.color,
                            fontFamily: 'monospace'
                          }}>
                            {item.score}/10
                          </div>
                        </div>
                        
                        {/* Compact animated progress bar */}
                        <div style={{
                          width: '100%',
                          height: '8px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginBottom: '6px'
                        }}>
                          <div style={{
                            width: `${(item.score / 10) * 100}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                            borderRadius: '6px',
                            transition: 'width 1s ease-out',
                            position: 'relative'
                          }}>
                            {/* Shine effect */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              animation: 'shine 2s infinite'
                            }}></div>
                          </div>
                        </div>
                        
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '0',
                          fontStyle: 'italic'
                        }}>
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transcript - Compact Speech Bubble Style */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '20px',
                  border: '2px solid #8b5cf6'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 0 12px 0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    💬 What You Said
                  </h3>
                  
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    position: 'relative'
                  }}>
                    {/* Speech bubble tail */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '24px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderTop: 'none',
                      borderLeft: 'none',
                      transform: 'rotate(45deg)'
                    }}></div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#374151',
                      lineHeight: '1.5',
                      margin: '0'
                    }}>
                      {feedback.transcript.split(' ').map((word, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: feedback.fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, '')) 
                              ? '#fef3c7' : 'transparent',
                            padding: feedback.fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, '')) 
                              ? '2px 4px' : '0',
                            borderRadius: feedback.fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, '')) 
                              ? '4px' : '0',
                            fontWeight: feedback.fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, '')) 
                              ? 'bold' : 'normal'
                          }}
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                  </div>
                  
                  {feedback.fillerWords.length > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        margin: '0 0 8px 0'
                      }}>
                        ⚠️ Filler words detected:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {feedback.fillerWords.map((word, index) => (
                          <span key={index} style={{
                            padding: '4px 8px',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            border: '1px solid #fbbf24'
                          }}>
                            "{word}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Strengths and Improvements - Compact Side by Side Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
                  
                  {/* Strengths */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    border: '2px solid #10b981'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#059669',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 0 12px 0',
                      fontFamily: "'Fredoka', 'Inter', sans-serif"
                    }}>
                      ✨ Your Strengths
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {feedback.strengths && feedback.strengths.length > 0 ? (
                        feedback.strengths.map((strength, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '12px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '8px',
                            border: '1px solid #bbf7d0'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#10b981',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '12px'
                            }}>
                              ✓
                            </div>
                            <span style={{
                              fontSize: '13px',
                              color: '#065f46',
                              fontWeight: '500',
                              lineHeight: '1.4'
                            }}>
                              {strength}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div style={{
                          padding: '16px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontStyle: 'italic',
                          fontSize: '12px'
                        }}>
                          Keep practicing to build on your strengths! 💪
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    border: '2px solid #f97316'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ea580c',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      margin: '0 0 12px 0',
                      fontFamily: "'Fredoka', 'Inter', sans-serif"
                    }}>
                      🚀 Growth Areas
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {feedback.improvements.map((improvement, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '12px',
                          backgroundColor: '#fff7ed',
                          borderRadius: '8px',
                          border: '1px solid #fed7aa'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#f97316',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '12px'
                          }}>
                            💡
                          </div>
                          <span style={{
                            fontSize: '13px',
                            color: '#9a3412',
                            fontWeight: '500',
                            lineHeight: '1.4'
                          }}>
                            {improvement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                </div>
                
                {/* Right Column - Compact Score Card */}
                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Compact Analysis Complete Card */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px 16px',
                    textAlign: 'center',
                    border: '2px solid #10b981',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Confetti background effect */}
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
                      backgroundSize: '15px 15px',
                      opacity: 0.3
                    }}></div>
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{
                        fontSize: '36px',
                        marginBottom: '8px'
                      }}>
                        {feedback.overallScore >= 8 ? '🎉' : feedback.overallScore >= 6 ? '👏' : '💪'}
                      </div>
                      
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '4px',
                        fontFamily: "'Fredoka', 'Inter', sans-serif",
                        margin: '0 0 4px 0'
                      }}>
                        🤖 Analysis Complete!
                      </h3>
                      
                      <div style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '4px',
                        fontFamily: 'monospace'
                      }}>
                        {feedback.overallScore}/10
                      </div>
                      
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '0',
                        fontWeight: '500'
                      }}>
                        {feedback.overallScore >= 8 ? 'Outstanding! 🌟' : 
                         feedback.overallScore >= 6 ? 'Great Job! 🚀' : 
                         'Keep improving! 💪'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Compact */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <button
                      onClick={async () => {
                        // Properly restart the entire video interview process
                        console.log('🔄 Starting new question...');
                        
                        // 1. Stop current camera stream
                        if (streamRef.current) {
                          streamRef.current.getTracks().forEach(track => track.stop());
                          streamRef.current = null;
                        }
                        
                        // 2. Reset all states
                        setFeedback(null);
                        setRecordedBlob(null);
                        setIsRecording(false);
                        setTimeLeft(60);
                        
                        // 3. Get new question (with paywall check)
                        const canProceed = checkCanUseVideoInterview();
                        if (!canProceed) {
                          return; // Paywall triggered, stop here
                        }
                        getRandomQuestionAndTrackUsage();
                        
                        // 4. Go to planning stage
                        setStage('planning');
                        
                        // 5. Initialize camera and start fresh
                        try {
                          console.log('📷 Initializing camera for new question...');
                          const stream = await navigator.mediaDevices.getUserMedia({ 
                            video: true, 
                            audio: true 
                          });
                          streamRef.current = stream;
                          
                          console.log('✅ Camera initialized, starting planning phase...');
                        } catch (error) {
                          console.error('❌ Failed to initialize camera:', error);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: '#ffffff',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Fredoka', 'Inter', sans-serif",
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      <Shuffle style={{ width: '16px', height: '16px' }} />
                      Next Question 🎯
                    </button>
                    
                    <button
                      onClick={() => router.push('/dashboard')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Fredoka', 'Inter', sans-serif",
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#9ca3af';
                        e.currentTarget.style.color = '#374151';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.color = '#6b7280';
                      }}
                    >
                      <ArrowLeft style={{ width: '16px', height: '16px' }} />
                      Back to Dashboard 🏠
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works Modal */}
      {showHowItWorksModal && (
        <div 
          onClick={(e) => {
            // Close modal when clicking background
            if (e.target === e.currentTarget) {
              setShowHowItWorksModal(false);
            }
          }}
          style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: isMobile ? '20px' : '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: isMobile ? '20px' : '16px',
            maxWidth: isMobile ? '100%' : '32rem',
            width: '100%',
            padding: isMobile ? '24px' : '32px',
            position: 'relative',
            maxHeight: isMobile ? '90vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowHowItWorksModal(false);
              }}
              onTouchStart={isMobile ? (e) => {
                e.stopPropagation();
                e.currentTarget.style.transform = 'scale(0.9)';
              } : undefined}
              onTouchEnd={isMobile ? (e) => {
                e.stopPropagation();
                e.currentTarget.style.transform = 'scale(1)';
                setShowHowItWorksModal(false);
              } : undefined}
              style={{
                position: 'absolute',
                top: isMobile ? '12px' : '16px',
                right: isMobile ? '12px' : '16px',
                color: '#9ca3af',
                backgroundColor: isMobile ? '#f3f4f6' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? '18px' : '24px',
                padding: isMobile ? '8px' : '4px',
                borderRadius: isMobile ? '50%' : '0',
                width: isMobile ? '32px' : 'auto',
                height: isMobile ? '32px' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            
            <h2 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: isMobile ? '20px' : '24px',
              margin: isMobile ? '0 40px 20px 0' : '0 0 24px 0'
            }}>
              How Video Interview Practice Works
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: isMobile ? '16px' : '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px', margin: '0 0 4px 0', fontSize: isMobile ? '14px' : '16px' }}>Get Your Question</h3>
                    <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#6b7280', margin: '0', lineHeight: '1.4' }}>A random interview question appears on your screen</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px', margin: '0 0 4px 0' }}>Plan Your Answer</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Take 60 seconds to think and structure your response</p>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px', margin: '0 0 4px 0' }}>Record Your Answer</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Record a 1-minute video response with clear audio</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    4
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px', margin: '0 0 4px 0' }}>Get AI Feedback</h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Receive detailed analysis on clarity, confidence, and content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes sparkle {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          50% { 
            transform: rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
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
  );
}