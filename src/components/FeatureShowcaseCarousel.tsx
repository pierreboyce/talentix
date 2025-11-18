'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface FeatureShowcase {
  name: string;
  image: string;
  description: string;
  emoji: string;
}

const features: FeatureShowcase[] = [
  {
    name: 'Job Search',
    image: '/jobsearch.png',
    description: 'Browse thousands of job opportunities from top UK companies with smart filters and easy application tracking.',
    emoji: '🔍'
  },
  {
    name: 'CV Reviewer',
    image: '/cv reviewer.png',
    description: 'Get instant AI-powered feedback on your CV with personalized improvement suggestions to help you stand out.',
    emoji: '📄'
  },
  {
    name: 'Interview Prep',
    image: '/interviewprep.png',
    description: 'Practice with AI-generated interview questions tailored to your industry and role to boost your confidence.',
    emoji: '🎭'
  },
  {
    name: 'Video Interview',
    image: '/videointerviewscreenshot.png',
    description: 'Record timed answers on camera and get instant AI feedback on clarity, confidence and relevance.',
    emoji: '🎥'
  },
  {
    name: 'Job Tracker',
    image: '/jobtracker (2).png',
    description: 'Keep track of all your job applications and follow up on opportunities systematically with our smart tracker.',
    emoji: '📊'
  },
  {
    name: 'Apprenticeship Tracker',
    image: '/apprenticeshiptracker.png',
    description: 'Discover and track apprenticeship opportunities that match your interests and career goals.',
    emoji: '📋'
  },
  {
    name: 'Cover Letter Maker',
    image: '/coverlettermaker.png',
    description: 'Generate compelling cover letters tailored to each job application with AI assistance.',
    emoji: '✍️'
  }
];

export default function FeatureShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play carousel
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    // Resume auto-play after manual navigation
    setTimeout(() => setIsPaused(false), 8000);
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % features.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + features.length) % features.length);
  };

  const currentFeature = features[currentIndex];

  return (
    <>
      <style jsx>{`
        @media (max-width: 767px) {
          .feature-showcase-header h2 {
            font-size: clamp(1.4rem, 4vw, 1.75rem) !important;
          }
        }
        @media (min-width: 768px) {
          .feature-showcase-carousel {
            max-width: 450px !important;
          }
          .feature-showcase-header h2 {
            font-size: clamp(1.5rem, 3vw, 2rem) !important;
          }
          .feature-showcase-header p {
            font-size: clamp(0.85rem, 1.5vw, 0.95rem) !important;
          }
          .feature-showcase-info {
            padding: 20px !important;
          }
          .feature-showcase-info h3 {
            font-size: clamp(1.1rem, 2vw, 1.3rem) !important;
          }
          .feature-showcase-info p {
            font-size: clamp(0.8rem, 1.2vw, 0.875rem) !important;
          }
          .feature-showcase-emoji {
            font-size: 1.75rem !important;
          }
        }
        @keyframes float-carousel {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        .floating-bg-emoji {
          position: absolute;
          opacity: 0.22;
          pointer-events: none;
          animation: float-carousel 4s ease-in-out infinite;
        }
        .floating-bg-emoji:nth-child(2) { animation-delay: 0.5s; }
        .floating-bg-emoji:nth-child(3) { animation-delay: 1s; }
        .floating-bg-emoji:nth-child(4) { animation-delay: 1.5s; }
        .floating-bg-emoji:nth-child(5) { animation-delay: 2s; }
        .floating-bg-emoji:nth-child(6) { animation-delay: 2.5s; }
        .floating-bg-emoji:nth-child(7) { animation-delay: 0.3s; }
        .floating-bg-emoji:nth-child(8) { animation-delay: 0.8s; }
        .floating-bg-emoji:nth-child(9) { animation-delay: 1.3s; }
        .floating-bg-emoji:nth-child(10) { animation-delay: 1.8s; }
        .floating-bg-emoji:nth-child(11) { animation-delay: 2.3s; }
        .floating-bg-emoji:nth-child(12) { animation-delay: 2.8s; }
      `}</style>
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 24px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Background Elements */}
        <div className="floating-bg-emoji" style={{ top: '8%', left: '4%', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}>✨</div>
        <div className="floating-bg-emoji" style={{ top: '15%', right: '6%', fontSize: 'clamp(3rem, 8vw, 5rem)' }}>🚀</div>
        <div className="floating-bg-emoji" style={{ top: '22%', left: '25%', fontSize: 'clamp(2.5rem, 7vw, 4rem)' }}>💼</div>
        <div className="floating-bg-emoji" style={{ top: '35%', right: '22%', fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}>⭐</div>
        <div className="floating-bg-emoji" style={{ top: '45%', left: '35%', fontSize: 'clamp(2.5rem, 7vw, 4rem)' }}>📄</div>
        <div className="floating-bg-emoji" style={{ top: '55%', right: '30%', fontSize: 'clamp(3rem, 8vw, 5rem)' }}>💫</div>
        <div className="floating-bg-emoji" style={{ top: '65%', left: '28%', fontSize: 'clamp(2.5rem, 7vw, 4rem)' }}>🎯</div>
        <div className="floating-bg-emoji" style={{ top: '75%', right: '7%', fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}>🌟</div>
        <div className="floating-bg-emoji" style={{ bottom: '18%', left: '32%', fontSize: 'clamp(2.5rem, 7vw, 4rem)' }}>🎉</div>
        <div className="floating-bg-emoji" style={{ bottom: '25%', right: '38%', fontSize: 'clamp(3rem, 8vw, 5rem)' }}>🔥</div>
        <div className="floating-bg-emoji" style={{ bottom: '12%', left: '9%', fontSize: 'clamp(2.5rem, 7vw, 4rem)' }}>💎</div>
        <div className="floating-bg-emoji" style={{ bottom: '8%', right: '9%', fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}>⚡</div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div className="feature-showcase-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 900,
            color: '#111827',
            marginBottom: '10px',
            fontFamily: "'Fredoka', 'Inter', sans-serif"
          }}>
            See Talentix in Action 🚀
          </h2>
          <p style={{
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            color: '#374151',
            fontFamily: "'Fredoka', 'Inter', sans-serif",
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Explore our powerful features designed to help you land your dream job
          </p>
        </div>

        {/* Carousel Container */}
        <div className="feature-showcase-carousel" style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#ffffff',
          maxWidth: 'clamp(100%, 85vw, 550px)',
          margin: '0 auto'
        }}>
          {/* Feature Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: '#f9fafb',
            overflow: 'hidden'
          }}>
            <Image
              src={currentFeature.image}
              alt={currentFeature.name}
              fill
              style={{
                objectFit: 'contain',
                padding: '20px'
              }}
              priority={currentIndex === 0}
              sizes="(max-width: 768px) 100vw, 1000px"
            />
          </div>

          {/* Feature Info */}
          <div className="feature-showcase-info" style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderTop: '3px solid #fbbf24'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <span className="feature-showcase-emoji" style={{ fontSize: '2rem' }}>{currentFeature.emoji}</span>
              <h3 style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                fontWeight: 800,
                color: '#111827',
                margin: 0,
                fontFamily: "'Fredoka', 'Inter', sans-serif"
              }}>
                {currentFeature.name}
              </h3>
            </div>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.3vw, 0.95rem)',
              color: '#4b5563',
              lineHeight: '1.5',
              margin: 0,
              fontFamily: "'Inter', sans-serif"
            }}>
              {currentFeature.description}
            </p>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              position: 'absolute',
              left: 'clamp(8px, 2vw, 12px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(36px, 7vw, 40px)',
              height: 'clamp(36px, 7vw, 40px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              fontSize: 'clamp(18px, 3.5vw, 20px)',
              color: '#111827',
              touchAction: 'manipulation'
            }}
            aria-label="Previous feature"
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              position: 'absolute',
              right: 'clamp(8px, 2vw, 12px)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'clamp(36px, 7vw, 40px)',
              height: 'clamp(36px, 7vw, 40px)',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              fontSize: 'clamp(18px, 3.5vw, 20px)',
              color: '#111827',
              touchAction: 'manipulation'
            }}
            aria-label="Next feature"
          >
            →
          </button>

          {/* Dots Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb'
          }}>
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{
                  width: currentIndex === index ? '32px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  backgroundColor: currentIndex === index ? '#fbbf24' : '#d1d5db',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
                aria-label={`Go to ${features[index].name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

