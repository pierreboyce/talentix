"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function MobileComingSoon() {
  const [phase, setPhase] = useState<'intro' | 'comingSoon'>('intro');
  const [showWord1, setShowWord1] = useState(false);
  const [showWord2, setShowWord2] = useState(false);
  const [showWord3, setShowWord3] = useState(false);
  const [showImageLogo, setShowImageLogo] = useState(true);
  const [logoSrc, setLogoSrc] = useState('/tixlogo.png');
  const [adminPassword, setAdminPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const features: Array<{ text: string; emoji: string }> = [
    { text: 'Job Search', emoji: '🔍' },
    { text: 'Video Interviews', emoji: '🎥' },
    { text: 'Interview Prep', emoji: '🎤' },
    { text: 'Apprenticeship Tracker', emoji: '🛠️' },
    { text: 'Job Tracker', emoji: '📊' },
    { text: 'CV Reviewer', emoji: '📄' },
    { text: 'Cover Letter Maker', emoji: '✉️' },
    { text: 'Community', emoji: '👥' },
    { text: 'Talentix Points', emoji: '⭐' },
    { text: 'Career Guidance', emoji: '🧭' },
    { text: 'Free Templates', emoji: '📑' }
  ];
  const positions: Array<Partial<CSSStyleDeclaration>> = [
    { top: '6%', left: '6%' },
    { top: '10%', right: '6%' },
    { top: '20%', left: '8%' },
    { top: '24%', right: '8%' },
    { top: '34%', left: '4%' },
    { top: '36%', right: '4%' },
    { top: '46%', left: '4%' },
    { top: '48%', right: '4%' },
    { bottom: '18%', left: '6%' },
    { bottom: '18%', right: '6%' },
    { bottom: '8%', left: '8%' }
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % features.length), 2500);
    return () => clearInterval(id);
  }, [features.length]);

  useEffect(() => {
    // Simple sequenced intro: reveal words, then transition
    const t1 = setTimeout(() => setShowWord1(true), 300);
    const t2 = setTimeout(() => setShowWord2(true), 1200);
    const t3 = setTimeout(() => setShowWord3(true), 2000);
    const t4 = setTimeout(() => setPhase('comingSoon'), 3200);
    // lock scroll during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      {phase === 'intro' ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #111827 0%, #0b1020 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#fff',
            zIndex: 2147483646,
            overflow: 'hidden'
          }}
        >
          <div style={{ opacity: 0.2, position: 'absolute', inset: 0 }}>
            <div className="animate-float" style={{ position: 'absolute', top: '10%', left: '12%', fontSize: '4rem' }}>✨</div>
            <div className="animate-float-delayed" style={{ position: 'absolute', bottom: '15%', right: '10%', fontSize: '4rem' }}>🚀</div>
          </div>

          <img 
            src={logoSrc}
            alt="Talentix"
            width={160}
            height={72}
            style={{ marginBottom: 24, objectFit: 'contain', display: 'block' }}
            onError={() => setLogoSrc('/logo.png')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
            <span
              style={{
                opacity: showWord1 ? 1 : 0,
                transform: showWord1 ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '1px'
              }}
            >for <span style={{ color: '#fde047' }}>teenagers</span></span>
            <span
              style={{
                opacity: showWord2 ? 1 : 0,
                transform: showWord2 ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '1px'
              }}
            >by <span style={{ color: '#fde047' }}>teenagers</span></span>
            <span
              style={{
                opacity: showWord3 ? 1 : 0,
                transform: showWord3 ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
                fontSize: '0.95rem',
                color: '#9ca3af',
                fontWeight: 600
              }}
            >to help you get your first job</span>
          </div>

          <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', opacity: 0.8, fontSize: '0.9rem' }}>
            <span className="dot" style={{ animationDelay: '0s' }}>•</span>
            <span className="dot" style={{ animationDelay: '0.2s' }}>•</span>
            <span className="dot" style={{ animationDelay: '0.4s' }}>•</span>
          </div>

          {/* styles moved to global style at bottom to avoid nested styled-jsx */}
        </div>
      ) : null}

      {phase === 'comingSoon' ? (
        <div
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 8s ease infinite',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px 18px',
            textAlign: 'center',
            color: '#111827',
            position: 'relative'
          }}
        >
          {/* Playful floating feature names with emojis */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            {positions.map((pos, i) => {
              const feature = features[(i + tick) % features.length];
              const rotation = (i % 2 === 0 ? -6 : 6) + (i % 3 === 0 ? -2 : 0);
              const opacity = 0.08 + (i % 3) * 0.01;
              return (
              <div
                key={i}
                className={i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}
                style={{
                  position: 'absolute',
                  top: pos.top as any,
                  left: pos.left as any,
                  right: pos.right as any,
                  bottom: pos.bottom as any,
                  fontSize: '0.9rem',
                  color: `rgba(255,255,255,${opacity})`,
                  fontWeight: 900,
                  transform: `rotate(${rotation}deg)`,
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  filter: 'blur(0.2px)'
                }}
              >
                <span style={{ marginRight: 6 }}>{feature.emoji}</span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {feature.text}
                </span>
              </div>
              );
            })}
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 24, padding: '28px 22px', width: '100%', maxWidth: 420, boxShadow: '0 20px 50px rgba(0,0,0,0.25)', border: '2px solid rgba(255,255,255,0.6)', position: 'relative', zIndex: 2 }}>
            <a
              href="https://chat.whatsapp.com/DkkXdc9XTFPIERHJ5VpWVu?mode=wwt"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: 14,
                fontWeight: 800,
                textDecoration: 'none',
                marginBottom: 12,
                boxShadow: '0 10px 24px rgba(18, 140, 126, 0.35)'
              }}
            >
              Join our community
            </a>
            {showImageLogo ? (
              <img
                src={logoSrc}
                alt="Talentix"
                width={160}
                height={72}
                style={{ margin: '8px auto 12px auto', objectFit: 'contain', display: 'block' }}
                onError={() => { setShowImageLogo(false); setLogoSrc('/logo.png'); }}
              />
            ) : (
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                margin: '0 auto 12px auto',
                background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px'
              }}>
                talentix
              </div>
            )}
            {/* Admin Unlock Form */}
            <div style={{ margin: '4px 0 8px 0' }}>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setUnlockError(''); }}
                placeholder="Enter admin password"
                style={{
                  width: '70%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  outline: 'none',
                  color: '#6b7280',
                  backgroundColor: '#f9fafb',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <button
                onClick={() => {
                  if (adminPassword === 'yourfirstjob129') {
                    document.cookie = 'talentix_mobile_access=authenticated; path=/; max-age=86400';
                    setUnlockError('');
                    window.location.href = '/';
                  } else {
                    setUnlockError('Incorrect password');
                  }
                }}
                style={{
                  marginTop: 6,
                  width: '70%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontWeight: 700,
                  background: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  fontSize: '12px'
                }}
              >
                Unlock mobile access
              </button>
              {unlockError ? (
                <div style={{ color: '#ef4444', fontSize: '11px', marginTop: 4, fontWeight: 600, textAlign: 'center' }}>{unlockError}</div>
              ) : null}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mobile coming soon</h1>
            <p style={{ fontSize: '1rem', color: '#4b5563', margin: 0 }}>We’re building an awesome mobile experience for you. Check back soon!</p>
          </div>

          <div style={{ marginTop: 20, fontSize: '0.9rem', color: '#fff' }}>
            Questions? Email <a href="mailto:enquiries@talentix.co.uk" style={{ color: '#fde047', fontWeight: 700, textDecoration: 'none' }}>enquiries@talentix.co.uk</a>
          </div>

          {/* keyframes moved to global style at bottom */}
        </div>
      ) : null}

      {/* Hide global header/navigation on this route */}
      <style jsx global>{`
        header { display: none !important; }
        body { background: #0b1020; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float 5s ease-in-out infinite 0.6s; }
        .dot { display: inline-block; margin: 0 6px; opacity: 0.3; animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
}


