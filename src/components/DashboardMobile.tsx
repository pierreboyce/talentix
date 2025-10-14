'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { usePoints } from '../contexts/PointsContext';
import { 
  FileText, 
  Briefcase, 
  Video, 
  Trophy, 
  Target, 
  Star, 
  Award, 
  Users, 
  FileText as FileIcon, 
  BookOpen, 
  MessageCircle,
  Star as StarIcon
} from 'lucide-react';
import AppLauncher from './AppLauncher';

interface DashboardMobileProps {
  user: any;
  greeting: string;
  userName: string;
  displayEmoji: string;
  dailyTip: string;
  userPoints: number;
  getCurrentLevel: () => any;
  getNextLevel: () => any;
  levels: any[];
  handleEmojiPickerOpen: () => void;
  handleNameEditOpen: () => void;
  handlePointsNavigation: () => void;
  handleScrollLeft: () => void;
  handleScrollRight: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function DashboardMobile({
  user,
  greeting,
  userName,
  displayEmoji,
  dailyTip,
  userPoints,
  getCurrentLevel,
  getNextLevel,
  levels,
  handleEmojiPickerOpen,
  handleNameEditOpen,
  handlePointsNavigation,
  handleScrollLeft,
  handleScrollRight,
  scrollContainerRef
}: DashboardMobileProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Mobile Greeting & Job Tips Section */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-8">
        <div className="space-y-6">
          {/* Mobile Greeting Card */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <span className="text-[2rem]">{displayEmoji}</span>
            </div>
            <div className="flex-1">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 4px 0',
                  fontFamily: 'Fredoka'
                }}>
                  {greeting}
                </h2>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#4b5563',
                  margin: '0 0 12px 0'
                }}>
                  {userName}
                </h3>
                
                {/* Mobile Edit Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={handleEmojiPickerOpen}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      border: '2px solid #fbbf24',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      minHeight: '44px'
                    }}
                    className="dashboard-nav-btn"
                    title="Click to change your emoji"
                  >
                    ✏️ Edit Emoji
                  </button>
                  <button 
                    onClick={handleNameEditOpen}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffffff',
                      color: '#1f2937',
                      border: '2px solid #fbbf24',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      minHeight: '44px'
                    }}
                    className="dashboard-nav-btn"
                    title="Click to change your name"
                  >
                    ✏️ Edit Name
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Job Tips Card */}
          <div style={{
            backgroundColor: 'rgba(253, 224, 71, 0.1)',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid rgba(253, 224, 71, 0.3)',
            width: '100%'
          }}>
            <div className="text-center">
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#d97706',
                marginBottom: '8px',
                fontFamily: 'Fredoka'
              }}>
                💡 Job Tip of the Day
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: '1.5',
                margin: '0',
                fontWeight: '500'
              }}>
                {dailyTip || "Loading today's career tip..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Points Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8" style={{marginTop: '16px'}}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e5e7eb',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(${getCurrentLevel().color} ${getNextLevel() ? (userPoints / getNextLevel()!.points) * 360 : 360}deg, #e5e7eb 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {getCurrentLevel().icon}
              </div>
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
              {getCurrentLevel().name}
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563', margin: '0' }}>
              {userPoints.toLocaleString()} Talentix Points
            </p>
          </div>

          {getNextLevel() && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  Progress to {getNextLevel()!.name} {levels.find(l => l.name === getNextLevel()!.name)?.icon}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>
                  {userPoints} / {getNextLevel()!.points}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min((userPoints / getNextLevel()!.points) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: '#fbbf24',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handlePointsNavigation}
              style={{
                backgroundColor: '#fbbf24',
                color: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '44px',
                width: '100%'
              }}
              className="dashboard-points-btn"
            >
              View Full Progress & Achievements
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Feature Cards Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
        padding: '20px 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div 
            ref={scrollContainerRef}
            className="feature-cards-responsive"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              paddingLeft: '8px',
              paddingRight: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* CV Reviewer Card */}
            <div
              onClick={() => router.push('/cv-reviewer')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #ef4444, #f97316)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <FileText size={24} style={{ color: '#dc2626' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    CV Reviewer
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    AI-POWERED
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Get instant AI-powered feedback on your CV with personalized suggestions for improvement.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#059669',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Review My CV
              </div>
            </div>

            {/* Job Search Card */}
            <div
              onClick={() => router.push('/search')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Briefcase size={24} style={{ color: '#2563eb' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Job Search
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#dbeafe',
                    color: '#2563eb',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    LIVE JOBS
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Search thousands of job opportunities from top UK companies with smart filtering.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#059669',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Find Jobs
              </div>
            </div>

            {/* Interview Prep Card */}
            <div
              onClick={() => router.push('/interview-prep')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <Video size={24} style={{ color: '#7c3aed' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Interview Prep
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#f3e8ff',
                    color: '#7c3aed',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    PRACTICE
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Practice interviews with AI feedback to boost your confidence and performance.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#059669',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Start Practice
              </div>
            </div>

            {/* Career Guidance Card */}
            <div
              onClick={() => router.push('/career-guidance')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <BookOpen size={24} style={{ color: '#059669' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Career Guidance
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#dcfce7',
                    color: '#059669',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    EXPERT TIPS
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Access expert career advice and guidance articles to accelerate your job search.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#059669',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Read Articles
              </div>
            </div>

            {/* Video Interview Card */}
            <div
              onClick={() => router.push('/video-interview')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #ec4899, #be185d)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>🎬</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Video Interview
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#fce7f3',
                    color: '#be185d',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    PREMIUM
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Practice video interviews with AI feedback to improve your performance.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#be185d',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Start Practice
              </div>
            </div>

            {/* Job Tracker Card */}
            <div
              onClick={() => router.push('/job-tracker')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>📊</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Job Tracker
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#ccfbf1',
                    color: '#0d9488',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    ORGANIZE
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Track your job applications and manage your job search progress.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#0d9488',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Track Applications
              </div>
            </div>

            {/* Cover Letter Card */}
            <div
              onClick={() => router.push('/cover-letter')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>✍️</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Cover Letter
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    AI-POWERED
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Generate personalized cover letters with AI assistance for your applications.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#4f46e5',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Create Letter
              </div>
            </div>

            {/* Talentix Points Card */}
            <div
              onClick={() => router.push('/score')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #f97316, #ea580c)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Talentix Points
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#fed7aa',
                    color: '#ea580c',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    REWARDS
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Track your progress and earn points for completing career milestones.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#ea580c',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                View Progress
              </div>
            </div>

            {/* Subscription Card */}
            <div
              onClick={() => router.push('/dashboard/subscription')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #faf5ff, #e9d5ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>💎</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Subscription
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e9d5ff',
                    color: '#7c3aed',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    PREMIUM
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Manage your subscription and unlock premium features.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#7c3aed',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Manage Plan
              </div>
            </div>

            {/* Settings Card */}
            <div
              onClick={() => router.push('/settings')}
              className="dashboard-feature-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                minWidth: '280px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #6b7280, #4b5563)',
                borderRadius: '16px 16px 0 0'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #f9fafb, #e5e7eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '24px' }}>⚙️</span>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0',
                    fontFamily: 'Fredoka'
                  }}>
                    Settings
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e5e7eb',
                    color: '#4b5563',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginTop: '4px'
                  }}>
                    ACCOUNT
                  </span>
                </div>
              </div>
              
              <p style={{
                color: '#6b7280',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                Manage your account settings and preferences.
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '13px',
                color: '#4b5563',
                fontWeight: '600'
              }}>
                <span style={{ marginRight: '4px' }}>→</span>
                Open Settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chat Button */}
      <div
        onClick={() => router.push('/ai-chat')}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(6, 182, 212, 0.4)',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '3px solid #ffffff'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(6, 182, 212, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.4)';
        }}
      >
        <span style={{ fontSize: '28px' }}>🤖</span>
      </div>
    </div>
  );
}