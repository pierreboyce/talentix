'use client';

import { useRouter } from 'next/navigation';

export default function TermsOfService() {
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
          📋 Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: '24px' }}>
              By accessing and using Talentix ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Talentix is a career development platform that provides:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>CV analysis and improvement suggestions</li>
              <li>Video interview practice and feedback</li>
              <li>Career guidance and resources</li>
              <li>Job search assistance and opportunities</li>
              <li>Educational workshops and assemblies</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              3. User Accounts and Responsibilities
            </h2>
            <p style={{ marginBottom: '16px' }}>
              To use certain features of our service, you must create an account. You agree to:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              4. Subscription and Payment Terms
            </h2>
            <p style={{ marginBottom: '16px' }}>
              Our service offers both free and paid subscription tiers:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Free Tier:</strong> Limited access to basic features</li>
              <li><strong>Talentix Pro:</strong> £3.99/month or £30.99/year for unlimited access</li>
              <li><strong>Enterprise:</strong> Custom pricing for organizations</li>
            </ul>
            <p style={{ marginBottom: '24px' }}>
              Payments are processed securely through Stripe. Subscriptions automatically renew 
              unless cancelled. You may cancel at any time through your account settings.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              5. Acceptable Use Policy
            </h2>
            <p style={{ marginBottom: '16px' }}>
              You agree not to use the service to:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px' }}>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious content or spam</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass or harm other users</li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              6. Intellectual Property Rights
            </h2>
            <p style={{ marginBottom: '24px' }}>
              All content, features, and functionality of Talentix are owned by us and are protected 
              by copyright, trademark, and other intellectual property laws. You retain ownership of 
              content you upload but grant us a license to use it for providing our services.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              7. Limitation of Liability
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We provide our service "as is" without warranties of any kind. We shall not be liable 
              for any indirect, incidental, special, consequential, or punitive damages arising from 
              your use of the service.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              8. Termination
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We may terminate or suspend your account at any time for violations of these terms. 
              You may also terminate your account at any time. Upon termination, your right to use 
              the service will cease immediately.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              9. Changes to Terms
            </h2>
            <p style={{ marginBottom: '24px' }}>
              We reserve the right to modify these terms at any time. We will notify users of 
              significant changes. Continued use of the service after changes constitutes acceptance 
              of the new terms.
            </p>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
              10. Contact Information
            </h2>
            <p style={{ marginBottom: '16px' }}>
              For questions about these Terms of Service, please contact us:
            </p>
            <div style={{ 
              background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)', 
              padding: '20px', 
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Email: talentixuk@gmail.com</p>
              <p>We're here to help and will respond to your inquiries promptly.</p>
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

