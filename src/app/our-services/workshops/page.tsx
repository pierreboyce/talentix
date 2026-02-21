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
      quote:
        "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students [...] I haven't seen them more engaged!",
      name: 'Emma Seffens',
      role: 'Careers Officer at Endeavour Academy Bexley',
    },
    {
      quote:
        'The Talentix workshop was exactly what our Year 11s needed. They connected with the students in a way that felt real and relatable.',
      name: 'Charlene Steele',
      role: 'Careers Lead at Ark St Albans Academy',
    },
    {
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
      {/* floating playful elements */}
      <div style={{ position: 'absolute', top: '4%', left: '6%', fontSize: '3.5rem', opacity: 0.16 }}>✨</div>
      <div style={{ position: 'absolute', top: '9%', right: '8%', fontSize: '4rem', opacity: 0.15 }}>🎉</div>
      <div style={{ position: 'absolute', bottom: '14%', left: '7%', fontSize: '3.2rem', opacity: 0.13 }}>🚀</div>
      <div style={{ position: 'absolute', bottom: '8%', right: '6%', fontSize: '3.8rem', opacity: 0.15 }}>💼</div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#374151', fontWeight: 700 }}>
            <span>🎨</span>
            <span>Workshops for Schools & Youth Groups</span>
            </div>
          <Image
            src="/talentixworkshopslogo.png"
            alt="Talentix Workshops"
            width={340}
            height={150}
            style={{ width: 'min(340px, 75vw)', height: 'auto', margin: '0 auto 6px' }}
            priority
          />
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              color: '#111827',
              margin: '6px 0',
              letterSpacing: '-0.02em',
              lineHeight: 1.04,
            }}
          >
            Interactive, youth-led workshops
            <br />
            that students actually remember
          </h1>
          <p style={{ maxWidth: '860px', margin: '12px auto 0', color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem' }}>
            Talentix workshops blend confidence-building, employability training, and real-world practice into engaging sessions tailored for teenagers in SEND, secondary, and post-16 education.
              </p>
            </div>

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
              alt="Talentix workshop in action"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
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

        <section style={{ marginBottom: '30px' }}>
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
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: 1.5, fontSize: '0.92rem' }}>
                  {format.outcomes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
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

        <section style={{ marginBottom: '30px' }}>
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

        <section style={{ marginBottom: '30px' }}>
          <h2
                  style={{
              textAlign: 'center',
              margin: '0 0 14px',
              fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
              fontWeight: 900,
              color: '#111827',
            }}
          >
            💬 What People Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }} className="testimonials-grid">
            {testimonials.map((item) => (
              <article
                key={item.name}
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  padding: '18px',
                  border: '2px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
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
                    color: '#374151',
                    textTransform: 'uppercase',
                    background: '#fde68a',
                    borderRadius: '999px',
                    padding: '5px 10px',
                  }}
                >
                  ⭐ Verified feedback
              </div>
                <p style={{ margin: 0, color: '#1f2937', lineHeight: 1.6, fontWeight: 600 }}>"{item.quote}"</p>
                <p style={{ margin: '12px 0 0', color: '#111827', fontWeight: 800 }}>{item.name}</p>
                <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: '0.88rem' }}>{item.role}</p>
              </article>
            ))}
            </div>
        </section>

        <section
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
            🎉 Bring Talentix Workshops to Your School
          </h3>
          <p style={{ maxWidth: '760px', margin: '0 auto 18px', color: '#1f2937', fontWeight: 500 }}>
            Download our full proposal to see session outcomes, structure, and delivery options, or contact us to book directly.
          </p>
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
            onClick={() => router.push('/home')}
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

          .formats-grid {
            grid-template-columns: 1fr !important;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .testimonials-grid {
            grid-template-columns: 1fr !important;
          }

          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
