'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WorkshopsDetailPage() {
  const router = useRouter();
  const workshopImages = [
    '/Talentix%20Workshops%20Images/IMG_2234.jpeg',
    '/Talentix%20Workshops%20Images/IMG_2232.jpeg',
    '/Talentix%20Workshops%20Images/IMG_2230.jpeg',
    '/Talentix%20Workshops%20Images/IMG_2218.jpeg',
    '/Talentix%20Workshops%20Images/IMG_2228.jpeg',
  ];
  const [activeWorkshopImage, setActiveWorkshopImage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveWorkshopImage((current) => (current + 1) % workshopImages.length);
    }, 3200);
    return () => window.clearInterval(interval);
  }, [workshopImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('wp-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('[data-wp-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      emoji: '🎯',
      title: 'High Engagement',
      text: 'Youth-led delivery creates genuine connection and keeps sessions authentic, relatable, and practical.',
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
      border: '#f59e0b',
    },
    {
      emoji: '🚀',
      title: 'Career Ready Skills',
      text: 'CVs, applications, interviews, professionalism, and confidence students can use immediately.',
      gradient: 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)',
      border: '#8b5cf6',
    },
    {
      emoji: '🤝',
      title: 'Y10-13 + SEND Inclusive',
      text: 'Designed for secondary and post-16 learners with SEN-inclusive, easy-to-follow delivery.',
      gradient: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)',
      border: '#22c55e',
    },
  ];

  const workshopFormats = [
    {
      title: 'FUTURE READY TEENS',
      emoji: '💡',
      text: 'Build confidence, resilience, communication, and self-awareness for life beyond school.',
      focus: 'Personal branding, interview readiness, goal setting, and negotiation skills.',
      whatsIncluded:
        'Delivered as an interactive group session combining discussion, personal branding exercises, a mock interview activity with peer or staff feedback, and guided SMART goal-setting. Session length and delivery style are agreed with your school during the scoping call so it fits your timetable.',
      outcomes: [
        'In-depth personal branding awareness',
        'Mock interviews with peer/staff feedback',
        'SMART goals for personal and career growth',
        'Stronger communication, teamwork, and negotiation skills',
      ],
      color: '#f59e0b',
      bg: 'linear-gradient(135deg, #fff7cc 0%, #fde68a 100%)',
    },
    {
      title: 'TEENS & JOBS',
      emoji: '💼',
      text: 'Equip students with practical tools for job search, applications, and interview success.',
      focus: 'Job applications, interview performance, and workplace professionalism.',
      whatsIncluded:
        'Delivered as an interactive group session covering CV writing, cover letters, job applications, and mock interview practice with feedback. Students leave with a physical job toolkit they can refer back to. Session length and delivery style are agreed with your school during the scoping call.',
      outcomes: [
        'Ready-to-send CV and cover letter',
        'Mock interview practice and confidence boost',
        'Improved professionalism and employability awareness',
        'Physical job toolkit students can refer back to',
      ],
      color: '#7c3aed',
      bg: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)',
    },
  ];

  const faqs = [
    {
      question: 'How much does a workshop cost?',
      answer:
        "Pricing is bespoke and depends on three things: the size of your cohort, the length of the session, and which workshop format you choose (Future Ready Teens, Teens & Jobs, or a bespoke session built around your students). Email us those three details, or download our workshop proposal below, and we will come back with options and a written quote. If it's the first time we've worked with your school, you'll also get 15% off.",
    },
    {
      question: 'How long is a workshop session?',
      answer:
        'Session length is flexible and agreed during your scoping call so it fits your school timetable. Tell us how much time you have and we will build the content to match, rather than asking you to fit around a fixed format.',
    },
    {
      question: 'Do you cover SEN and SEND?',
      answer:
        'Yes. Every facilitator is DBS-checked and SEN-trained, and our sessions are fully adapted for SEN and SEND cohorts in both mainstream schools and specialist settings — plain-English language with visual prompts on every slide, and small-group activities so quieter students can contribute.',
    },
    {
      question: 'How do we book a workshop?',
      answer:
        'Email enquiries@talentix.co.uk with your cohort size, preferred session length, and workshop type, or download our workshop proposal using the link below. Every booking includes a short scoping call so we understand your students before we finalise the session and send a tailored quote.',
    },
    {
      question: 'What year groups do you work with?',
      answer:
        'Our workshops are designed for secondary students in Years 10 to 13, and we regularly deliver in sixth forms too. Content, pace, and language are adjusted to suit the age and stage of your specific cohort.',
    },
    {
      question: 'Do you provide materials afterward?',
      answer:
        "Yes. Students leave each session with a tangible output, such as a draft CV, a cover letter, a set of SMART goals, or a completed job-search toolkit, so the learning doesn't stop when the session ends.",
    },
    {
      question: "What's the difference between Future Ready Teens and Teens & Jobs?",
      answer:
        'Future Ready Teens focuses on confidence, communication, personal branding, and goal-setting. Teens & Jobs is more hands-on and application-focused: CVs, cover letters, job applications, and mock interview practice. Many schools book both across different year groups or as part of a bespoke session that blends the two.',
    },
  ];

  const impactStats = [
    { value: '94%', label: 'students rated workshops 5 stars and would recommend to other schools' },
    { value: '450', label: 'Year 11 students supported' },
    { value: '210', label: 'Year 12 students supported' },
    { value: '275', label: 'SEN students supported' },
  ];

  const kpiSupport = [
    'Keeping students in education through clearer direction and motivation',
    'Improving outcomes for vulnerable and SEND learners with practical confidence-building',
    'Helping students access training pathways, early careers programmes, and jobs',
    'Reducing disengagement and anti-social behaviour through future planning and relatable mentoring',
  ];

  const testimonials = [
    {
      context: 'Endeavour Academy Bexley booked a Talentix employability workshop and shared this feedback afterwards:',
      quote:
        "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students [...] I haven't seen them more engaged!",
      name: 'Emma Seffens',
      role: 'Careers Officer at Endeavour Academy Bexley',
    },
    {
      context: 'Ark St Albans Academy brought Talentix in to work with their Year 11 students:',
      quote:
        'The Talentix workshop was exactly what our Year 11s needed. They connected with the students in a way that felt real and relatable.',
      name: 'Charlene Steele',
      role: 'Careers Lead at Ark St Albans Academy',
    },
    {
      context: 'Feedback direct from a Year 10 student after a Talentix workshop:',
      quote: "Probably the best workshop I've ever had!",
      name: 'Teddy',
      role: 'Year 10',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fde047 0%, #facc15 35%, #f59e0b 100%)',
        padding: '40px 20px 60px',
        fontFamily: 'Fredoka, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* floating playful elements */}
      <div style={{ position: 'absolute', top: '4%', left: '6%', fontSize: '3.5rem', opacity: 0.16 }}>✨</div>
      <div style={{ position: 'absolute', top: '9%', right: '8%', fontSize: '4rem', opacity: 0.15 }}>🎉</div>
      <div style={{ position: 'absolute', bottom: '14%', left: '7%', fontSize: '3.2rem', opacity: 0.13 }}>🚀</div>
      <div style={{ position: 'absolute', bottom: '8%', right: '6%', fontSize: '3.8rem', opacity: 0.15 }}>💼</div>

      <style dangerouslySetInnerHTML={{ __html: `
        .workshops-hero-title-break {
          display: none;
        }
        .workshops-hero-scroll-cta {
          display: none;
        }
        .workshops-hero-title-accent {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 55%, #d97706 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .workshops-hero-eyebrow {
          background: #fff8ec;
          border: 1.5px solid rgba(217, 119, 6, 0.3);
          border-radius: 18px;
          padding: 10px 16px;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.1);
        }
        [data-wp-animate] {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 350ms ease-out, transform 350ms ease-out;
        }
        [data-wp-animate].wp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes workshopImgFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .workshop-carousel-img {
          animation: workshopImgFadeIn 0.45s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-wp-animate] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          .workshop-carousel-img {
            animation: none !important;
          }
        }
        @media (max-width: 600px) {
          .bespoke-topics-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .workshops-hero-eyebrow {
            display: flex !important;
            font-size: 0.78rem !important;
            font-weight: 700 !important;
            color: #b45309 !important;
            margin: 0 auto 14px !important;
            gap: 6px !important;
            line-height: 1.4 !important;
            max-width: 88% !important;
          }
          .workshops-hero-eyebrow span:first-child {
            font-size: 0.95rem !important;
            line-height: 1.4 !important;
          }
          .workshops-hero-title {
            font-size: clamp(1.6rem, 7.4vw, 2.05rem) !important;
            line-height: 1.2 !important;
            margin: 4px 0 10px !important;
          }
          .workshops-hero-title-break {
            display: block !important;
          }
          .workshops-hero-subtitle {
            display: none !important;
          }
          .workshops-hero-description {
            font-size: 0.82rem !important;
            line-height: 1.5 !important;
            margin-top: 6px !important;
          }
          .workshops-hero-scroll-cta {
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin: 16px auto 0;
            padding: 8px 16px;
            width: fit-content;
            border-radius: 999px;
            background: rgba(245, 158, 11, 0.12);
            color: #b45309;
            font-size: 0.85rem;
            font-weight: 700;
          }
          .workshops-hero-scroll-cta-arrow {
            display: inline-block;
            animation: workshopsScrollBounce 1.6s ease-in-out infinite;
          }
          @keyframes workshopsScrollBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(4px); }
          }
        }
      `}} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            background: 'rgba(255,255,255,0.72)',
            borderRadius: '28px',
            border: '2px solid rgba(255,255,255,0.75)',
            boxShadow: '0 18px 40px rgba(217, 119, 6, 0.22)',
            padding: '24px 20px 26px',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Image
            src="/talentixworkshopsupdatedlogo.png"
            alt="Talentix Workshops"
            width={340}
            height={150}
            style={{ width: 'min(230px, 55vw)', height: 'auto', margin: '0 auto 10px', display: 'block' }}
            priority
          />
          <div className="workshops-hero-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#374151', fontWeight: 700 }}>
            <span>🎨</span>
            <span>In-school employability workshops for mainstream, SEND and alternative provision students</span>
          </div>
          <h1
            className="workshops-hero-title"
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.6rem)',
              fontWeight: 900,
              color: '#111827',
              margin: '6px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.04,
            }}
          >
            Youth-Led Employability<br className="workshops-hero-title-break" /> Workshops for <span className="workshops-hero-title-accent">Schools & Colleges</span>
          </h1>
          <p className="workshops-hero-subtitle" style={{ maxWidth: '860px', margin: '4px auto 0', color: '#374151', fontWeight: 600, fontSize: '1.1rem' }}>
            Practical, interactive sessions that prepare students for jobs, apprenticeships and life beyond school
          </p>
          <p className="workshops-hero-description" style={{ maxWidth: '860px', margin: '12px auto 0', color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Talentix delivers employability workshops for students across UK schools. Sessions are youth-led, DBS-checked, and can be fully adapted for SEND and alternative provision cohorts. We work with mainstream schools, specialist SEN settings, colleges and sixth forms across the UK.
          </p>
          <div className="workshops-hero-scroll-cta">
            <span className="workshops-hero-scroll-cta-arrow">↓</span>
            Scroll down for more information
          </div>
        </div>

        {/* Hero grid — image + highlights */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '20px',
            marginBottom: '28px',
          }}
          className="workshop-hero-grid"
        >
          <div
            style={{
              position: 'relative',
              minHeight: '420px',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '4px solid rgba(255,255,255,0.9)',
              boxShadow: '0 24px 48px rgba(17, 24, 39, 0.22)',
            }}
          >
            <Image
              key={workshopImages[activeWorkshopImage]}
              src={workshopImages[activeWorkshopImage]}
              alt="Talentix SEN-inclusive employability workshop in a UK school"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="workshop-carousel-img"
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 35%, rgba(0,0,0,0) 70%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '16px',
                bottom: '16px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '999px',
                padding: '7px 10px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.14)',
              }}
              aria-label="Workshop image slide indicators"
            >
              {workshopImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveWorkshopImage(index)}
                  aria-label={`Show workshop image ${index + 1}`}
                  style={{
                    width: index === activeWorkshopImage ? '18px' : '8px',
                    height: '8px',
                    borderRadius: '999px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: index === activeWorkshopImage ? '#7c3aed' : '#cbd5e1',
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '28px',
              border: '2px solid rgba(255,255,255,0.8)',
              boxShadow: '0 18px 34px rgba(124, 58, 237, 0.2)',
              padding: '22px',
              display: 'grid',
              gap: '12px',
              alignContent: 'start',
            }}
          >
            {highlights.map((item) => (
              <div
                key={item.title}
                style={{
                  background: item.gradient,
                  borderRadius: '18px',
                  padding: '16px',
                  border: `2px solid ${item.border}55`,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{item.emoji}</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>{item.title}</h3>
                </div>
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.55, fontSize: '0.95rem' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workshop Formats */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 14px',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              color: '#111827',
            }}
          >
            📋 Workshop Formats
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }} className="formats-grid">
            {workshopFormats.map((format) => (
              <article
                key={format.title}
                style={{
                  background: format.bg,
                  borderRadius: '22px',
                  padding: '20px',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.13)',
                  border: `2px solid ${format.color}55`,
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: '1.35rem', color: '#111827', fontWeight: 900 }}>
                  {format.emoji} {format.title}
                </h3>
                <p style={{ margin: '0 0 8px', color: '#374151', lineHeight: 1.65 }}>{format.text}</p>
                <p style={{ margin: '0 0 10px', color: '#374151', lineHeight: 1.55, fontSize: '0.95rem' }}>
                  <strong>Focus:</strong> {format.focus}
                </p>
                <p style={{ margin: '0 0 10px', color: '#374151', lineHeight: 1.55, fontSize: '0.92rem' }}>
                  <strong>What's included:</strong> {format.whatsIncluded}
                </p>
                <p style={{ margin: '0 0 6px', color: '#111827', fontWeight: 800, fontSize: '0.88rem' }}>
                  Students leave with:
                </p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: 1.5, fontSize: '0.92rem' }}>
                  {format.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Bespoke sessions */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <article style={{ background: 'linear-gradient(135deg, #4ECDC4 0%, #4A90E2 100%)', borderRadius: '24px', border: '4px solid #ffffff', boxShadow: '0 16px 32px rgba(74, 144, 226, 0.3)', padding: '24px 22px', color: '#ffffff', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900 }}>🧩 Bespoke sessions</h3>
            <p style={{ margin: '0 auto 12px', maxWidth: '720px', lineHeight: 1.65, fontWeight: 500 }}>
              We also offer bespoke sessions for every school. Tell us about your students and we will tailor a workshop to suit their needs. Every booking includes a scoping call.
            </p>
            <p style={{ margin: '0 auto 20px', maxWidth: '720px', lineHeight: 1.65, fontWeight: 500, opacity: 0.95 }}>
              The scoping call is a short conversation with your careers lead or pastoral team before we finalise anything. We ask about your cohort, what you want students to leave with, and any SEN or SEND needs we should design around, then build the session content and pick topics from the list below to match.
            </p>
            <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: '1rem', opacity: 0.92 }}>
              Topics we can cover:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '10px',
              maxWidth: '860px',
              margin: '0 auto',
            }} className="bespoke-topics-grid">
              {[
                { n: 1,  label: 'CV building' },
                { n: 2,  label: 'Cover letters' },
                { n: 3,  label: 'Interview practice' },
                { n: 4,  label: 'SMART goal setting' },
                { n: 5,  label: 'Job search & applications' },
                { n: 6,  label: 'Personal branding' },
                { n: 7,  label: 'Communication skills' },
                { n: 8,  label: 'Confidence building' },
                { n: 9,  label: 'What jobs exist' },
                { n: 10, label: 'Workplace expectations' },
                { n: 11, label: 'LinkedIn & online presence' },
                { n: 12, label: 'Networking basics' },
                { n: 13, label: 'Teamwork & collaboration' },
                { n: 14, label: 'Time management' },
                { n: 15, label: 'Money & first payslip' },
                { n: 16, label: 'Motivation & next steps' },
              ].map(({ n, label }) => (
                <div
                  key={n}
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1.5px solid rgba(255,255,255,0.45)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    textAlign: 'left',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, opacity: 0.7, display: 'block', marginBottom: '2px' }}>
                    {String(n).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* The Numbers */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 14px',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              color: '#111827',
            }}
          >
            📈 The Numbers
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }} className="stats-grid">
            {impactStats.map((stat) => (
              <article
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.92)',
                  borderRadius: '18px',
                  padding: '14px',
                  border: '2px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#111827' }}>{stat.value}</p>
                <p style={{ margin: '4px 0 0', color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.45 }}>{stat.label}</p>
              </article>
            ))}
          </div>
        </section>

        {/* School Priorities */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 14px',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              color: '#111827',
            }}
          >
            🏫 How We Support School Priorities
          </h2>
          <div
            style={{
              background: 'rgba(255,255,255,0.93)',
              borderRadius: '24px',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 14px 30px rgba(0,0,0,0.12)',
              padding: '20px',
            }}
          >
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151', lineHeight: 1.8 }}>
              {kpiSupport.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Case Studies / Testimonials */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }} className="testimonials-grid">
            {testimonials.map((item) => (
              <article
                key={item.name}
                style={{
                  background: 'rgba(196, 181, 253, 0.22)',
                  borderRadius: '20px',
                  padding: '18px',
                  border: '2px solid rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 10px 20px rgba(124, 58, 237, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#6d5a8f',
                    textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.55)',
                    borderRadius: '999px',
                    padding: '5px 10px',
                  }}
                >
                  ⭐ Verified feedback
                </div>
                <p style={{ margin: '0 0 8px', color: '#7c7488', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.context}</p>
                <p style={{ margin: 0, color: '#4b4560', lineHeight: 1.6, fontWeight: 600 }}>"{item.quote}"</p>
                <p style={{ margin: '12px 0 0', color: '#4b4560', fontWeight: 800 }}>{item.name}</p>
                <p style={{ margin: '2px 0 0', color: '#7c7488', fontSize: '0.88rem' }}>{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        {/* What schools see */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <h2 style={{ textAlign: 'center', margin: '0 0 14px', fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)', fontWeight: 900, color: '#111827' }}>
            ✅ What schools see
          </h2>
          <p style={{ maxWidth: '780px', margin: '0 auto 18px', textAlign: 'center', color: '#374151', lineHeight: 1.7 }}>
            Careers leads and pastoral staff consistently tell us the same three things change after a Talentix workshop: students who usually disengage from careers content start participating, every student leaves with something concrete to show for the session, and staff notice a difference in confidence that carries beyond the workshop itself.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }} className="outcomes-grid">
            <article style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '20px', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>🙋 More engaged learners</h3>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.55, fontSize: '0.95rem' }}>Students who normally opt out of careers content stay in the room, ask questions, and contribute.</p>
            </article>
            <article style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '20px', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>📝 Tangible outputs</h3>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.55, fontSize: '0.95rem' }}>Each student leaves with something written down, like a draft CV, a goal, or a practised answer.</p>
            </article>
            <article style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '20px', border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>💪 Higher confidence</h3>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.55, fontSize: '0.95rem' }}>Staff report a measurable improvement in students willingness to apply and speak up.</p>
            </article>
          </div>
        </section>

        {/* SEN Impact + Youth-Led Approach, side by side and condensed */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }} className="approach-impact-grid">
            {/* SEN Impact */}
            <div style={{ background: 'linear-gradient(135deg, #e6faf8 0%, #c7f0ec 100%)', borderRadius: '22px', border: '3px solid rgba(78,205,196,0.6)', boxShadow: '0 12px 26px rgba(20, 120, 110, 0.18)', padding: '18px 20px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', fontWeight: 900, color: '#111827' }}>
                💛 Our SEN School Workshop Impact
              </h2>
              <p style={{ margin: '0 0 12px', color: '#374151', lineHeight: 1.55, fontSize: '0.92rem' }}>
                Off-the-shelf careers content rarely fits SEN and SEND cohorts, so we redesign every session from the ground up — plain-English language, visual prompts, and small-group activities matched to how your students learn.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '8px 10px', border: '2px solid rgba(78,205,196,0.5)', textAlign: 'center', flex: '1 1 auto' }}>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>500+</p>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '0.72rem', lineHeight: 1.3 }}>students engaged</p>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '8px 10px', border: '2px solid rgba(78,205,196,0.5)', textAlign: 'center', flex: '1 1 auto' }}>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>94%</p>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '0.72rem', lineHeight: 1.3 }}>would recommend us</p>
                </div>
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '8px 10px', border: '2px solid rgba(78,205,196,0.5)', textAlign: 'center', flex: '1 1 auto' }}>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>100%</p>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '0.72rem', lineHeight: 1.3 }}>DBS &amp; SEN-trained</p>
                </div>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: 1.5, fontSize: '0.88rem' }}>
                <li>Small-group activities so quieter students can contribute</li>
                <li>Youth-led facilitation removes the teacher/student power dynamic</li>
                <li>Take-home outputs so progress does not end at the door</li>
              </ul>
            </div>

            {/* Youth-Led Approach */}
            <div style={{ background: 'linear-gradient(135deg, #eaf2fd 0%, #e7ecfb 100%)', borderRadius: '22px', border: '3px solid rgba(74,144,226,0.55)', boxShadow: '0 12px 26px rgba(29, 78, 216, 0.16)', padding: '18px 20px' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', fontWeight: 900, color: '#111827' }}>
                🙌 Our Youth-Led Approach
              </h2>
              <p style={{ margin: '0 0 12px', color: '#374151', lineHeight: 1.55, fontSize: '0.92rem' }}>
                Our workshops are run by young people, not long out of school themselves. Being peer-led changes how the room feels — students drop their guard, ask the questions they actually have, and look up to a role model close to their own age.
              </p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: 1.5, fontSize: '0.88rem' }}>
                <li>A relatable role model students can aspire to</li>
                <li>Closeness in age means the message resonates and sticks</li>
                <li>The teacher/student power dynamic disappears, so quieter students speak up</li>
                <li>Sessions stay current and real, not a lecture from the front</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section data-wp-animate style={{ marginBottom: '30px' }}>
          <h2
            style={{
              textAlign: 'center',
              margin: '0 0 14px',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              color: '#111827',
            }}
          >
            ❓ Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', maxWidth: '1160px', margin: '0 auto' }} className="faq-grid">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                style={{
                  background: 'rgba(255,255,255,0.93)',
                  borderRadius: '18px',
                  border: '2px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  padding: '16px 18px',
                }}
              >
                <h3 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>{faq.question}</h3>
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.55, fontSize: '0.88rem' }}>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          data-wp-animate
          style={{
            background: 'linear-gradient(135deg, #f472b6 0%, #f59e0b 50%, #facc15 100%)',
            borderRadius: '28px',
            border: '2px solid rgba(255,255,255,0.8)',
            boxShadow: '0 22px 44px rgba(217, 119, 6, 0.34)',
            padding: '26px 22px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 900, color: '#111827' }}>
            🎉 Book an Employability School Workshop
          </h3>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 0 12px', background: '#111827', color: '#facc15', fontWeight: 800, fontSize: '0.9rem', borderRadius: '999px', padding: '7px 16px' }}>
            🏷️ New school? Get 15% off your first workshop
          </div>
          <p style={{ maxWidth: '760px', margin: '0 auto 10px', color: '#1f2937', fontWeight: 500 }}>
            For a quote, tell us three things: the size of your cohort, the length of the workshop, and the workshop type. Email us and we will come back with options.
          </p>
          <div style={{ maxWidth: '760px', margin: '0 auto 18px', textAlign: 'left', background: 'rgba(255,255,255,0.55)', borderRadius: '16px', padding: '16px 20px' }}>
            <p style={{ margin: '0 0 8px', color: '#111827', fontWeight: 800, fontSize: '0.95rem' }}>How booking works:</p>
            <ol style={{ margin: 0, paddingLeft: '20px', color: '#1f2937', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <li>Email us or download the proposal below with your cohort size, session length, and workshop type.</li>
              <li>We arrange a short scoping call to understand your students and what you want them to leave with.</li>
              <li>We send a tailored proposal and quote based on that call.</li>
              <li>Your facilitator delivers the workshop, and students leave with a take-home output.</li>
            </ol>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            <a
              href="/Talentix%20Workshops%20Proposal.pdf"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '13px 20px',
                borderRadius: '14px',
                background: 'white',
                color: '#111827',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 22px rgba(255,255,255,0.35)',
              }}
            >
              📄 Download our workshop proposal
            </a>
            <a
              href="mailto:enquiries@talentix.co.uk?subject=Workshop%20Booking%20Request"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '13px 20px',
                borderRadius: '14px',
                background: '#111827',
                color: '#fff',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 10px 22px rgba(17,24,39,0.3)',
              }}
            >
              🚀 Book a workshop
            </a>
          </div>
        </section>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              color: 'white',
              padding: '13px 24px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(0,0,0,0.22)',
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .workshop-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 880px) {
          .testimonials-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .outcomes-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .formats-grid {
            grid-template-columns: 1fr !important;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .faq-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .approach-impact-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }

          .outcomes-grid {
            grid-template-columns: 1fr !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .faq-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
