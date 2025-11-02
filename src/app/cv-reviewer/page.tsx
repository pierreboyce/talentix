"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useRouter } from 'next/navigation';
import { Upload, Download, Edit3, FileText, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import PaywallGuard from '../../components/PaywallGuard';
import AuthGuard from '../../components/AuthGuard';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

interface CVFeedback {
  score: number;
  overallFeedback: string;
  sections: {
    section: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  strengths: string[];
  improvements: string[];
}

interface CVTemplate {
  personalInfo: {
    name: string;
    email: string;
    address: string;
    mobile: string;
  };
  personalSummary: {
    intro: string;
    aim: string;
    skills: string;
    link: string;
    availability: string;
  };
  workExperience: Array<{
    company: string;
    position: string;
    dates: string;
    context: string;
    action: string;
    result: string;
  }>;
  relevantExperience: Array<{
    dates: string;
    context: string;
    action: string;
    result: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  education: {
    aLevel: {
      school: string;
      dates: string;
      subjects: string;
    };
    secondary: {
      school: string;
      dates: string;
      gcses: string;
    };
  };
}

export default function CVReviewer() {
  const router = useRouter();
  const { user } = useAuth();
  const { addPoints } = usePoints(); // Use shared points context
  const { updateQuestProgress } = useQuests(); // Use quest system
  const { canAccess, subscription } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useDeviceDetection();
  
  const [currentView, setCurrentView] = useState<'upload' | 'feedback' | 'edit'>(() => {
    // Check URL parameters for view
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'upload' || viewParam === 'feedback' || viewParam === 'edit') {
        console.log('🔗 URL parameter set view to:', viewParam);
        return viewParam;
      }
    }
    return 'upload';
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [feedback, setFeedback] = useState<CVFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(0); // Track CV reviews today
  const [showProPopup, setShowProPopup] = useState(false); // Show Pro upgrade popup
  
  // Initialize daily usage from localStorage (user-specific)
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.email) {
      const today = new Date().toDateString();
      const cvUsageKey = `cv_reviews_${today}_${user.email}`;
      const todayUsage = parseInt(localStorage.getItem(cvUsageKey) || '0');
      setDailyUsage(todayUsage);
    }
  }, [user?.email]);
  
  const [cvTemplate, setCvTemplate] = useState<CVTemplate>({
    personalInfo: {
      name: '',
      email: '',
      address: '',
      mobile: ''
    },
    personalSummary: {
      intro: '',
      aim: '',
      skills: '',
      link: '',
      availability: ''
    },
    workExperience: [],
    relevantExperience: [],
    skills: [],
    education: {
      aLevel: {
        school: '',
        dates: '',
        subjects: ''
      },
      secondary: {
        school: '',
        dates: '',
        gcses: ''
      }
    }
  });

  const processFile = async (file: File) => {
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain'
    ];
    
    if (file && (supportedTypes.includes(file.type) || file.type.startsWith('text/'))) {
      setUploadedFile(file);
      
      try {
        let extractedText = '';
        
        if (file.type.startsWith('text/')) {
          // Read text file directly
          extractedText = await file.text();
        } else if (file.type === 'application/pdf') {
          // Extract text from PDF
          const arrayBuffer = await file.arrayBuffer();
          const response = await fetch('/api/cv/extract-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer
          });
          
          if (response.ok) {
            const result = await response.json();
            extractedText = result.text || `Failed to extract text from PDF: ${file.name}`;
          } else {
            const errorData = await response.json();
            extractedText = `Error processing PDF: ${file.name}. ${errorData.details || 'Unknown error'}`;
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   file.type === 'application/msword') {
          // Extract text from Word document
          const arrayBuffer = await file.arrayBuffer();
          const response = await fetch('/api/cv/extract-word', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: arrayBuffer
          });
          
          if (response.ok) {
            const result = await response.json();
            extractedText = result.text || `Failed to extract text from Word document: ${file.name}`;
          } else {
            const errorData = await response.json();
            extractedText = `Error processing Word document: ${file.name}. ${errorData.details || 'Unknown error'}`;
          }
        }
        
        setCvText(extractedText);
        
        // Try to extract basic info from the text for template population
        const lines = extractedText.split('\n').filter(line => line.trim());
        const firstLine = lines[0] || 'Your Name';
        
        // Basic extraction - in production you'd use more sophisticated parsing
        const emailMatch = extractedText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        const phoneMatch = extractedText.match(/(\+44|0)[\d\s\-\(\)]{10,}/);
        
        // Populate template with extracted data where possible, fallback to placeholders
        setCvTemplate({
          personalInfo: {
            name: firstLine.length > 50 ? 'Your Name' : firstLine,
            email: emailMatch ? emailMatch[0] : 'your.email@example.com',
            address: 'Your Address',
            mobile: phoneMatch ? phoneMatch[0] : 'Your Phone Number'
          },
        personalSummary: {
          intro: 'Discuss who you are: "I am a [INSERT SKILL] student"',
          aim: 'Discuss what you\'re looking for: "I am looking for part-time work in the [INSERT FIELD] sector"',
          skills: 'Discuss your relevant skills: "I have [INSERT SKILL] skills and [INSERT SKILL] expertise which would be suitable for this role"',
          link: 'Link this to the role: "with proficient [XX] and X skills"',
          availability: 'Able to work flexible hours'
        },
        workExperience: [
          {
            company: 'Tech Company',
            position: 'Software Developer',
            dates: '2021 - Present',
            context: 'In summary, what was the experience? Describe it and if you gained it through a competition or application this is a good place to mention that.',
            action: 'More detail on the experience - what did you do or contribute to this experience? Include concrete examples.',
            result: 'What was the outcome? Include quantifiable, concrete examples or skills you developed or something you learnt'
          }
        ],
        relevantExperience: [
          {
            dates: '2020 - 2021',
            context: 'In summary, what was the experience? Describe it and if you gained it through a competition or application this is a good place to mention that',
            action: 'More detail on the experience - what did you do or contribute to this experience? Include concrete examples',
            result: 'What was the outcome? Include quantifiable, concrete examples or skills you developed or something you learnt'
          }
        ],
        skills: [
          {
            category: 'Skill #1',
            items: ['When did you use this skill? Give a practical example as well as an outcome.']
          },
          {
            category: 'Skill #2', 
            items: ['When did you use this skill? Give a practical example as well as an outcome.']
          },
          {
            category: 'Skill #3',
            items: ['When did you use this skill? Give a practical example as well as an outcome.']
          }
        ],
        education: {
          aLevel: {
            school: 'A Level / College School Name',
            dates: '20XX - 20XX',
            subjects: 'A-levels: XXX (Grade), XXX (Grade), XXX (Grade)'
          },
          secondary: {
            school: 'Secondary School Name',
            dates: '20XX - 20XX',
            gcses: 'GCSEs: XX GCSEs (insert grade range e.g., A*- C or 9-7), including a (X) in Mathematics and (X) in English Language'
          }
        }
      });
      
      } catch (error) {
        console.error('Error reading file:', error);
        // Fallback to basic template if file reading fails
        setCvText(`Error reading file: ${file.name}\nPlease try uploading a text file (.txt) instead.`);
        setCvTemplate({
          personalInfo: {
            name: 'Your Name',
            email: 'your.email@example.com',
            address: 'Your Address',
            mobile: 'Your Phone Number'
          },
          personalSummary: {
            intro: 'Discuss who you are: "I am a [INSERT SKILL] student"',
            aim: 'Discuss what you\'re looking for: "I am looking for part-time work in the [INSERT FIELD] sector"',
            skills: 'Discuss your relevant skills: "I have [INSERT SKILL] skills and [INSERT SKILL] expertise which would be suitable for this role"',
            link: 'Link this to the role: "with proficient [XX] and X skills"',
            availability: 'Able to work flexible hours'
          },
          workExperience: [],
          relevantExperience: [],
          skills: [],
          education: {
            aLevel: {
              school: 'A Level / College School Name',
              dates: '20XX - 20XX',
              subjects: 'A-levels: XXX (Grade), XXX (Grade), XXX (Grade)'
            },
            secondary: {
              school: 'Secondary School Name',
              dates: '20XX - 20XX',
              gcses: 'GCSEs: XX GCSEs (insert grade range e.g., A*- C or 9-7), including a (X) in Mathematics and (X) in English Language'
            }
          }
        });
      }
    } else {
      console.error('🔥 Unsupported file type:', file?.type);
      alert('Please upload a supported file type: PDF, Word document (.doc/.docx), or text file (.txt)');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  // Drag and drop handlers for mobile
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      await processFile(file);
    }
  };

  // Emergency analyze function with complete isolation
  const emergencyAnalyze = async () => {
    
    if (!cvText) {
      alert('❌ No CV text available! Please upload a file first.');
      return;
    }
    
    if (isAnalyzing) {
      return;
    }
    
    // Check subscription limits
    if (subscription.tier === 'free' && dailyUsage >= 1) {
      alert('💰 Free tier limit reached! Upgrade to Pro for unlimited CV reviews.');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText })
      });
      
      console.log('📡 Emergency API Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Emergency CV analysis result:', result);
        setFeedback(result);
        
        // Force immediate view switch
        console.log('🔄 Emergency view switch to feedback...');
        setCurrentView('feedback');
        
        // Award points
        if (result.points) {
          addPoints(result.points, `CV analysis scored ${result.score}/5`);
        }
        
        // Update quest progress
        updateQuestProgress('cv_analysis', 1);
        if (result.score >= 4) {
          updateQuestProgress('cv_optimizer', 1);
        }
        
        // Track usage
        if (user?.email) {
          const today = new Date().toDateString();
          const cvUsageKey = `cv_reviews_${today}_${user.email}`;
          const currentUsage = parseInt(localStorage.getItem(cvUsageKey) || '0');
          const newUsage = currentUsage + 1;
          localStorage.setItem(cvUsageKey, newUsage.toString());
          
          const totalKey = `total_cv_reviews_${user.email}`;
          const totalReviews = parseInt(localStorage.getItem(totalKey) || '0');
          localStorage.setItem(totalKey, (totalReviews + 1).toString());
          
          localStorage.setItem(`last_cv_update_${user.email}`, new Date().toISOString());
          setDailyUsage(newUsage);
        }
        
        // Auto-switch to feedback view after successful analysis
        setTimeout(() => {
          setCurrentView('feedback');
        }, 100);
        alert('✅ Analysis complete! View switched to feedback.');
      } else {
        alert('❌ Analysis failed. Please try again.');
      }
    } catch (error) {
      alert('❌ Analysis error. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async (e?: React.MouseEvent) => {
    // Prevent navigation interference on mobile
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    
    if (!cvText) {
      console.log('❌ No CV text available for analysis');
      return;
    }
    
    // Check subscription limits for free tier users
    if (subscription.tier === 'free' && dailyUsage >= 1) {
      // Show Pro upgrade popup
      setShowProPopup(true);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText })
      });
      
      console.log('📡 API Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ CV analysis result received:', result);
        setFeedback(result);
        
        // Force view change with timeout to prevent navigation interference
        console.log('🔄 Switching to feedback view...');
        setTimeout(() => {
          setCurrentView('feedback');
          console.log('✅ View switched to feedback');
        }, 100);
        
        // Award points based on CV analysis
        if (result.points) {
          addPoints(result.points, `CV analysis scored ${result.score}/5`);
        }
        
        // Update quest progress
        updateQuestProgress('cv_analysis', 1);
        
        // Check for high score achievement
        if (result.score >= 4) {
          updateQuestProgress('cv_optimizer', 1);
        }
        
        // Track usage in localStorage for accurate reporting (user-specific)
        if (user?.email) {
          const today = new Date().toDateString();
          const cvUsageKey = `cv_reviews_${today}_${user.email}`;
          const currentUsage = parseInt(localStorage.getItem(cvUsageKey) || '0');
          const newUsage = currentUsage + 1;
          localStorage.setItem(cvUsageKey, newUsage.toString());
          
          // Track total CV reviews (user-specific)
          const totalKey = `total_cv_reviews_${user.email}`;
          const totalReviews = parseInt(localStorage.getItem(totalKey) || '0');
          localStorage.setItem(totalKey, (totalReviews + 1).toString());
          
          // Update last CV update time (user-specific)
          localStorage.setItem(`last_cv_update_${user.email}`, new Date().toISOString());
          
          // Update local state
          setDailyUsage(newUsage);
        }
        
        // Notify other components of usage update
        window.dispatchEvent(new CustomEvent('talentix-usage-update'));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const handleExport = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with name and contact info
          new Paragraph({
            children: [
              new TextRun({
                text: cvTemplate.personalInfo.name,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${cvTemplate.personalInfo.email} | Address: ${cvTemplate.personalInfo.address} | Mobile: ${cvTemplate.personalInfo.mobile}`,
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Personal Summary Section
          new Paragraph({
            children: [new TextRun({ text: "Personal Summary", bold: true, underline: {} })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun(`Intro: ${cvTemplate.personalSummary.intro}`)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun(`Aim: ${cvTemplate.personalSummary.aim}`)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun(`Skills: ${cvTemplate.personalSummary.skills}`)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun(`Link to Job: ${cvTemplate.personalSummary.link}`)],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun(`Availability: ${cvTemplate.personalSummary.availability}`)],
            spacing: { after: 100 },
          }),

          // Work Experience Section
          new Paragraph({
            children: [new TextRun({ text: "Work Experience", bold: true, underline: {} })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...cvTemplate.workExperience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.company} (${exp.dates})`, bold: true }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun(`• Context: ${exp.context}`)],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun(`• Action: ${exp.action}`)],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun(`• Result: ${exp.result}`)],
              spacing: { after: 200 },
            }),
          ]),

          // Relevant Experience Section
          new Paragraph({
            children: [new TextRun({ text: "Relevant Experience", bold: true, underline: {} })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...cvTemplate.relevantExperience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.dates}`, bold: true }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun(`• Context: ${exp.context}`)],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun(`• Action: ${exp.action}`)],
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [new TextRun(`• Result: ${exp.result}`)],
              spacing: { after: 200 },
            }),
          ]),

          // Skills Section
          new Paragraph({
            children: [new TextRun({ text: "Skills", bold: true, underline: {} })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...cvTemplate.skills.flatMap(skill => [
            new Paragraph({
              children: [new TextRun({ text: skill.category, bold: true })],
              spacing: { after: 50 },
            }),
            ...skill.items.map(item => new Paragraph({
              children: [new TextRun(`• ${item}`)],
              spacing: { after: 50 },
            })),
          ]),

          // Education Section
          new Paragraph({
            children: [new TextRun({ text: "Education", bold: true, underline: {} })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `${cvTemplate.education.aLevel.school} (${cvTemplate.education.aLevel.dates})`, bold: true })],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [new TextRun(cvTemplate.education.aLevel.subjects)],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `${cvTemplate.education.secondary.school} (${cvTemplate.education.secondary.dates})`, bold: true })],
            spacing: { after: 50 },
          }),
          new Paragraph({
            children: [new TextRun(cvTemplate.education.secondary.gcses)],
            spacing: { after: 200 },
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${cvTemplate.personalInfo.name.replace(/\s+/g, '_')}_CV.docx`);
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        style={{
          width: '16px',
          height: '16px',
          color: i < score ? '#fbbf24' : '#e5e7eb',
          fill: i < score ? '#fbbf24' : '#e5e7eb'
        }}
      />
    ));
  };

  return (
    <AuthGuard>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
      }}>
      <style>{`
        .cv-upload-button:hover {
          background-color: #1d4ed8 !important;
        }
        .cv-analyze-button:not(:disabled):hover {
          background-color: #15803d !important;
        }
        
        /* Mobile responsive styles */
        @media (max-width: 767px) {
          .cv-mobile-nav {
            position: sticky !important;
            top: 60px !important; /* Space for mobile navigation */
            width: 100% !important;
            height: auto !important;
            min-height: 60px !important;
            z-index: 50 !important; /* Lower than mobile nav */
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            margin-bottom: 0 !important;
            padding-bottom: 8px !important;
          }
          .cv-mobile-content {
            margin-left: 0 !important;
            padding: 16px !important;
            padding-top: 32px !important; /* Increased space below sticky nav */
            margin-top: 16px !important;
          }
          .cv-mobile-nav-tabs {
            display: flex !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
          }
          .cv-mobile-nav-tabs::-webkit-scrollbar {
            display: none !important;
          }
          .cv-mobile-tab {
            min-width: 120px !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
            white-space: nowrap !important;
          }
          .cv-mobile-card {
            padding: 20px !important;
            margin-bottom: 16px !important;
          }
          .cv-mobile-form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .cv-mobile-input {
            padding: 12px !important;
            font-size: 16px !important; /* Prevent zoom on iOS */
          }
          .cv-mobile-button {
            padding: 14px 20px !important;
            font-size: 16px !important;
            width: 100% !important;
            margin-bottom: 8px !important;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .cv-desktop-sidebar {
            width: 280px !important;
            position: fixed !important;
            height: 100vh !important;
          }
          .cv-desktop-content {
            margin-left: 280px !important;
            padding: 32px 48px !important;
          }
        }
      `}</style>
      
      {/* Navigation - Responsive */}
      <div className="cv-mobile-nav cv-desktop-sidebar" style={{
        backgroundColor: '#1f2937',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #374151',
          paddingBottom: '16px'
        }}>
          <FileText style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
          <h1 style={{
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: '0'
          }}>
            CV Reviewer
          </h1>
        </div>

        {/* Navigation Tabs - Mobile horizontal scroll, Desktop vertical */}
        <div 
          className="cv-mobile-nav-tabs" 
          style={{
            display: isMobile ? 'flex' : 'block',
            gap: isMobile ? '8px' : '8px',
            flexDirection: isMobile ? 'row' : 'column'
          }}
        >
          <a
            href="/cv-reviewer?view=upload"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '10px 12px' : '12px 16px',
              backgroundColor: currentView === 'upload' ? '#374151' : 'transparent',
              color: currentView === 'upload' ? '#fbbf24' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '500',
              textAlign: 'left',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Upload style={{ width: '16px', height: '16px' }} />
            Upload
          </a>


          {feedback ? (
            <a
              href="/cv-reviewer?view=feedback"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 12px' : '12px 16px',
                backgroundColor: currentView === 'feedback' ? '#374151' : 'transparent',
                color: currentView === 'feedback' ? '#fbbf24' : '#d1d5db',
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '500',
                textAlign: 'left',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Star style={{ width: '16px', height: '16px' }} />
              Feedback
            </a>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 12px' : '12px 16px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '500',
                textAlign: 'left',
                opacity: 0.5
              }}
            >
              <Star style={{ width: '16px', height: '16px' }} />
              Feedback
            </div>
          )}

          <button
            className="cv-mobile-tab"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (feedback) setCurrentView('edit');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '10px 12px' : '12px 16px',
              backgroundColor: currentView === 'edit' ? '#374151' : 'transparent',
              color: currentView === 'edit' ? '#fbbf24' : feedback ? '#d1d5db' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: feedback ? 'pointer' : 'not-allowed',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: '500',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              opacity: feedback ? 1 : 0.5
            }}
          >
            <Edit3 style={{ width: '16px', height: '16px' }} />
            Edit
          </button>
        </div>

        {/* Back to Dashboard - Hidden on mobile in nav, shown in content */}
        {!isMobile && (
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔙 CV Reviewer: Back button clicked on mobile');
                console.log('🔙 Current URL:', window.location.href);
                
                // Force navigation
                console.log('🔙 Attempting navigation to dashboard...');
                window.location.href = '/dashboard';
                
                // Backup navigation after delay
                setTimeout(() => {
                  console.log('🔙 Backup navigation...');
                  window.location.replace('/dashboard');
                }, 100);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                color: '#d1d5db',
                border: '1px solid #374151',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                width: '100%',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>



      {/* Main Content */}
      <div className="cv-mobile-content cv-desktop-content">
        {currentView === 'upload' && (
          <div style={{ maxWidth: isMobile ? '100%' : '800px', margin: '0 auto' }}>
            {/* Mobile Back Button */}
            {isMobile && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = '/dashboard';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  border: '3px solid #000000',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  zIndex: '99999',
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                ← Back to Dashboard
              </button>
            )}
            
            <div style={{ 
              marginBottom: isMobile ? '20px' : '32px',
              marginTop: isMobile ? '32px' : '0',
              paddingTop: isMobile ? '16px' : '0'
            }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                CV Analysis & Enhancement
              </h1>
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#4b5563',
                margin: '0 0 16px 0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Upload your CV to get AI-powered feedback and improvements
              </p>
              
              {/* Usage Limits Display */}
              {subscription.tier === 'free' && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  <div>
                    <p style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: '#92400e', 
                      margin: '0 0 4px 0' 
                    }}>
                      Free Tier Limit: {dailyUsage}/1 CV review used today
                    </p>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#92400e', 
                      margin: '0' 
                    }}>
                      {dailyUsage >= 1 ? 'Come back tomorrow for another free review or upgrade to Pro!' : 'You have 1 CV review remaining today.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="cv-mobile-card" style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '48px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Upload style={{ 
                  width: isMobile ? '30px' : '40px', 
                  height: isMobile ? '30px' : '40px', 
                  color: '#2563eb' 
                }} />
              </div>

              <h3 style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 12px 0'
              }}>
                Upload Your CV
              </h3>
              
              <p style={{
                fontSize: isMobile ? '14px' : '16px',
                color: '#6b7280',
                margin: '0 0 24px 0'
              }}>
                Support for PDF and text files. Get detailed feedback in seconds.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              {/* MOBILE-ONLY: Completely isolated file upload */}
              {isMobile && (
                <div style={{ 
                  marginBottom: '20px',
                  position: 'relative',
                  zIndex: 10000,
                  isolation: 'isolate'
                }}>
                  {/* WARNING MESSAGE */}
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#dc2626',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>
                      🚨 Mobile File Upload Issue Detected
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#7f1d1d',
                      margin: '0'
                    }}>
                      If buttons redirect you, try the isolated file input below
                    </p>
                  </div>

                  {/* ISOLATED FILE INPUT - No event bubbling */}
                  <div style={{
                    marginBottom: '16px',
                    padding: '20px',
                    backgroundColor: '#f0f9ff',
                    border: '3px solid #3b82f6',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      color: '#1e40af',
                      marginBottom: '16px',
                      fontWeight: '700'
                    }}>
                      📱 MOBILE FILE UPLOAD (Isolated)
                    </p>
                    <div style={{
                      position: 'relative',
                      display: 'inline-block',
                      isolation: 'isolate'
                    }}>
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={(e) => {
                          const event = e as any;
                          event.stopPropagation();
                          event.preventDefault();
                          handleFileUpload(e);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        style={{
                          width: '100%',
                          minWidth: '280px',
                          padding: '16px',
                          border: '2px solid #1e40af',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          fontSize: '16px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          color: '#1e40af',
                          boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)'
                        }}
                      />
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '12px',
                      margin: '12px 0 0 0'
                    }}>
                      ✅ This input is isolated from navigation conflicts<br/>
                      📄 Supports: PDF, Word (.doc/.docx), Text files
                    </p>
                  </div>

                  {/* ALTERNATIVE: Text input for testing */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    border: '2px dashed #6b7280',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#374151',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      📝 Alternative: Paste CV Text
                    </p>
                    <textarea
                      placeholder="If file upload doesn't work, paste your CV text here..."
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          setCvText(e.target.value);
                          setUploadedFile(new File([e.target.value], 'pasted-cv.txt', { type: 'text/plain' }));
                        }
                      }}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical',
                        fontFamily: 'monospace'
                      }}
                    />
                    <p style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '8px',
                      margin: '8px 0 0 0'
                    }}>
                      This bypasses all file upload issues
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  } else {
                    console.error('🔥 File input ref is null!');
                  }
                }}
                className="cv-upload-button cv-mobile-button"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: isMobile ? '14px 24px' : '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '20px',
                  width: isMobile ? '100%' : 'auto',
                  position: 'relative',
                  zIndex: 1000
                }}
              >
                {isMobile ? '📱 Choose File (Mobile)' : 'Choose File'}
              </button>

              {uploadedFile && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a' }} />
                    <span style={{ fontSize: '14px', color: '#15803d', fontWeight: '500' }}>
                      File uploaded: {uploadedFile.name}
                    </span>
                  </div>
                  
                  {/* Usage counter for free tier users */}
                  {subscription.tier === 'free' && (
                    <div style={{
                      backgroundColor: dailyUsage >= 1 ? '#fef2f2' : '#f0f9ff',
                      border: `1px solid ${dailyUsage >= 1 ? '#fecaca' : '#bae6fd'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        color: dailyUsage >= 1 ? '#dc2626' : '#0369a1',
                        fontWeight: '500'
                      }}>
                        {dailyUsage >= 1 ? (
                          <>🔒 Daily limit reached (1/1 review used today)</>
                        ) : (
                          <>📊 Free tier: {dailyUsage}/1 review used today</>
                        )}
                      </div>
                      {dailyUsage >= 1 && (
                        <div style={{
                          fontSize: '12px',
                          color: '#dc2626',
                          marginTop: '4px'
                        }}>
                          Upgrade to Pro for unlimited CV reviews!
                        </div>
                      )}
                    </div>
                  )}
                  

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      
                      if (isAnalyzing) {
                        return;
                      }
                      
                      emergencyAnalyze();
                    }}
                    disabled={isAnalyzing}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: '3px solid #ffffff',
                      borderRadius: '12px',
                      padding: isMobile ? '16px 32px' : '14px 28px',
                      fontSize: isMobile ? '18px' : '16px',
                      fontWeight: '700',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isAnalyzing ? 0.7 : 1,
                      width: isMobile ? '100%' : 'auto',
                      position: 'relative',
                      zIndex: 10000,
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    🚨 {isAnalyzing ? 'ANALYZING...' : 'ANALYZE WITH AI'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'feedback' && feedback && (
          <div style={{ maxWidth: isMobile ? '100%' : '900px', margin: '0 auto' }}>
            {/* Mobile Back Button */}
            {isMobile && (
              <button
                onClick={() => {
                  alert('Dashboard button clicked!');
                  window.location.href = '/dashboard';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  border: '3px solid #000000',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  zIndex: '99999',
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                ← Back to Dashboard
              </button>
            )}
            
            <div style={{ 
              marginBottom: isMobile ? '20px' : '32px',
              marginTop: isMobile ? '32px' : '0',
              paddingTop: isMobile ? '16px' : '0'
            }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                AI Feedback Results
              </h1>
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#4b5563',
                margin: '0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Detailed analysis and improvement suggestions for your CV
              </p>
            </div>

            {/* Overall Score */}
            <div className="cv-mobile-card" style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              marginBottom: isMobile ? '16px' : '24px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? '12px' : '16px', 
                marginBottom: '16px',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <div style={{
                  fontSize: isMobile ? '36px' : '48px',
                  fontWeight: 'bold',
                  color: feedback.score >= 4 ? '#16a34a' : feedback.score >= 3 ? '#fbbf24' : '#dc2626'
                }}>
                  {feedback.score}/5
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: isMobile ? '18px' : '20px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    margin: '0 0 4px 0' 
                  }}>
                    Overall Score
                  </h3>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                    {renderStars(feedback.score)}
                  </div>
                </div>
              </div>
              <p style={{ 
                fontSize: isMobile ? '14px' : '16px', 
                color: '#4b5563', 
                margin: '0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                {feedback.overallFeedback}
              </p>
            </div>

            {/* Section Feedback */}
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              {feedback.sections.map((section, index) => (
                <div key={index} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                      {section.section}
                    </h4>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {renderStars(section.score)}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
                    {section.feedback}
                  </p>
                  {section.suggestions.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                        Suggestions:
                      </h5>
                      <ul style={{ margin: '0', paddingLeft: '16px' }}>
                        {section.suggestions.map((suggestion, i) => (
                          <li key={i} style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Strengths and Improvements */}
            <div className="cv-mobile-form-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
              gap: isMobile ? '16px' : '24px' 
            }}>
              <div className="cv-mobile-card" style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: isMobile ? '16px' : '18px', 
                  fontWeight: 'bold', 
                  color: '#16a34a', 
                  margin: '0 0 16px 0' 
                }}>
                  Strengths
                </h4>
                <ul style={{ margin: '0', paddingLeft: '16px' }}>
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} style={{ 
                      fontSize: isMobile ? '13px' : '14px', 
                      color: '#4b5563', 
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cv-mobile-card" style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ 
                  fontSize: isMobile ? '16px' : '18px', 
                  fontWeight: 'bold', 
                  color: '#dc2626', 
                  margin: '0 0 16px 0' 
                }}>
                  Areas for Improvement
                </h4>
                <ul style={{ margin: '0', paddingLeft: '16px' }}>
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} style={{ 
                      fontSize: isMobile ? '13px' : '14px', 
                      color: '#4b5563', 
                      marginBottom: '8px',
                      lineHeight: '1.4'
                    }}>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentView === 'edit' && (
          <div style={{ maxWidth: isMobile ? '100%' : '900px', margin: '0 auto' }}>
            {/* Mobile Back Button */}
            {isMobile && (
              <button
                onClick={() => {
                  alert('Dashboard button clicked!');
                  window.location.href = '/dashboard';
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 20px',
                  backgroundColor: '#ff0000',
                  color: '#ffffff',
                  border: '3px solid #000000',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                  marginTop: '20px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  zIndex: '99999',
                  position: 'relative',
                  pointerEvents: 'auto'
                }}
              >
                ← Back to Dashboard
              </button>
            )}
            
            <div style={{ 
              marginBottom: isMobile ? '20px' : '32px',
              marginTop: isMobile ? '32px' : '0',
              paddingTop: isMobile ? '16px' : '0'
            }}>
              <h1 style={{
                fontSize: isMobile ? '24px' : '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                Edit Your CV
              </h1>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: isMobile ? 'center' : 'space-between', 
                marginTop: '8px' 
              }}>
                <p style={{
                  fontSize: isMobile ? '16px' : '18px',
                  color: '#4b5563',
                  margin: '0',
                  textAlign: isMobile ? 'center' : 'left'
                }}>
                  Use our professional template to enhance your CV
                </p>
              </div>
            </div>

            <div className="cv-mobile-card" style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '40px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb'
            }}>
              {/* Personal Information Section */}
              <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
                <h3 style={{ 
                  fontSize: isMobile ? '18px' : '20px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  marginBottom: '16px', 
                  borderBottom: '2px solid #e5e7eb', 
                  paddingBottom: '8px' 
                }}>
                  Personal Information
                </h3>
                <div className="cv-mobile-form-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                  gap: isMobile ? '12px' : '16px' 
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.personalInfo.name}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalInfo: {...cvTemplate.personalInfo, name: e.target.value}})}
                      className="cv-mobile-input"
                      style={{ 
                        width: '100%', 
                        padding: isMobile ? '12px' : '10px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        fontSize: isMobile ? '16px' : '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={cvTemplate.personalInfo.email}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalInfo: {...cvTemplate.personalInfo, email: e.target.value}})}
                      className="cv-mobile-input"
                      style={{ 
                        width: '100%', 
                        padding: isMobile ? '12px' : '10px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        fontSize: isMobile ? '16px' : '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.personalInfo.address}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalInfo: {...cvTemplate.personalInfo, address: e.target.value}})}
                      className="cv-mobile-input"
                      style={{ 
                        width: '100%', 
                        padding: isMobile ? '12px' : '10px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        fontSize: isMobile ? '16px' : '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Mobile
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.personalInfo.mobile}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalInfo: {...cvTemplate.personalInfo, mobile: e.target.value}})}
                      className="cv-mobile-input"
                      style={{ 
                        width: '100%', 
                        padding: isMobile ? '12px' : '10px 12px', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px', 
                        fontSize: isMobile ? '16px' : '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Personal Summary Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Personal Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Intro
                    </label>
                    <textarea
                      value={cvTemplate.personalSummary.intro}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalSummary: {...cvTemplate.personalSummary, intro: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                      placeholder="Discuss who you are: 'I am a [INSERT SKILL] student'"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Aim
                    </label>
                    <textarea
                      value={cvTemplate.personalSummary.aim}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalSummary: {...cvTemplate.personalSummary, aim: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                      placeholder="Discuss what you're looking for: 'I am looking for part-time work in the [INSERT FIELD] sector'"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Skills
                    </label>
                    <textarea
                      value={cvTemplate.personalSummary.skills}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalSummary: {...cvTemplate.personalSummary, skills: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                      placeholder="Discuss what your strengths are - LINK IT TO THE JOB YOU'RE APPLYING FOR"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Link to Job
                    </label>
                    <textarea
                      value={cvTemplate.personalSummary.link}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalSummary: {...cvTemplate.personalSummary, link: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '40px', fontSize: '14px' }}
                      placeholder="'with proficient [X,X and X] skills to work flexible hours'"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Availability
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.personalSummary.availability}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalSummary: {...cvTemplate.personalSummary, availability: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      placeholder="'Flexible hours'"
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Work Experience
                </h3>
                {cvTemplate.workExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Company, Company Position (Use ':' or ',' or '|' to separate)
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.workExperience];
                            newExp[index].company = e.target.value;
                            setCvTemplate({...cvTemplate, workExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                          placeholder="e.g., MMM 20XX"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Dates
                        </label>
                        <input
                          type="text"
                          value={exp.dates}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.workExperience];
                            newExp[index].dates = e.target.value;
                            setCvTemplate({...cvTemplate, workExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                          placeholder="MMM 20XX"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Context: In summary, what was the experience? Describe it and if you gained it through a competition or application this is a good place to mention that
                        </label>
                        <textarea
                          value={exp.context}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.workExperience];
                            newExp[index].context = e.target.value;
                            setCvTemplate({...cvTemplate, workExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                          placeholder="Example: 'Spent six weeks working in customer service at XX following a successful application'"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Action: More detail on the experience - what did you do or contribute to this experience? Include concrete examples
                        </label>
                        <textarea
                          value={exp.action}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.workExperience];
                            newExp[index].action = e.target.value;
                            setCvTemplate({...cvTemplate, workExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                          placeholder="Example: 'Worked on xx project' 'Developed xx via x' 'Organised a event' - be honest about these actions"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Result: What was the outcome? Include quantifiable, concrete examples or skills you developed or something you learnt
                        </label>
                        <textarea
                          value={exp.result}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.workExperience];
                            newExp[index].result = e.target.value;
                            setCvTemplate({...cvTemplate, workExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                          placeholder="Example: 'Received an award for xx' 'Achieved a xx% increase in sales' 'Developed a [insert skill] by xx [insert task or activity]'"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCvTemplate({
                      ...cvTemplate,
                      workExperience: [...cvTemplate.workExperience, { company: '', position: '', dates: '', context: '', action: '', result: '' }]
                    });
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Work Experience
                </button>
              </div>

              {/* Relevant Experience Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Relevant Experience
                </h3>
                {cvTemplate.relevantExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Dates
                      </label>
                      <input
                        type="text"
                        value={exp.dates}
                        onChange={(e) => {
                          const newExp = [...cvTemplate.relevantExperience];
                          newExp[index].dates = e.target.value;
                          setCvTemplate({...cvTemplate, relevantExperience: newExp});
                        }}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        placeholder="MMM 20XX"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Context
                        </label>
                        <textarea
                          value={exp.context}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.relevantExperience];
                            newExp[index].context = e.target.value;
                            setCvTemplate({...cvTemplate, relevantExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Action
                        </label>
                        <textarea
                          value={exp.action}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.relevantExperience];
                            newExp[index].action = e.target.value;
                            setCvTemplate({...cvTemplate, relevantExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                          Result
                        </label>
                        <textarea
                          value={exp.result}
                          onChange={(e) => {
                            const newExp = [...cvTemplate.relevantExperience];
                            newExp[index].result = e.target.value;
                            setCvTemplate({...cvTemplate, relevantExperience: newExp});
                          }}
                          style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '60px', fontSize: '14px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCvTemplate({
                      ...cvTemplate,
                      relevantExperience: [...cvTemplate.relevantExperience, { dates: '', context: '', action: '', result: '' }]
                    });
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Relevant Experience
                </button>
              </div>

              {/* Skills Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Skills
                </h3>
                {cvTemplate.skills.map((skillGroup, index) => (
                  <div key={index} style={{ marginBottom: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Skill Category (e.g., Teamwork, Communication, etc.)
                      </label>
                      <input
                        type="text"
                        value={skillGroup.category}
                        onChange={(e) => {
                          const newSkills = [...cvTemplate.skills];
                          newSkills[index].category = e.target.value;
                          setCvTemplate({...cvTemplate, skills: newSkills});
                        }}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', marginBottom: '12px' }}
                        placeholder="Skill #1"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Description: When did you use this skill? Give a practical example as well as an outcome.
                      </label>
                      <textarea
                        value={skillGroup.items.join('\n')}
                        onChange={(e) => {
                          const newSkills = [...cvTemplate.skills];
                          newSkills[index].items = e.target.value.split('\n');
                          setCvTemplate({...cvTemplate, skills: newSkills});
                        }}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', minHeight: '80px', fontSize: '14px' }}
                        placeholder="When did you use this skill? Give a practical example as well as an outcome."
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setCvTemplate({
                      ...cvTemplate,
                      skills: [...cvTemplate.skills, { category: '', items: [''] }]
                    });
                  }}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Skill
                </button>
              </div>

              {/* Education Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Education
                </h3>
                
                {/* A-Levels */}
                <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>A-Level / College School Name</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        School Name
                      </label>
                      <input
                        type="text"
                        value={cvTemplate.education.aLevel.school}
                        onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, aLevel: {...cvTemplate.education.aLevel, school: e.target.value}}})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        placeholder="20XX –20XX"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Dates
                      </label>
                      <input
                        type="text"
                        value={cvTemplate.education.aLevel.dates}
                        onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, aLevel: {...cvTemplate.education.aLevel, dates: e.target.value}}})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        placeholder="20XX –20XX"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      A-Levels: XXX (Grades), XXX (Grade), XXX (Grade)
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.education.aLevel.subjects}
                      onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, aLevel: {...cvTemplate.education.aLevel, subjects: e.target.value}}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      placeholder="A-Levels: XXX (Grades), XXX (Grade), XXX (Grade)"
                    />
                  </div>
                </div>

                {/* Secondary School */}
                <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Secondary School Name</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        School Name
                      </label>
                      <input
                        type="text"
                        value={cvTemplate.education.secondary.school}
                        onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, secondary: {...cvTemplate.education.secondary, school: e.target.value}}})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        placeholder="School Name"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                        Dates
                      </label>
                      <input
                        type="text"
                        value={cvTemplate.education.secondary.dates}
                        onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, secondary: {...cvTemplate.education.secondary, dates: e.target.value}}})}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        placeholder="20XX – 20XX"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      GCSEs: XX GCSEs (insert grade range e.g., A* - C or 9-7), including a (X) in Mathematics and (X) in English Language / Lit
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.education.secondary.gcses}
                      onChange={(e) => setCvTemplate({...cvTemplate, education: {...cvTemplate.education, secondary: {...cvTemplate.education.secondary, gcses: e.target.value}}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      placeholder="GCSEs: XX GCSEs (insert grade range e.g., A* - C or 9-7), including a (X) in Mathematics and (X) in English Language / Lit"
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                gap: isMobile ? '12px' : '16px', 
                paddingTop: '24px', 
                borderTop: '1px solid #e5e7eb',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <button
                  onClick={() => setCurrentView('feedback')}
                  className="cv-mobile-button"
                  style={{
                    backgroundColor: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: isMobile ? '14px 24px' : '12px 24px',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: isMobile ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  ← Back to Feedback
                </button>

                <button
                  onClick={handleExport}
                  className="cv-mobile-button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: isMobile ? '14px 24px' : '12px 24px',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    width: isMobile ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#15803d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#16a34a';
                  }}
                >
                  <Download style={{ width: '16px', height: '16px' }} />
                  Export as DOCX
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Available with Talentix Pro Popup */}
      {showProPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '32px',
            maxWidth: '420px',
            width: '95%',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25), 0 10px 25px rgba(245, 158, 11, 0.3)',
            position: 'relative',
            fontFamily: 'Fredoka, sans-serif',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowProPopup(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#374151',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>

            {/* Content */}
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📄</div>
            
            <h2 style={{
              fontSize: isMobile ? '1.5rem' : '1.8rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '12px',
              lineHeight: 1.2
            }}>
              Available with Talentix Pro! ✨
            </h2>
            
            <p style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: '#374151',
              marginBottom: '24px',
              lineHeight: 1.6
            }}>
              You've reached your daily limit of <strong>1 CV review</strong>. 
              Upgrade to Talentix Pro for unlimited CV reviews and more!
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setShowProPopup(false);
                  window.dispatchEvent(new CustomEvent('openPricingModal'));
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  color: 'white',
                  padding: isMobile ? '12px 20px' : '14px 24px',
                  borderRadius: '16px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Fredoka, sans-serif',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
                }}
              >
                🚀 Upgrade to Pro - £3.99/month
              </button>
              
              <button
                onClick={() => setShowProPopup(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#374151',
                  padding: isMobile ? '12px 20px' : '14px 24px',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Fredoka, sans-serif',
                  minHeight: '44px',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Maybe Later
              </button>
            </div>

            {/* Small print */}
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              marginTop: '16px',
              marginBottom: 0
            }}>
              Come back tomorrow for another free review!
            </p>
          </div>
        </div>
      )}

    </div>
    </AuthGuard>
  );
}
