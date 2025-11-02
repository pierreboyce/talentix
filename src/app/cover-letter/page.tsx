"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { Upload, FileText, Briefcase, Wand2, Edit3, Download, Copy, RefreshCw, ArrowLeft } from 'lucide-react';
import AuthGuard from '../../components/AuthGuard';

interface CoverLetterData {
  cv: string;
  jobDescription: string;
  generatedLetter: string;
  isGenerating: boolean;
}

export default function CoverLetterGenerator(): React.ReactElement {
  const { user, loading } = useAuth();
  const { addPoints } = usePoints();
  const { isMobile, isTablet } = useDeviceDetection();
  const router = useRouter();
  
  const [data, setData] = useState<CoverLetterData>({
    cv: '',
    jobDescription: '',
    generatedLetter: '',
    isGenerating: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedLetter, setEditedLetter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📄 File selected:', file.name, file.type, file.size);

    // Show loading state
    setData(prev => ({ ...prev, cv: 'Extracting text from file...' }));

    try {
      // Use the text extraction API
      const formData = new FormData();
      formData.append('file', file);

      console.log('🌐 Sending file to extraction API...');
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract text from file');
      }

      const result = await response.json();
      console.log('✅ Text extraction successful:', result.metadata);

      setData(prev => ({ 
        ...prev, 
        cv: result.text 
      }));

      // Show success message with file info
      alert(`✅ Text extracted successfully from "${result.metadata.fileName}"!\n\n📊 Stats:\n• ${result.metadata.wordCount} words\n• ${result.metadata.textLength} characters\n\nYou can now edit the extracted text if needed.`);

    } catch (error) {
      console.error('❌ File extraction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Clear the loading state and show error
      setData(prev => ({ ...prev, cv: '' }));
      alert(`❌ Failed to extract text from file: ${errorMessage}\n\nPlease try:\n• Using a different file format (PDF, DOCX, TXT)\n• Copying and pasting your CV text manually`);
    }
  };

  const generateCoverLetter = async () => {
    if (!data.cv.trim() || !data.jobDescription.trim()) {
      alert('Please provide both your CV and job description!');
      return;
    }

    setData(prev => ({ ...prev, isGenerating: true, generatedLetter: '' }));
    
    try {
      const response = await fetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cv: data.cv,
          jobDescription: data.jobDescription,
          userId: user?.id || 'anonymous'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const result = await response.json();
      
      // Simulate typewriter effect
      await typewriterEffect(result.coverLetter);
      
      addPoints(20, 'Generated a cover letter');
      
    } catch (error) {
      console.error('Error generating cover letter:', error);
      
      // Show error message instead of fallback content
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to generate cover letter: ${errorMessage}\n\nPlease ensure your AI provider (OpenAI or Groq) is properly configured in your .env.local file.`);
      
      setData(prev => ({ ...prev, isGenerating: false }));
      return;
    } finally {
      setData(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const typewriterEffect = async (text: string) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      const speed = 20; // milliseconds per character
      
      const typeChar = () => {
        if (index < text.length) {
          setData(prev => ({ 
            ...prev, 
            generatedLetter: text.substring(0, index + 1)
          }));
          index++;
          setTimeout(typeChar, speed);
        } else {
          resolve();
        }
      };
      
      typeChar();
    });
  };

  const handleEdit = () => {
    setEditedLetter(data.generatedLetter);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setData(prev => ({ ...prev, generatedLetter: editedLetter }));
    setIsEditing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.generatedLetter);
    alert('Cover letter copied to clipboard!');
  };

  const exportToPDF = () => {
    // Create a simple text file download for demo
    const element = document.createElement('a');
    const file = new Blob([data.generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover-letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    addPoints(5, 'Exported cover letter');
  };

  const resetAll = () => {
    setData({
      cv: '',
      jobDescription: '',
      generatedLetter: '',
      isGenerating: false
    });
    setIsEditing(false);
    setEditedLetter('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #ffffff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading Cover Letter Generator...
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: isMobile ? '12px' : '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: isMobile ? '16px' : '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px',
          marginBottom: '16px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '14px 20px' : '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: isMobile ? '15px' : '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              minHeight: isMobile ? '48px' : 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Dashboard
          </button>

          <button
            onClick={resetAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '14px 20px' : '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: isMobile ? '15px' : '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              minHeight: isMobile ? '48px' : 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Reset All
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '24px 16px' : '32px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: '0 0 8px 0',
            fontFamily: "'Fredoka', 'Inter', sans-serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            lineHeight: isMobile ? '1.2' : 'normal'
          }}>
            ✨ Cover Letter Magic
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            color: '#ffffff',
            margin: '0',
            opacity: 0.9,
            lineHeight: '1.4'
          }}>
            AI-powered cover letters that get you noticed! 🚀
          </p>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr',
        gap: isMobile ? '16px' : '24px',
        minHeight: isMobile ? 'auto' : '600px'
      }}>
        {/* Left Side - Input Area */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '20px' : '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '16px' : '24px'
        }}>
          <h2 style={{
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0',
            fontFamily: "'Fredoka', 'Inter', sans-serif",
            textAlign: 'center'
          }}>
            📝 Your Information
          </h2>

          {/* CV Upload Section */}
          <div style={{
            border: '3px dashed #e5e7eb',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '16px' : '24px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            backgroundColor: data.cv.includes('Extracting text from file...') ? '#fef3c7' : data.cv ? '#f0fdf4' : '#fafafa'
          }}>
            <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: isMobile ? '12px' : '16px' }}>📄</div>
            <h3 style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Upload Your CV
            </h3>
            <p style={{
              color: '#6b7280',
              margin: '0 0 12px 0',
              fontSize: '14px'
            }}>
              Upload Word (.docx) or text files - or paste your CV text below
            </p>
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '12px',
              margin: '0 0 16px 0'
            }}>
              <p style={{
                color: '#92400e',
                margin: '0 0 8px 0',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                📄 PDF files not supported yet
              </p>
              <p style={{
                color: '#92400e',
                margin: '0',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                Please convert your PDF to Word (.docx) or copy/paste the text manually. Word documents work perfectly!
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('🔥 COVER LETTER FILE UPLOAD BUTTON CLICKED ON MOBILE:', isMobile);
                  console.log('🔥 Current URL:', window.location.href);
                  console.log('🔥 File input ref:', fileInputRef.current);
                  
                  if (fileInputRef.current) {
                    console.log('🔥 Attempting to trigger file input...');
                    fileInputRef.current.click();
                    console.log('🔥 File input clicked!');
                  } else {
                    console.error('🔥 File input ref is null!');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '14px 24px' : '12px 20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: isMobile ? '10px' : '12px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '16px' : '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minHeight: isMobile ? '48px' : 'auto', // Better touch target on mobile
                  minWidth: isMobile ? '120px' : 'auto',
                  position: 'relative',
                  zIndex: 10000 // Ensure button is above any overlays
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Upload style={{ width: '16px', height: '16px' }} />
                Upload File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <div style={{ margin: '16px 0', color: '#9ca3af', fontSize: '14px' }}>or</div>

            <textarea
              value={data.cv}
              onChange={(e) => setData(prev => ({ ...prev, cv: e.target.value }))}
              placeholder="Paste your CV content here..."
              onClick={(e) => {
                e.stopPropagation();
                console.log('🔥 CV TEXTAREA CLICKED ON MOBILE:', isMobile);
                // Focus the textarea to ensure it's active
                e.currentTarget.focus();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                console.log('🔥 CV TEXTAREA TOUCH START ON MOBILE:', isMobile);
              }}
              style={{
                width: '100%',
                height: isMobile ? '100px' : '120px',
                padding: isMobile ? '14px' : '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
                resize: 'vertical',
                outline: 'none',
                position: 'relative',
                zIndex: 10001 // Higher than upload button to ensure it's above overlays
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                console.log('🔥 CV TEXTAREA FOCUSED');
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                console.log('🔥 CV TEXTAREA BLURRED');
              }}
            />
          </div>

          {/* Job Description Section */}
          <div style={{
            border: '3px solid #e5e7eb',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '16px' : '24px',
            backgroundColor: data.jobDescription ? '#fef3c7' : '#ffffff'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: isMobile ? '36px' : '48px', marginBottom: '8px' }}>💼</div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Job Description
              </h3>
              <p style={{
                color: '#6b7280',
                margin: '0',
                fontSize: '14px'
              }}>
                Paste the job posting you're applying for
              </p>
            </div>

            <textarea
              value={data.jobDescription}
              onChange={(e) => setData(prev => ({ ...prev, jobDescription: e.target.value }))}
              placeholder="Paste the job description here..."
              onClick={(e) => {
                e.stopPropagation();
                console.log('🔥 JOB DESCRIPTION TEXTAREA CLICKED ON MOBILE:', isMobile);
                // Focus the textarea to ensure it's active
                e.currentTarget.focus();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                console.log('🔥 JOB DESCRIPTION TEXTAREA TOUCH START ON MOBILE:', isMobile);
              }}
              style={{
                width: '100%',
                height: isMobile ? '120px' : '150px',
                padding: isMobile ? '14px' : '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
                resize: 'vertical',
                outline: 'none',
                position: 'relative',
                zIndex: 10001 // Higher than upload button to ensure it's above overlays
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#f59e0b';
                console.log('🔥 JOB DESCRIPTION TEXTAREA FOCUSED');
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                console.log('🔥 JOB DESCRIPTION TEXTAREA BLURRED');
              }}
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              console.log('🔥 GENERATE COVER LETTER BUTTON CLICKED ON MOBILE:', isMobile);
              console.log('🔥 Current URL:', window.location.href);
              console.log('🔥 Button disabled:', data.isGenerating || !data.cv.trim() || !data.jobDescription.trim());
              
              // Only proceed if button is not disabled
              if (!data.isGenerating && data.cv.trim() && data.jobDescription.trim()) {
                console.log('🔥 Calling generateCoverLetter function...');
                generateCoverLetter();
                console.log('🔥 generateCoverLetter function called!');
              } else {
                console.log('🔥 Button is disabled or missing data');
              }
            }}
            disabled={data.isGenerating || !data.cv.trim() || !data.jobDescription.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '8px' : '12px',
              padding: isMobile ? '18px 24px' : '16px 32px',
              background: data.isGenerating 
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: isMobile ? '12px' : '16px',
              cursor: data.isGenerating ? 'not-allowed' : 'pointer',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
              fontFamily: "'Fredoka', 'Inter', sans-serif",
              minHeight: isMobile ? '56px' : 'auto', // Better touch target on mobile
              width: isMobile ? '100%' : 'auto',
              position: 'relative',
              zIndex: 10002 // Higher than textareas to ensure it's above all overlays
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              console.log('🔥 GENERATE BUTTON TOUCH START ON MOBILE:', isMobile);
            }}
            onMouseEnter={(e) => {
              if (!data.isGenerating) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!data.isGenerating) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
              }
            }}
          >
            {data.isGenerating ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Generating Magic...
              </>
            ) : (
              <>
                <Wand2 style={{ width: '24px', height: '24px' }} />
                ✨ Generate Cover Letter
              </>
            )}
          </button>
        </div>

        {/* Right Side - Generated Letter */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '20px' : '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '16px' : '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '0'
          }}>
            <h2 style={{
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              📜 Your Cover Letter
            </h2>

            {data.generatedLetter && (
              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '6px' : '8px',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <button
                  onClick={handleEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isMobile ? '10px 14px' : '8px 16px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    color: '#374151',
                    transition: 'all 0.2s ease',
                    minHeight: isMobile ? '40px' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  <Edit3 style={{ width: '14px', height: '14px' }} />
                  ✏️ Edit
                </button>

                <button
                  onClick={copyToClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isMobile ? '10px 14px' : '8px 16px',
                    backgroundColor: '#dbeafe',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    color: '#1d4ed8',
                    transition: 'all 0.2s ease',
                    minHeight: isMobile ? '40px' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#bfdbfe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dbeafe';
                  }}
                >
                  <Copy style={{ width: '14px', height: '14px' }} />
                  Copy
                </button>

                <button
                  onClick={exportToPDF}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: isMobile ? '10px 14px' : '8px 16px',
                    backgroundColor: '#dcfce7',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: '600',
                    color: '#166534',
                    transition: 'all 0.2s ease',
                    minHeight: isMobile ? '40px' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#bbf7d0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dcfce7';
                  }}
                >
                  <Download style={{ width: '14px', height: '14px' }} />
                  📥 Export
                </button>
              </div>
            )}
          </div>

          {/* Letter Content */}
          <div style={{
            flex: 1,
            border: '2px solid #e5e7eb',
            borderRadius: isMobile ? '12px' : '16px',
            padding: isMobile ? '16px' : '24px',
            backgroundColor: '#fafafa',
            position: 'relative',
            minHeight: isMobile ? '300px' : '400px'
          }}>
            {!data.generatedLetter && !data.isGenerating && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9ca3af',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: isMobile ? '12px' : '16px' }}>✨</div>
                <h3 style={{ fontSize: isMobile ? '18px' : '20px', margin: '0 0 8px 0' }}>Ready for Magic?</h3>
                <p style={{ margin: '0', fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '0 10px' : '0' }}>Upload your CV and job description to generate your cover letter!</p>
              </div>
            )}

            {isEditing ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <textarea
                  value={editedLetter}
                  onChange={(e) => setEditedLetter(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔥 EDIT TEXTAREA CLICKED ON MOBILE:', isMobile);
                    e.currentTarget.focus();
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    console.log('🔥 EDIT TEXTAREA TOUCH START ON MOBILE:', isMobile);
                  }}
                  style={{
                    width: '100%',
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
                    lineHeight: '1.6',
                    resize: 'none',
                    fontFamily: "'Inter', sans-serif",
                    position: 'relative',
                    zIndex: 10001 // Ensure it's above overlays
                  }}
                />
                <div style={{
                  display: 'flex',
                  gap: isMobile ? '8px' : '12px',
                  justifyContent: isMobile ? 'center' : 'flex-end',
                  marginTop: '16px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: isMobile ? '12px 20px' : '8px 16px',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '16px' : '14px',
                      fontWeight: '600',
                      minHeight: isMobile ? '44px' : 'auto'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    style={{
                      padding: isMobile ? '12px 20px' : '8px 16px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '16px' : '14px',
                      fontWeight: '600',
                      minHeight: isMobile ? '44px' : 'auto'
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div
                ref={typewriterRef}
                style={{
                  fontSize: isMobile ? '15px' : '14px', // Slightly larger on mobile for readability
                  lineHeight: '1.6',
                  color: '#374151',
                  whiteSpace: 'pre-wrap',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {data.generatedLetter}
                {data.isGenerating && (
                  <span style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '16px',
                    backgroundColor: '#3b82f6',
                    animation: 'blink 1s infinite',
                    marginLeft: '2px'
                  }} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
    </AuthGuard>
  );
}
