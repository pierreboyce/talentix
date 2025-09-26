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

        <p style={{ fontSize: '1.15rem', color: '#374151', lineHeight: 1.8, background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '2px solid rgba(254, 240, 138, 0.5)', marginBottom: '32px' }}>
          Talentix offers engaging and practical workshops designed to prepare students for life beyond the classroom. Schools can choose between our two flagship sessions: FUTURE READY TEENS, a soft skills workshop, or TEENS & JOBS, a careers-focused workshop. Each session is interactive, youth-led, and tailored to help teenagers build confidence while gaining the tools they need to take their first steps into the world of work.
        </p>

        {/* What We Offer Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            🎯 What We Offer
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Soft Skills Development */}
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💪</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Soft Skills Development</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Building essential life skills like communication, resilience, self-awareness, and goal-setting that are crucial for personal and professional success.
              </p>
            </div>

            {/* Career Readiness */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Career Readiness</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Practical job-seeking skills including CV writing, interview preparation, application strategies, and understanding workplace expectations.
              </p>
            </div>

            {/* Interactive Learning */}
            <div style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎭</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Interactive Learning</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Engaging, hands-on activities and group discussions that make learning memorable and help students apply concepts immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Workshop Formats Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            📋 Our Workshop Sessions
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* FUTURE READY TEENS */}
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)', padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>💪</span> FUTURE READY TEENS
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
                FUTURE READY TEENS helps students aged 15–18 strengthen key soft skills that are vital for personal and professional growth.
              </p>
              <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li><strong>Focus:</strong> Self-awareness, resilience, communication</li>
                <li><strong>Duration:</strong> 90-120 minutes</li>
                <li><strong>Group Size:</strong> 15-30 students</li>
                <li><strong>Activities:</strong> Interactive exercises and goal-setting</li>
                <li><strong>Outcome:</strong> Enhanced confidence and adaptability</li>
              </ul>
            </div>

            {/* TEENS & JOBS */}
            <div style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #7c3aed 100%)', padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🚀</span> TEENS & JOBS
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.8, marginBottom: '16px' }}>
                TEENS & JOBS equips teenagers with the knowledge and confidence to take their first steps into the world of work.
              </p>
              <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li><strong>Focus:</strong> Job applications, interviews, professionalism</li>
                <li><strong>Duration:</strong> 90-120 minutes</li>
                <li><strong>Group Size:</strong> 15-30 students</li>
                <li><strong>Activities:</strong> CV building and interview practice</li>
                <li><strong>Outcome:</strong> Job-ready skills and confidence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Skills Covered Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            📚 Key Skills Covered
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { emoji: '🗣️', title: 'Communication Skills', desc: 'Effective verbal and non-verbal communication techniques' },
              { emoji: '💼', title: 'Professional Presence', desc: 'Building confidence and professional demeanor' },
              { emoji: '📄', title: 'CV & Applications', desc: 'Creating compelling CVs and job applications' },
              { emoji: '🤝', title: 'Interview Techniques', desc: 'Mastering interview skills and common questions' },
              { emoji: '🎯', title: 'Goal Setting', desc: 'Setting and achieving realistic career objectives' },
              { emoji: '🧠', title: 'Self-Awareness', desc: 'Understanding strengths and areas for development' }
            ].map((skill, index) => (
              <div key={index} style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #0ea5e9 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{skill.emoji}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{skill.title}</h4>
                <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.5 }}>{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #16a34a 100%)', padding: '32px', borderRadius: '20px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
            💬 What Schools Are Saying
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <div style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0 }}>
              <Image src="/st-albans-academy.png" alt="Ark St Alban's Academy" fill sizes="80px" style={{ objectFit: 'contain' }} />
            </div>
            <blockquote style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#374151', lineHeight: 1.7, maxWidth: '600px', textAlign: 'left' }}>
              "The Talentix workshop was exactly what our Year 11s needed. Pierre connected with the students in a way that felt real and relatable, and they left with stronger CVs, more confidence, and real motivation to apply for jobs. We'll definitely be inviting him back."
            </blockquote>
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>
            - Charlene Steele, Careers Leader at Ark St Alban's Academy
          </p>
        </div>

        {/* Booking Information */}
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            📅 Booking Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>Ready to Book?</h3>
              <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: '20px', marginBottom: '20px' }}>
                <li>✅ Available for schools across the UK</li>
                <li>✅ Flexible scheduling to suit your timetable</li>
                <li>✅ All materials and resources provided</li>
                <li>✅ Interactive activities and take-home guides</li>
                <li>✅ Competitive rates with educational discounts</li>
              </ul>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => router.push('/contact')}
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 25px rgba(22, 163, 74, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(22, 163, 74, 0.3)';
                  }}
                >
                  📞 Book a Workshop
                </button>
                
                <button
                  onClick={() => window.open('mailto:talentixuk@gmail.com?subject=Workshop Inquiry', '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 25px rgba(14, 165, 233, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)';
                  }}
                >
                  ✉️ Email Us
                </button>
              </div>
            </div>
            
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)', padding: '24px', borderRadius: '16px' }}>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px', textAlign: 'center' }}>
                🎉 Special Offer
              </h4>
              <p style={{ color: '#374151', textAlign: 'center', lineHeight: 1.6, fontSize: '1rem' }}>
                Book both FUTURE READY TEENS and TEENS & JOBS workshops together and receive a <strong>15% discount</strong> on the total cost!
              </p>
              <p style={{ color: '#92400e', textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '12px' }}>
                *Perfect for comprehensive student development programs
              </p>
            </div>
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


