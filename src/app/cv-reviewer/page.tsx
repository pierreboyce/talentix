"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Download, Edit3, FileText, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import PaywallGuard from '../../components/PaywallGuard';
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
  
  const [currentView, setCurrentView] = useState<'upload' | 'feedback' | 'edit'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [feedback, setFeedback] = useState<CVFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dailyUsage, setDailyUsage] = useState(0); // Track CV reviews today
  
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
          console.log('📄 Processing PDF file:', file.name);
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
          console.log('📄 Processing Word document:', file.name);
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
    }
  };

  const handleAnalyze = async () => {
    if (!cvText) return;
    
    // Check subscription limits for free tier users
    if (subscription.tier === 'free' && dailyUsage >= 1) {
      // Trigger pricing modal for upgrade
      window.dispatchEvent(new CustomEvent('openPricingModal'));
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText })
      });
      
      if (response.ok) {
        const result = await response.json();
        setFeedback(result);
        setCurrentView('feedback');
        
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
      display: 'flex'
    }}>
      <style jsx>{`
        .cv-upload-button:hover {
          background-color: #1d4ed8 !important;
        }
        .cv-analyze-button:not(:disabled):hover {
          background-color: #15803d !important;
        }
      `}</style>
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        position: 'fixed',
        height: '100vh',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #374151',
          paddingBottom: '16px'
        }}>
          <FileText style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
          <h1 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ffffff',
            margin: '0'
          }}>
            CV Reviewer
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', margin: '0' }}>
            PROCESS
          </h3>
          
          <button
            onClick={() => setCurrentView('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: currentView === 'upload' ? '#374151' : 'transparent',
              color: currentView === 'upload' ? '#fbbf24' : '#d1d5db',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'upload') {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'upload') {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            <Upload style={{ width: '18px', height: '18px' }} />
            Upload CV
          </button>

          <button
            onClick={() => feedback && setCurrentView('feedback')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: currentView === 'feedback' ? '#374151' : 'transparent',
              color: currentView === 'feedback' ? '#fbbf24' : feedback ? '#d1d5db' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: feedback ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              opacity: feedback ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'feedback' && feedback) {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'feedback' && feedback) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            <Star style={{ width: '18px', height: '18px' }} />
            AI Feedback
          </button>

          <button
            onClick={() => feedback && setCurrentView('edit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: currentView === 'edit' ? '#374151' : 'transparent',
              color: currentView === 'edit' ? '#fbbf24' : feedback ? '#d1d5db' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: feedback ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              opacity: feedback ? 1 : 0.5
            }}
            onMouseEnter={(e) => {
              if (currentView !== 'edit' && feedback) {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'edit' && feedback) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            <Edit3 style={{ width: '18px', height: '18px' }} />
            Edit & Export
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => router.push('/dashboard')}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px 48px'
      }}>
        {currentView === 'upload' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                CV Analysis & Enhancement
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: '0 0 16px 0'
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

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '48px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#dbeafe',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto'
              }}>
                <Upload style={{ width: '40px', height: '40px', color: '#2563eb' }} />
              </div>

              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 12px 0'
              }}>
                Upload Your CV
              </h3>
              
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0 0 32px 0'
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

              <button
                onClick={() => fileInputRef.current?.click()}
                className="cv-upload-button"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '24px'
                }}
              >
                Choose File
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
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="cv-analyze-button"
                    style={{
                      backgroundColor: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isAnalyzing ? 0.7 : 1
                    }}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'feedback' && feedback && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                AI Feedback Results
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: '0'
              }}>
                Detailed analysis and improvement suggestions for your CV
              </p>
            </div>

            {/* Overall Score */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: feedback.score >= 4 ? '#16a34a' : feedback.score >= 3 ? '#fbbf24' : '#dc2626'
                }}>
                  {feedback.score}/5
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Overall Score
                  </h3>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {renderStars(feedback.score)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#4b5563', margin: '0' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0 0 16px 0' }}>
                  Strengths
                </h4>
                <ul style={{ margin: '0', paddingLeft: '16px' }}>
                  {feedback.strengths.map((strength, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', margin: '0 0 16px 0' }}>
                  Areas for Improvement
                </h4>
                <ul style={{ margin: '0', paddingLeft: '16px' }}>
                  {feedback.improvements.map((improvement, i) => (
                    <li key={i} style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {currentView === 'edit' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Edit Your CV
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <p style={{
                  fontSize: '18px',
                  color: '#4b5563',
                  margin: '0'
                }}>
                  Use our professional template to enhance your CV
                </p>

              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb'
            }}>
              {/* Personal Information Section */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      Name
                    </label>
                    <input
                      type="text"
                      value={cvTemplate.personalInfo.name}
                      onChange={(e) => setCvTemplate({...cvTemplate, personalInfo: {...cvTemplate.personalInfo, name: e.target.value}})}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
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
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
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
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
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
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
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
              
              <div style={{ display: 'flex', gap: '16px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => setCurrentView('feedback')}
                  style={{
                    backgroundColor: '#6b7280',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
    </div>
  );
}
