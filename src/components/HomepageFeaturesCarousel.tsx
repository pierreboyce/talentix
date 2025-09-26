'use client';

import { Search, FileText, Users, Trophy, Camera, Settings, BarChart3, Edit3, MessageCircle, BookOpen } from 'lucide-react';

export default function HomepageFeaturesCarousel() {
  const handleScrollLeft = () => {
    const container = document.getElementById('homepage-feature-cards-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    const container = document.getElementById('homepage-feature-cards-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
      padding: '40px 0' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ position: 'relative' }}>
          {/* Navigation Arrows */}
          <button 
            onClick={handleScrollLeft}
            style={{
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '20px', color: '#374151' }}>←</span>
          </button>

          <button 
            onClick={handleScrollRight}
            style={{
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '20px', color: '#374151' }}>→</span>
          </button>

          {/* Horizontal scroll container */}
          <div 
            id="homepage-feature-cards-container"
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              gap: '24px', 
              paddingBottom: '16px',
              scrollSnapType: 'x mandatory',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
            className="scrollbar-hide"
          >
            
            {/* Job Search Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                border: '3px solid #2563eb',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🔍</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Search style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Job Search
                  </h3>
                  <p style={{ fontSize: '14px', color: '#dbeafe', margin: '0' }}>
                    🎯 Find opportunities
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Search through thousands of job opportunities from top UK companies with smart filters! 🚀
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🏢 35+ Companies
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Explore Now →
                </span>
              </div>
            </div>

            {/* CV Reviewer Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                border: '3px solid #16a34a',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(22, 163, 74, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(22, 163, 74, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📄</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <FileText style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    CV Reviewer
                  </h3>
                  <p style={{ fontSize: '14px', color: '#dcfce7', margin: '0' }}>
                    🤖 AI analysis
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Get instant AI-powered feedback on your CV with personalized improvement suggestions! ✨
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#16a34a',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🧠 AI Powered
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Review Now →
                </span>
              </div>
            </div>

            {/* Interview Prep Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(217, 119, 6, 0.3)',
                border: '3px solid #d97706',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(217, 119, 6, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎤</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Users style={{ width: '32px', height: '32px', color: '#d97706' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Interview Prep
                  </h3>
                  <p style={{ fontSize: '14px', color: '#fef3c7', margin: '0' }}>
                    🎯 Practice questions
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Practice with AI-generated interview questions tailored to your industry and role! 💪
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#d97706',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🎤 Practice
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Start Now →
                </span>
              </div>
            </div>

            {/* Video Interview Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #fce7f3 0%, #ec4899 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                border: '3px solid #ec4899',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎬</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Camera style={{ width: '32px', height: '32px', color: '#ec4899' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Video Interview
                  </h3>
                  <p style={{ fontSize: '14px', color: '#fce7f3', margin: '0' }}>
                    🎥 Practice on camera
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Practice video interviews with AI questions and get comfortable being on camera! 📹
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#ec4899',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  📹 Record & Review
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Practice Now →
                </span>
              </div>
            </div>

            {/* Talentix Points Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
                border: '3px solid #fbbf24',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(251, 191, 36, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🏆</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Trophy style={{ width: '32px', height: '32px', color: '#fbbf24' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Talentix Points
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                    🎯 Track progress
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5', marginBottom: '24px' }}>
                Earn points for completing activities and unlock achievements as you progress! 🚀
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#fbbf24',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🎉 Earn Points
                </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                  View Progress →
                </span>
              </div>
            </div>

            {/* Settings Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #8b5cf6 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                border: '3px solid #8b5cf6',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>⚙️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Settings style={{ width: '32px', height: '32px', color: '#8b5cf6' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Settings
                  </h3>
                  <p style={{ fontSize: '14px', color: '#e0e7ff', margin: '0' }}>
                    🔧 Customize experience
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Personalize your Talentix experience with custom preferences and account settings! ⚙️
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#8b5cf6',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🔧 Customize
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Manage →
                </span>
              </div>
            </div>

            {/* Job Tracker Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #d1fae5 0%, #10b981 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                border: '3px solid #10b981',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📊</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <BarChart3 style={{ width: '32px', height: '32px', color: '#10b981' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Job Tracker
                  </h3>
                  <p style={{ fontSize: '14px', color: '#d1fae5', margin: '0' }}>
                    📈 Track applications
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Keep track of all your job applications and follow up on opportunities systematically! 📋
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  📊 Organize
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Track Now →
                </span>
              </div>
            </div>

            {/* Cover Letter Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #ddd6fe 0%, #7c3aed 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
                border: '3px solid #7c3aed',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(124, 58, 237, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>✍️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <Edit3 style={{ width: '32px', height: '32px', color: '#7c3aed' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Cover Letter
                  </h3>
                  <p style={{ fontSize: '14px', color: '#ddd6fe', margin: '0' }}>
                    ✍️ AI-powered writing
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Generate compelling cover letters tailored to each job application with AI assistance! ✨
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#7c3aed',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  ✍️ Generate
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Write Now →
                </span>
              </div>
            </div>

            {/* AI Chat Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #fef7cd 0%, #eab308 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(234, 179, 8, 0.3)',
                border: '3px solid #eab308',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(234, 179, 8, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(234, 179, 8, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🤖</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <MessageCircle style={{ width: '32px', height: '32px', color: '#eab308' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                    AI Chat
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                    🤖 Get instant help
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5', marginBottom: '24px' }}>
                Chat with our AI assistant for personalized career advice and job search tips! 💬
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#eab308',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🤖 Chat Now
                </span>
                <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                  Ask Away →
                </span>
              </div>
            </div>

            {/* Career Guidance Feature Card - Non-clickable */}
            <div 
              style={{
                flexShrink: 0,
                width: '350px',
                background: 'linear-gradient(135deg, #fed7d7 0%, #e53e3e 100%)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 25px rgba(229, 62, 62, 0.3)',
                border: '3px solid #e53e3e',
                transition: 'all 0.3s ease',
                scrollSnapAlign: 'start',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(229, 62, 62, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(229, 62, 62, 0.3)';
              }}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📚</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <BookOpen style={{ width: '32px', height: '32px', color: '#e53e3e' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                    Career Guidance
                  </h3>
                  <p style={{ fontSize: '14px', color: '#fed7d7', margin: '0' }}>
                    📚 Expert advice
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                Access expert career advice, industry insights, and professional development resources! 🎯
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#e53e3e',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  📚 Learn More
                </span>
                <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                  Explore →
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
