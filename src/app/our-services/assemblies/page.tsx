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
        <p style={{ fontSize: '1.15rem', color: '#374151', lineHeight: 1.8, background: 'rgba(255,255,255,0.85)', padding: '20px', borderRadius: '16px', border: '2px solid rgba(254, 240, 138, 0.5)' }}>
          Inspiring and motivating talks that demystify careers, showcase real pathways, and equip students with the mindset to take their first step confidently.
        </p>
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


