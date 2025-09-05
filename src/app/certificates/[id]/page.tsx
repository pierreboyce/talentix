'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../../contexts/AuthContext';

interface Certificate {
  id: string;
  level: string;
  holderName: string;
  issueDate: string;
  credentialUrl: string;
  description: string;
  skills: string[];
  imageUrl: string;
  color: string;
  icon: string;
}

// Generate certificate data dynamically based on certificate ID
const generateCertificateData = (certificateId: string, userName: string = 'Talentix User'): Certificate | null => {
  const parts = certificateId.split('-');
  if (parts.length !== 3 || parts[0] !== 'TLX') return null;
  
  const levelCode = parts[1];
  let level: string;
  let color: string;
  let icon: string;
  let skills: string[];
  let description: string;
  
  switch (levelCode) {
    case 'BRZ':
      level = 'Bronze';
      color = '#cd7f32';
      icon = '🥉';
      skills = ['Job Search Strategy', 'Profile Building', 'Career Planning', 'Basic Networking'];
      description = 'Demonstrates foundational career development skills and completion of essential job search activities.';
      break;
    case 'SLV':
      level = 'Silver';
      color = '#c0c0c0';
      icon = '🥈';
      skills = ['Interview Skills', 'CV Writing', 'Professional Networking', 'Communication', 'Personal Branding'];
      description = 'Shows intermediate proficiency in interview skills, CV optimization, and professional networking.';
      break;
    case 'GLD':
      level = 'Gold';
      color = '#ffd700';
      icon = '🥇';
      skills = ['Advanced Interview Techniques', 'Career Strategy', 'Leadership', 'Industry Knowledge', 'Personal Branding'];
      description = 'Represents advanced career management skills, leadership potential, and comprehensive job market knowledge.';
      break;
    case 'DIA':
      level = 'Diamond';
      color = '#b9f2ff';
      icon = '💎';
      skills = ['Executive Presence', 'Strategic Thinking', 'Team Leadership', 'Business Acumen', 'Innovation'];
      description = 'Demonstrates exceptional leadership skills and strategic thinking capabilities in professional environments.';
      break;
    case 'PLA':
      level = 'Platinum';
      color = '#e5e4e2';
      icon = '🏆';
      skills = ['Visionary Leadership', 'Organizational Strategy', 'Change Management', 'Global Perspective', 'Legacy Building'];
      description = 'Represents mastery-level achievement in career development and leadership excellence.';
      break;
    default:
      return null;
  }
  
  return {
    id: certificateId,
    level,
    holderName: userName,
    issueDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    credentialUrl: `/certificates/${certificateId}`,
    description,
    skills,
    imageUrl: `/talentix${level.toLowerCase()}certificate.png`,
    color,
    icon
  };
};

export default function CertificateVerification() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user's actual name or fallback to default
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix if no name
    return 'Talentix User'; // Final fallback
  };

  useEffect(() => {
    const certificateId = params.id as string;
    const userName = getUserName();
    
    if (certificateId) {
      const generatedCertificate = generateCertificateData(certificateId, userName);
      if (generatedCertificate) {
        setCertificate(generatedCertificate);
      } else {
        setError('Certificate not found or invalid credential ID.');
      }
    } else {
      setError('No certificate ID provided.');
    }
    
    setLoading(false);
  }, [params.id, user]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #f59e0b', 
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ fontSize: '18px', color: '#1f2937' }}>Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>❌</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Certificate Not Found
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px' }}>
            {error || 'The certificate ID you provided is invalid or does not exist in our system.'}
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#fbbf24',
              color: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fbbf24';
            }}
          >
            Return to Talentix
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Talentix Certificate Verification
            </h1>
            <p style={{ fontSize: '18px', color: '#4b5563' }}>
              Official certificate verification system
            </p>
          </div>

          {/* Certificate Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.15)',
            border: '3px solid #e5e7eb'
          }}>
            
            {/* Verification Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              padding: '16px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              border: '2px solid #16a34a'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>✅</span>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a' }}>
                VERIFIED CERTIFICATE
              </span>
            </div>

            {/* Certificate Image */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'inline-block',
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '16px',
                border: '2px solid #e5e7eb'
              }}>
                <Image
                  src={certificate.imageUrl}
                  alt={`Talentix ${certificate.level} Certificate`}
                  width={400}
                  height={300}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
              </div>
            </div>

            {/* Certificate Details */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '48px', marginRight: '16px' }}>{certificate.icon}</span>
                <div>
                  <h2 style={{ 
                    fontSize: '32px', 
                    fontWeight: 'bold', 
                    color: certificate.color,
                    margin: '0'
                  }}>
                    {certificate.level} Level Achievement
                  </h2>
                  <p style={{ fontSize: '18px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Talentix Career Development Program
                  </p>
                </div>
              </div>

              {/* Recipient Info */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  Awarded to: {certificate.holderName}
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>
                  Issue Date: {new Date(certificate.issueDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Achievement Description
                </h4>
                <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
                  {certificate.description}
                </p>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  Skills Demonstrated
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {certificate.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '20px',
                        border: '1px solid #fbbf24'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certificate ID */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                    Certificate ID:
                  </span>
                  <span style={{ 
                    fontSize: '16px', 
                    color: '#1f2937', 
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {certificate.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>
                    Verification URL:
                  </span>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#2563eb', 
                    fontFamily: 'monospace'
                  }}>
                    {typeof window !== 'undefined' ? window.location.origin : 'talentix.vercel.app'}{certificate.credentialUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => window.open('https://www.linkedin.com/in/me/details/certifications/', '_blank')}
                style={{
                  backgroundColor: '#0077b5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#005885';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0077b5';
                }}
              >
                📎 Add to LinkedIn
              </button>
              
              <button
                onClick={() => router.push('/talentix-points')}
                style={{
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fbbf24';
                }}
              >
                🏆 View My Progress
              </button>

              <button
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                🏠 Back to Talentix
              </button>
            </div>
          </div>

          {/* LinkedIn Instructions */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            marginTop: '32px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
              📎 How to Add This Certificate to LinkedIn
            </h3>
            
            <div style={{ marginBottom: '24px' }}>
              <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '8px', fontSize: '16px', color: '#4b5563' }}>
                  Go to your LinkedIn profile and scroll to <strong>"Licenses & Certifications"</strong>
                </li>
                <li style={{ marginBottom: '8px', fontSize: '16px', color: '#4b5563' }}>
                  Click the <strong>+ icon</strong> to add a new certification
                </li>
                <li style={{ marginBottom: '8px', fontSize: '16px', color: '#4b5563' }}>
                  Fill out the form with these details:
                </li>
              </ol>
            </div>

            <div style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <strong style={{ color: '#1f2937' }}>Name:</strong> 
                  <span style={{ marginLeft: '8px', color: '#4b5563' }}>
                    Talentix {certificate.level} Level Achievement
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Issuing Organization:</strong> 
                  <span style={{ marginLeft: '8px', color: '#4b5563' }}>Talentix</span>
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Issue Date:</strong> 
                  <span style={{ marginLeft: '8px', color: '#4b5563' }}>
                    {new Date(certificate.issueDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Credential ID:</strong> 
                  <span style={{ marginLeft: '8px', color: '#4b5563', fontFamily: 'monospace' }}>
                    {certificate.id}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#1f2937' }}>Credential URL:</strong> 
                  <span style={{ marginLeft: '8px', color: '#2563eb', fontFamily: 'monospace' }}>
                    {typeof window !== 'undefined' ? window.location.origin : 'https://talentix.vercel.app'}{certificate.credentialUrl}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
              💡 <strong>Pro Tip:</strong> The credential URL allows LinkedIn visitors to verify your certificate 
              by clicking "See Credential" on your profile. This adds credibility to your achievements!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
