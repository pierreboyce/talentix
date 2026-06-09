'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Feature {
  name: string;
  image: string;
  description: string;
  emoji: string;
}

const features: Feature[] = [
  { name: 'CV Reviewer', image: '/cv reviewer.png', description: 'Get instant AI-powered feedback on your CV with personalised improvement suggestions to help you stand out.', emoji: '📄' },
  { name: 'Interview Prep', image: '/interviewprep.png', description: 'Practice with AI-generated interview questions tailored to your industry and role to boost your confidence.', emoji: '🎭' },
  { name: 'Video Interview', image: '/videointerviewscreenshot.png', description: 'Record timed answers on camera and get instant AI feedback on clarity, confidence and relevance.', emoji: '🎥' },
  { name: 'Job Search', image: '/jobsearch.png', description: 'Browse thousands of job opportunities from top UK companies with smart filters and easy application tracking.', emoji: '🔍' },
  { name: 'Job Tracker', image: '/jobtracker (2).png', description: 'Keep track of all your job applications and follow up on opportunities systematically.', emoji: '📊' },
  { name: 'Cover Letter', image: '/coverlettermaker.png', description: 'Generate compelling cover letters tailored to each job application with AI assistance.', emoji: '✍️' },
  { name: 'Apprenticeships', image: '/apprenticeshiptracker.png', description: 'Discover and track apprenticeship opportunities that match your interests and career goals.', emoji: '📋' },
];

const FONT = "'Fredoka', 'Inter', sans-serif";

export default function FeatureShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % features.length);
      }, 4000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused]);

  const goTo = (i: number) => {
    setActiveIndex(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  const current = features[activeIndex];

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        padding: 'clamp(32px, 5vw, 52px) clamp(16px, 4vw, 32px)',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .fsc-wrap { max-width: 760px; margin: 0 auto; }
        .fsc-heading {
          text-align: center;
          margin-bottom: 24px;
          font-size: clamp(1.6rem, 3.5vw, 2.3rem);
          font-weight: 900;
          color: #111827;
          font-family: ${FONT};
        }
        .fsc-layout {
          display: grid;
          grid-template-columns: 210px 1fr;
          gap: 16px;
          align-items: start;
        }
        .fsc-tabs { display: flex; flex-direction: column; gap: 5px; }
        .fsc-tab {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border-radius: 12px;
          border: 2px solid transparent;
          background: transparent;
          cursor: pointer;
          text-align: left;
          font-family: ${FONT};
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .fsc-tab:hover { background: rgba(255,255,255,0.55); color: #111827; }
        .fsc-tab.fsc-active {
          background: rgba(255,255,255,0.94);
          border-color: rgba(255,255,255,0.9);
          color: #111827;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(0,0,0,0.11);
        }
        .fsc-panel {
          background: rgba(255,255,255,0.96);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 36px rgba(0,0,0,0.17);
          border: 2px solid rgba(255,255,255,0.9);
        }
        .fsc-img-wrap { position: relative; width: 100%; padding-top: 56.25%; background: #f9fafb; }
        .fsc-info {
          padding: 16px 20px;
          border-top: 2px solid #fbbf24;
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }
        .fsc-info-emoji { font-size: 1.5rem; flex-shrink: 0; line-height: 1.3; }
        .fsc-info-name {
          margin: 0 0 3px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
          font-family: ${FONT};
        }
        .fsc-info-desc {
          margin: 0;
          font-size: 0.85rem;
          color: #4b5563;
          line-height: 1.5;
          font-family: 'Inter', sans-serif;
        }
        .fsc-dots {
          display: flex;
          justify-content: center;
          gap: 7px;
          padding: 10px 16px;
          border-top: 1px solid #f3f4f6;
        }
        .fsc-dot {
          height: 9px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: width 0.22s ease, background 0.22s ease;
          padding: 0;
        }
        @keyframes fscImgFade {
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (max-width: 767px) {
          .fsc-layout { grid-template-columns: 1fr; }
          .fsc-tabs {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 4px;
            gap: 7px;
            -webkit-overflow-scrolling: touch;
          }
          .fsc-tab { flex-shrink: 0; font-size: 0.82rem; padding: 8px 11px; }
        }
      `}} />

      <div className="fsc-wrap">
        <h2 className="fsc-heading">See Talentix in Action 🚀</h2>

        <div className="fsc-layout">
          {/* Tab list */}
          <div className="fsc-tabs" role="tablist" aria-label="Feature tabs">
            {features.map((f, i) => (
              <button
                key={f.name}
                className={`fsc-tab${activeIndex === i ? ' fsc-active' : ''}`}
                role="tab"
                aria-selected={activeIndex === i}
                onClick={() => goTo(i)}
              >
                <span style={{ fontSize: '1.05rem' }}>{f.emoji}</span>
                <span>{f.name}</span>
                {activeIndex === i && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.45 }}>▶</span>
                )}
              </button>
            ))}
          </div>

          {/* Screenshot panel */}
          <div className="fsc-panel" role="tabpanel">
            <div className="fsc-img-wrap">
              <Image
                key={current.name}
                src={current.image}
                alt={current.name}
                fill
                style={{
                  objectFit: 'contain',
                  padding: '14px',
                  animation: 'fscImgFade 0.26s ease-out both',
                }}
                priority={activeIndex === 0}
                sizes="(max-width: 768px) 100vw, 860px"
              />
            </div>

            <div className="fsc-info">
              <span className="fsc-info-emoji">{current.emoji}</span>
              <div>
                <h3 className="fsc-info-name">{current.name}</h3>
                <p className="fsc-info-desc">{current.description}</p>
              </div>
            </div>

            <div className="fsc-dots">
              {features.map((_, i) => (
                <button
                  key={i}
                  className="fsc-dot"
                  style={{
                    width: activeIndex === i ? '26px' : '9px',
                    background: activeIndex === i ? '#f59e0b' : '#d1d5db',
                  }}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${features[i].name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
