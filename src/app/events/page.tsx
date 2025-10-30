import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Talentix events are coming soon. Stay tuned for workshops, webinars and more!',
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


