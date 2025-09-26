'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AssembliesDetailPage() {
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
          🎤 Assemblies
        </h1>
        <div style={{ position: 'relative', height: '360px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', marginBottom: '28px' }}>
          <Image src={'/vishnuassembly.jpeg'} alt="Talentix Assemblies" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>
        <p style={{ fontSize: '1.15rem', color: '#374151', lineHeight: 1.8, background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '2px solid rgba(254, 240, 138, 0.5)', marginBottom: '32px' }}>
          Inspiring and motivating talks that demystify careers, showcase real pathways, and equip students with the mindset to take their first step confidently. Our assemblies are designed to spark curiosity, build confidence, and provide practical guidance for students ready to explore their future.
        </p>

        {/* What We Offer Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            🎯 What We Offer
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {/* Career Demystification */}
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Career Demystification</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Breaking down complex career paths into understandable steps, showing students that their dream jobs are more achievable than they think.
              </p>
            </div>

            {/* Real Success Stories */}
            <div style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #22c55e 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌟</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Real Success Stories</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Sharing authentic stories from young people who've successfully navigated their career journeys, making success feel relatable and attainable.
              </p>
            </div>

            {/* Practical Guidance */}
            <div style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛠️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>Practical Guidance</h3>
              <p style={{ color: '#374151', lineHeight: 1.6 }}>
                Providing actionable steps students can take immediately, from CV writing tips to interview techniques and job search strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Assembly Formats Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            📋 Assembly Formats
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Standard Assembly */}
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)', padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>⏰</span> Standard Assembly
              </h3>
              <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li><strong>Duration:</strong> 45-60 minutes</li>
                <li><strong>Audience:</strong> Whole year groups (100-300 students)</li>
                <li><strong>Format:</strong> Interactive presentation with Q&A</li>
                <li><strong>Focus:</strong> Career inspiration and practical next steps</li>
                <li><strong>Takeaways:</strong> Resource pack with actionable tips</li>
              </ul>
            </div>

            {/* Extended Workshop */}
            <div style={{ background: 'linear-gradient(135deg, #ddd6fe 0%, #7c3aed 100%)', padding: '28px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🎯</span> Extended Workshop
              </h3>
              <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: '20px' }}>
                <li><strong>Duration:</strong> 90-120 minutes</li>
                <li><strong>Audience:</strong> Smaller groups (30-60 students)</li>
                <li><strong>Format:</strong> Hands-on activities and group discussions</li>
                <li><strong>Focus:</strong> Deep-dive into specific career areas</li>
                <li><strong>Takeaways:</strong> Personal action plans and follow-up support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Topics Section */}
        <div style={{ background: 'rgba(255,255,255,0.9)', padding: '32px', borderRadius: '20px', marginBottom: '32px', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            📚 Key Topics Covered
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { emoji: '💼', title: 'Job Market Reality', desc: 'Understanding current opportunities for young people' },
              { emoji: '📄', title: 'CV Essentials', desc: 'Creating standout CVs without extensive experience' },
              { emoji: '🤝', title: 'Interview Success', desc: 'Confidence-building techniques and common questions' },
              { emoji: '🔍', title: 'Job Search Strategy', desc: 'Where and how to find the right opportunities' },
              { emoji: '💪', title: 'Transferable Skills', desc: 'Recognizing and articulating your existing strengths' },
              { emoji: '🎯', title: 'Goal Setting', desc: 'Creating realistic and achievable career milestones' }
            ].map((topic, index) => (
              <div key={index} style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #0ea5e9 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{topic.emoji}</div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>{topic.title}</h4>
                <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.5 }}>{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #16a34a 100%)', padding: '32px', borderRadius: '20px', marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
            💬 What Schools Are Saying
          </h2>
          <blockquote style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#374151', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto 20px' }}>
            "The Talentix assembly was exactly what our students needed. Pierre connected with them in a way that felt authentic and inspiring. Students left feeling motivated and equipped with practical steps they could take immediately."
          </blockquote>
          <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>
            - Sarah Mitchell, Head of Careers, Westfield Academy
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
                <li>✅ All equipment and materials provided</li>
                <li>✅ Follow-up resources for continued learning</li>
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
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(22, 163, 74, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(22, 163, 74, 0.3)';
                  }}
                >
                  📞 Book an Assembly
                </button>
                
                <button
                  onClick={() => window.open('mailto:talentixuk@gmail.com?subject=Assembly Inquiry', '_blank')}
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
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(14, 165, 233, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 165, 233, 0.3)';
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
                Book your first assembly with Talentix and receive a <strong>FREE follow-up workshop</strong> for a smaller group of interested students!
              </p>
              <p style={{ color: '#92400e', textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '12px' }}>
                *Limited time offer for new school partnerships
              </p>
            </div>
          </div>
        </div>
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


