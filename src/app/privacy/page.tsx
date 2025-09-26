'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          textAlign: 'center', 
          marginBottom: '32px' 
        }}>
          🔒 Privacy Policy
        </h1>

        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          padding: '32px', 
          borderRadius: '20px', 
          marginBottom: '32px', 
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)' 
        }}>
          <p style={{ color: '#6B7280', marginBottom: '24px', textAlign: 'center' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div style={{ color: '#374151', lineHeight: 1.8, fontSize: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This may include:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>Name and email address</li>
              <li>Profile information and preferences</li>
              <li>CV and career-related content you upload</li>
              <li>Usage data and analytics</li>
              <li>Communication records</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We use the information we collect to:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              3. Information Sharing and Disclosure
            </h2>
            <p style={{ marginBottom: '16px' }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except in the following circumstances:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              4. Data Security
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              5. Your Rights
            </h2>
            <p style={{ marginBottom: '16px' }}>
              You have the right to:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              6. Cookies and Tracking
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and provide personalized content. You can control cookie settings through your browser.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              7. Changes to This Policy
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by posting the new policy on this page.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              8. Contact Us
            </h2>
            <p style={{ marginBottom: '24px' }}>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)', 
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Email: talentixuk@gmail.com</p>
              <p>We're committed to protecting your privacy and will respond to your inquiries promptly.</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
              color: 'white', 
              padding: '14px 28px', 
              borderRadius: '14px', 
              border: 'none', 
              fontWeight: '800',
              cursor: 'pointer', 
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              fontSize: '1rem'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}