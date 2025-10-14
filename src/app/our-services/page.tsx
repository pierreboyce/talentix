'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function OurServicesPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka, sans-serif'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '16px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          🛠️ Our Services
        </h1>
        <p style={{
          fontSize: '1.3rem', color: '#6b7280', maxWidth: '900px', margin: '0 auto', lineHeight: 1.6
        }}>
          Playful, practical and proven. We help schools and youth organisations bring careers to life.
        </p>
      </div>

      {/* Services Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '40px',
        padding: '0 20px'
      }}>
        {/* Workshops */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '3px solid transparent',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative' as const
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(-8px) scale(1.02)';
            target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
            target.style.borderColor = '#a78bfa';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(0) scale(1)';
            target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            target.style.borderColor = 'transparent';
          }}
        >
          <div style={{ position: 'relative', height: '280px', background: '#f3f4f6' }}>
            <Image
              src={'/talentix our services.jpeg'}
              alt="Talentix Workshops"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              style={{ objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.8)', padding: '8px 14px', borderRadius: '14px',
              fontWeight: 700, color: '#6d28d9'
            }}>🎨 Interactive</div>
          </div>
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Workshops</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              Hands-on sessions covering CV building, interview skills, job search strategy, and workplace confidence.
              Crafted to be fun, practical and age-appropriate.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => router.push('/our-services/workshops')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                  color: '#fff', padding: '12px 20px', borderRadius: '14px', border: 'none',
                  fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(139,92,246,0.3)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ⚡ Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Assemblies */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '3px solid transparent',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            position: 'relative' as const
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(-8px) scale(1.02)';
            target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
            target.style.borderColor = '#34d399';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(0) scale(1)';
            target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            target.style.borderColor = 'transparent';
          }}
        >
          <div style={{ position: 'relative', height: '280px', background: '#f3f4f6' }}>
            <Image
              src={'/vishnuassembly.jpeg'}
              alt="Talentix Assemblies"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              style={{ objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(255,255,255,0.8)', padding: '8px 14px', borderRadius: '14px',
              fontWeight: 700, color: '#065f46'
            }}>🎤 Inspiring</div>
          </div>
          <div style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Assemblies</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
              High-energy talks that demystify careers, showcase real opportunities and motivate students to take the first step.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => router.push('/our-services/assemblies')}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  color: '#fff', padding: '12px 20px', borderRadius: '14px', border: 'none',
                  fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                ⚡ Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            color: 'white', padding: '16px 32px', borderRadius: '16px', border: 'none',
            fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'Fredoka, sans-serif'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.transform = 'translateY(-3px) scale(1.05)';
            target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.transform = 'translateY(0) scale(1)';
            target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
          }}
        >
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
}

