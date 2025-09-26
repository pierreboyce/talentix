'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OurStoryPage() {
  const router = useRouter();

  const teamMembers = [
    {
      name: 'Pierre Boyce',
      title: 'Founder & CEO',
      image: '/pierre headshot.jpeg',
      story: 'Pierre founded Talentix after struggling to find work at 16 and realizing how few resources existed for young people starting their careers. He began sharing career advice on TikTok, growing to over 10,000 followers seeking guidance. When demand exceeded what social media could provide, Pierre created Talentix - a platform designed to give young people real career insights and opportunities that are often out of reach.',
      emoji: '🚀'
    },
    {
      name: 'Trey Alexander',
      title: 'Outreach and Engagement Coordinator',
      image: '/treyheadshot.jpeg',
      story: 'Trey will add his inspiring story here shortly...',
      emoji: '💡'
    },
    {
      name: 'Vishnu Vohra',
      title: 'Ambassador',
      image: '/vishnuheadshot.jpeg',
      story: `Vishnu is a motivated student from Hayes in West London with a passion for entrepreneurship and personal growth. Currently studying BTEC Business, CTEC IT, and BTEC Travel and Tourism, he is driven by purpose and sees every opportunity as a step towards success. Vishnu actively seeks work experience placements to build his leadership and communication skills, embracing growth and challenges with determination.`,
      emoji: '⚡'
    },
    {
      name: 'Mezue Onwumechili',
      title: 'Client Outreach Associate',
      image: '/mezueheadshot.png',
      story: 'Mezue will add his inspiring story here shortly...',
      emoji: '🎯'
    },
    {
      name: 'Arinze Nwafor',
      title: 'Business Development Manager',
      image: '/Arinzeheadshot.jpeg',
      story: 'Arinze will add his inspiring story here shortly...',
      emoji: '🤝'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fde047 0%, #facc15 50%, #eab308 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#374151',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          📖 Our Story
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#6b7280',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Meet the incredible team behind Talentix - passionate individuals dedicated to empowering your career journey! ✨
        </p>
      </div>

      {/* Team Members Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '40px',
        padding: '0 20px'
      }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '30px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              border: '3px solid transparent',
              position: 'relative' as const,
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(-8px) scale(1.02)';
              target.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
              target.style.borderColor = '#fde047';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.transform = 'translateY(0) scale(1)';
              target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              target.style.borderColor = 'transparent';
            }}
          >
            {/* Decorative Background Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200%',
              height: '200%',
              background: `linear-gradient(45deg, ${
                index === 0 ? '#fde047' : 
                index === 1 ? '#60a5fa' :
                index === 2 ? '#f472b6' : '#34d399'
              }20 0%, transparent 50%)`,
              borderRadius: '50%',
              zIndex: 0
            }} />

            {/* Profile Image */}
            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                border: '4px solid white',
                background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
              }}>
                                  <Image
                    src={member.image}
                    alt={member.name}
                    width={180}
                    height={180}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: member.name === 'Mezue Onwumechili' ? 'center top' : 'center center'
                    }}
                  onError={(e) => {
                    // Fallback to a placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="
                          width: 100%;
                          height: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 4rem;
                          background: linear-gradient(135deg, #fde047, #facc15);
                        ">
                          ${member.emoji}
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                marginBottom: '20px'
              }}>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {member.name}
                  <span style={{ fontSize: '2rem' }}>{member.emoji}</span>
                </h2>
                <p style={{
                  fontSize: '1.3rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  marginBottom: '20px'
                }}>
                  {member.title}
                </p>
              </div>

              <div style={{
                fontSize: '0.95rem',
                color: '#4b5563',
                lineHeight: '1.6',
                background: 'rgba(249, 250, 251, 0.8)',
                padding: '18px',
                borderRadius: '16px',
                border: '2px solid rgba(254, 240, 138, 0.3)'
              }}>
                <p>{member.story}</p>
              </div>

              {/* Fun decorative elements */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '3rem',
                opacity: 0.1,
                transform: 'rotate(15deg)'
              }}>
                ⭐
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '60px'
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '16px',
            border: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'Fredoka, sans-serif'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.transform = 'translateY(-3px) scale(1.05)';
            target.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
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


