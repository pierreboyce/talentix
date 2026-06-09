'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import SignUpPromptModal from './SignUpPromptModal';

const FONT = "'Fredoka', 'Inter', sans-serif";

const features = [
  { name: 'Job Search',     emoji: '🔍', color: '#2563eb', route: '/search?q=jobs',    desc: 'Browse thousands of jobs from top UK companies' },
  { name: 'CV Reviewer',    emoji: '📄', color: '#16a34a', route: '/cv-reviewer',       desc: 'Get instant AI feedback on your CV' },
  { name: 'Interview Prep', emoji: '🎭', color: '#d97706', route: '/interview-prep',    desc: 'Practice with AI-tailored interview questions' },
  { name: 'Video Interview',emoji: '🎥', color: '#ec4899', route: '/video-interview',   desc: 'Record practice answers and get AI feedback' },
  { name: 'Job Tracker',    emoji: '📊', color: '#10b981', route: null,                 desc: 'Track every application in one place' },
  { name: 'Cover Letter',   emoji: '✍️', color: '#7c3aed', route: '/cover-letter',      desc: 'Generate tailored cover letters with AI' },
  { name: 'AI Chat',        emoji: '🤖', color: '#eab308', route: null,                 desc: 'Get personalised career advice instantly' },
  { name: 'Career Guidance',emoji: '📚', color: '#e53e3e', route: '/career-guidance',   desc: 'Expert advice and professional development' },
  { name: 'Talentix Points',emoji: '🏆', color: '#f59e0b', route: null,                 desc: 'Earn rewards for every step you take' },
];

export default function HomepageFeaturesCarousel() {
  const { user } = useAuth();
  const router = useRouter();
  const [signUpPrompt, setSignUpPrompt] = useState({ isOpen: false, featureName: '' });

  const handleClick = (f: typeof features[0]) => {
    if (f.name === 'AI Chat') {
      window.dispatchEvent(new CustomEvent('openAIChat'));
      return;
    }
    if (f.route) {
      router.push(f.route);
    } else if (!user) {
      setSignUpPrompt({ isOpen: true, featureName: f.name });
    }
  };

  const handleSignUpClick = () => {
    window.dispatchEvent(new CustomEvent('openSignUpModal'));
  };

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(32px, 5vw, 52px) clamp(16px, 4vw, 32px)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hfc-wrap { max-width: 1100px; margin: 0 auto; }
        .hfc-heading {
          text-align: center;
          margin: 0 0 28px;
          font-size: clamp(1.6rem, 3.5vw, 2.3rem);
          font-weight: 900;
          color: #111827;
          font-family: ${FONT};
        }
        .hfc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .hfc-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px 18px;
          border: 1.5px solid #f3f4f6;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hfc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.12);
        }
        .hfc-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .hfc-name {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
          color: #111827;
          font-family: ${FONT};
          line-height: 1.2;
        }
        .hfc-desc {
          margin: 0;
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.45;
          font-family: 'Inter', sans-serif;
          flex: 1;
        }
        .hfc-cta {
          font-size: 0.82rem;
          font-weight: 700;
          font-family: ${FONT};
          margin-top: 2px;
        }
        @media (max-width: 767px) {
          .hfc-grid { grid-template-columns: repeat(2, 1fr); gap: 11px; }
          .hfc-card { padding: 16px 14px; }
        }
        @media (max-width: 420px) {
          .hfc-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="hfc-wrap">
        <h2 className="hfc-heading">Everything You Need to Get Hired 🎯</h2>

        <div className="hfc-grid">
          {features.map((f) => (
            <div
              key={f.name}
              className="hfc-card"
              style={{ borderColor: `${f.color}22` }}
              onClick={() => handleClick(f)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${f.color}55`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${f.color}22`;
              }}
            >
              <div className="hfc-icon" style={{ background: `${f.color}18` }}>
                {f.emoji}
              </div>
              <h3 className="hfc-name">{f.name}</h3>
              <p className="hfc-desc">{f.desc}</p>
              <span className="hfc-cta" style={{ color: f.color }}>Try it →</span>
            </div>
          ))}
        </div>
      </div>

      <SignUpPromptModal
        isOpen={signUpPrompt.isOpen}
        onClose={() => setSignUpPrompt({ isOpen: false, featureName: '' })}
        featureName={signUpPrompt.featureName}
        onSignUpClick={handleSignUpClick}
      />
    </section>
  );
}
