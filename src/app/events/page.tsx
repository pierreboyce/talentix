import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events - Career Workshops & Webinars for UK Students | Talentix',
  description: 'Upcoming Talentix events including career workshops, webinars, and sessions for UK teenagers. Learn about job searching, interview prep, and getting your first job.',
  keywords: [
    'Talentix events',
    'career workshops UK',
    'teen career webinars',
    'student career events',
    'youth employment workshops',
    'career sessions UK',
    'teen job workshops',
    'career prep events UK'
  ],
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Events - Career Workshops for UK Students | Talentix',
    description: 'Upcoming Talentix events including career workshops and webinars for UK teenagers preparing for their first job.',
    url: 'https://talentix.co.uk/events',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Events - Career workshops for UK students' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Events for UK Students | Talentix',
    description: 'Upcoming Talentix events including career workshops and webinars for UK teenagers.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function EventsPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)',
          border: '1px solid #fde68a',
          boxShadow: '0 10px 30px rgba(253, 224, 71, 0.25)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '720px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '28px' }}>🎉</span>
          <h1 style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.2px' }}>Talentix Events</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Events are coming soon — workshops, webinars, community meetups and more.
        </p>
      </div>
    </main>
  );
}


