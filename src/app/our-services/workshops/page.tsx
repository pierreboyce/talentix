'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function WorkshopsDetailPage() {
  const router = useRouter();
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka, sans-serif'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: '24px' }}>
          🎨 Workshops
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
          <div style={{ position: 'relative', height: '260px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.15)' }}>
            <Image src={'/talentix our services.jpeg'} alt="Talentix Workshop 1" fill sizes="(max-width: 1200px) 33vw, 360px" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative', height: '260px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.15)' }}>
            <Image src={'/talentixworkshop2.jpeg'} alt="Talentix Workshop 2" fill sizes="(max-width: 1200px) 33vw, 360px" style={{ objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'relative', height: '260px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.15)' }}>
            <Image src={'/talentixworkshop 3.jpeg'} alt="Talentix Workshop 3" fill sizes="(max-width: 1200px) 33vw, 360px" style={{ objectFit: 'cover' }} />
          </div>
        </div>

        <p style={{ fontSize: '1.15rem', color: '#374151', lineHeight: 1.8, background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '2px solid rgba(254, 240, 138, 0.5)', marginBottom: '24px' }}>
          Talentix offers engaging and practical workshops designed to prepare students for life beyond the classroom. Schools can choose between our two flagship sessions: FUTURE READY TEENS, a soft skills workshop, or TEENS & JOBS, a careers-focused workshop. Each session is interactive, youth-led, and tailored to help teenagers build confidence while gaining the tools they need to take their first steps into the world of work.
        </p>

        {/* Testimonial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 12px 24px rgba(0,0,0,0.12)', border: '2px solid rgba(0,0,0,0.05)', marginBottom: '28px' }}>
          <div style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0 }}>
            <Image src="/st-albans-academy.png" alt="Ark St Alban’s Academy" fill sizes="80px" style={{ objectFit: 'contain' }} />
          </div>
          <blockquote style={{ fontStyle: 'italic', color: '#374151', lineHeight: 1.7 }}>
            “The Talentix workshop was exactly what our Year 11s needed. Pierre connected with the students in a way that felt real and relatable, and they left with stronger CVs, more confidence, and real motivation to apply for jobs. We’ll definitely be inviting him back.”
            <br />
            <span style={{ display: 'block', marginTop: '8px', fontWeight: 700 }}>- Charlene Steele, Careers Leader at Ark St Alban’s Academy</span>
          </blockquote>
        </div>

        {/* Two workshops */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 12px 24px rgba(0,0,0,0.12)', border: '3px solid transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#a78bfa'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginBottom: '10px' }}>FUTURE READY TEENS</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              FUTURE READY TEENS helps students aged 15–18 strengthen key soft skills that are vital for personal and professional growth. The workshop focuses on building self-awareness, resilience, communication, and goal-setting, leaving students with the confidence to present themselves effectively and the tools to adapt to future challenges.
            </p>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 12px 24px rgba(0,0,0,0.12)', border: '3px solid transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#34d399'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'; }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginBottom: '10px' }}>TEENS & JOBS</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              TEENS & JOBS equips teenagers with the knowledge and confidence to take their first steps into the world of work. From creating strong applications to preparing for interviews and understanding how to approach opportunities, this workshop ensures students leave with practical tools, improved professionalism, and the self-assurance to succeed in their early career journeys.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => router.push('/our-services')}
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              color: 'white', padding: '14px 28px', borderRadius: '14px', border: 'none', fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
          >
            ← Back to Services
          </button>
        </div>
      </div>
    </div>
  );
}


