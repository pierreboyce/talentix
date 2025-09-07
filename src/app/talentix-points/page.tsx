"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Award, Download, Star, Target, CheckCircle, Clock, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlocked: boolean;
  certificate?: string;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'milestone';
  progress: number;
  maxProgress: number;
}

export default function TalentixPoints() {
  const router = useRouter();
  const { user } = useAuth(); // Get actual user data
  
  const [currentView, setCurrentView] = useState<'overview' | 'achievements' | 'quests'>('overview');
  const { points: userPoints, addPoints } = usePoints(); // Use shared points context
  const { quests, getActiveQuests, getCompletedQuests } = useQuests(); // Use quest system
  
  // Get user's actual name or fallback to default
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix if no name
    return 'Talentix User'; // Final fallback
  };
  
  const levels = [
    { name: 'Bronze', points: 100, color: '#cd7f32', icon: '🥉' },
    { name: 'Silver', points: 500, color: '#c0c0c0', icon: '🥈' },
    { name: 'Gold', points: 1000, color: '#ffd700', icon: '🥇' },
    { name: 'Diamond', points: 2000, color: '#b9f2ff', icon: '💎' },
    { name: 'Platinum', points: 5000, color: '#e5e4e2', icon: '🏆' }
  ];
  
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (userPoints >= levels[i].points) {
        return levels[i];
      }
    }
    return { name: 'Beginner', points: 0, color: '#8b5cf6', icon: '🌟' };
  };
  
  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const currentIndex = levels.findIndex(level => level.name === currentLevel.name);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };
  
  // Level-based achievements (can download certificates)
  const levelAchievements: Achievement[] = [
    {
      id: 'bronze',
      name: 'Bronze Achiever',
      description: 'Reach 100 Talentix Points',
      points: 100,
      unlocked: userPoints >= 100
    },
    {
      id: 'silver',
      name: 'Silver Achiever', 
      description: 'Reach 500 Talentix Points',
      points: 500,
      unlocked: userPoints >= 500
    },
    {
      id: 'gold',
      name: 'Gold Achiever',
      description: 'Reach 1000 Talentix Points',
      points: 1000,
      unlocked: userPoints >= 1000
    },
    {
      id: 'diamond',
      name: 'Diamond Achiever',
      description: 'Reach 2000 Talentix Points',
      points: 2000,
      unlocked: userPoints >= 2000
    },
    {
      id: 'platinum',
      name: 'Platinum Achiever',
      description: 'Reach 5000 Talentix Points',
      points: 5000,
      unlocked: userPoints >= 5000
    }
  ];

  // Activity-based achievements (no certificates)
  const activityAchievements: Achievement[] = [
    {
      id: 'first_cv',
      name: 'CV Creator',
      description: 'Upload and analyze your first CV',
      points: 50,
      unlocked: true // Assuming they've done this
    },
    {
      id: 'interview_master',
      name: 'Interview Master',
      description: 'Complete 10 interview practice sessions',
      points: 150,
      unlocked: false
    },
    {
      id: 'job_hunter',
      name: 'Job Hunter',
      description: 'Apply to 5 jobs through Talentix',
      points: 100,
      unlocked: false
    }
  ];

  // Combined for backward compatibility
  const achievements: Achievement[] = [...levelAchievements, ...activityAchievements];

  // Using quests from QuestContext now
  /* 
  const quests: Quest[] = [
    {
      id: 'daily_login',
      title: 'Daily Login',
      description: 'Log in to Talentix today',
      xpReward: 10,
      completed: true,
      category: 'daily',
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'practice_interview',
      title: 'Practice Makes Perfect',
      description: 'Complete 3 interview questions',
      xpReward: 25,
      completed: false,
      category: 'daily',
      progress: 1,
      maxProgress: 3
    },
    {
      id: 'update_cv',
      title: 'CV Improvement',
      description: 'Update your CV using our template',
      xpReward: 30,
      completed: false,
      category: 'daily',
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'job_search',
      title: 'Job Explorer',
      description: 'Search and view 5 job listings',
      xpReward: 20,
      completed: false,
      category: 'daily',
      progress: 2,
      maxProgress: 5
    },
    {
      id: 'weekly_streak',
      title: 'Weekly Warrior',
      description: 'Complete daily quests for 7 days straight',
      xpReward: 100,
      completed: false,
      category: 'weekly',
      progress: 3,
      maxProgress: 7
    },
    {
      id: 'skill_builder',
      title: 'Skill Builder',
      description: 'Complete 20 interview questions this week',
      xpReward: 75,
      completed: false,
      category: 'weekly',
      progress: 8,
      maxProgress: 20
    },
    {
      id: 'career_milestone',
      title: 'Career Milestone',
      description: 'Get your first job through Talentix',
      xpReward: 500,
      completed: false,
      category: 'milestone',
      progress: 0,
      maxProgress: 1
    },
    {
      id: 'mentor',
      title: 'Become a Mentor',
      description: 'Help 5 other users with interview tips',
      xpReward: 200,
      completed: false,
      category: 'milestone',
      progress: 0,
      maxProgress: 5
    }
  ]; */
  
  // Debug function to add points
  const addDebugPoints = () => {
    addPoints(100, 'Debug points added');
  };

  const downloadCertificate = async (achievement: Achievement) => {
    const currentLevel = getCurrentLevel();
    const userName = getUserName(); // Get actual user name
    const certificateId = `TLX-${achievement.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    try {
      // Determine the level for the certificate image
      let level = 'Bronze'; // Default
      if (achievement.name.toLowerCase().includes('silver')) level = 'Silver';
      else if (achievement.name.toLowerCase().includes('gold')) level = 'Gold';
      else if (achievement.name.toLowerCase().includes('diamond')) level = 'Diamond';
      else if (achievement.name.toLowerCase().includes('platinum')) level = 'Platinum';

      // Call the API to generate personalized certificate image
      const response = await fetch('/api/certificates/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          userName,
          achievementName: achievement.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate certificate image');
      }

      // Download the generated image
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Talentix-${level}-Certificate-${userName.replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message with LinkedIn instructions
      setTimeout(() => {
        const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}/certificates/${certificateId}` : `https://talentix.vercel.app/certificates/${certificateId}`;
        alert(`🎉 Personalized certificate image downloaded successfully for ${userName}!\n\n📎 Ready for LinkedIn:\n• Certificate ID: ${certificateId}\n• Verification URL: ${verificationUrl}\n\n💡 Your certificate image now has your name on it!`);
      }, 500);

    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Sorry, there was an error generating your personalized certificate. Please try again.');
    }
  };

  const completeQuest = (questId: string) => {
    // This would update the quest completion status and award XP
    const quest = quests.find(q => q.id === questId);
    if (quest) {
      addPoints(quest.xpReward);
      alert(`Quest completed! You earned ${quest.xpReward} XP.`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
      display: 'flex'
    }}>
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        position: 'fixed',
        height: '100vh',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: '#fbbf24',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 Talentix Points
          </h1>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 12px 0', letterSpacing: '0.05em' }}>
            PROGRESS
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'achievements', label: 'Achievements', icon: '🏅' },
            { id: 'quests', label: 'Quests', icon: '⚡' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: currentView === item.id ? '#374151' : 'transparent',
                color: currentView === item.id ? '#ffffff' : '#9ca3af',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.backgroundColor = '#374151';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#9ca3af';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 12px 0', letterSpacing: '0.05em' }}>
            TOOLS
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ← Back to Dashboard
          </button>
          
          {/* Debug Button */}
          <button
            onClick={addDebugPoints}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'left',
              width: '100%',
              marginTop: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
            }}
          >
            🐛 Add 100 Points (Debug)
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '32px 48px'
      }}>
        {currentView === 'overview' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 16px 0'
              }}>
                Your Progress
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: '0'
              }}>
                Track your journey and unlock achievements to showcase your skills
              </p>
            </div>

            {/* Current Level Display */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                    {getCurrentLevel().icon} {getCurrentLevel().name}
                  </h2>
                  <p style={{ fontSize: '20px', color: '#4b5563', margin: '0' }}>
                    {userPoints.toLocaleString()} Talentix Points
                  </p>
                </div>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `conic-gradient(${getCurrentLevel().color} ${getNextLevel() ? (userPoints / getNextLevel()!.points) * 360 : 360}deg, #e5e7eb 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px'
                  }}>
                    {getCurrentLevel().icon}
                  </div>
                </div>
              </div>
              
              {getNextLevel() && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280' }}>
                      Progress to {getNextLevel()!.name} {levels.find(l => l.name === getNextLevel()!.name)?.icon}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#6b7280' }}>
                      {userPoints} / {getNextLevel()!.points}
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((userPoints / getNextLevel()!.points) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: '#fbbf24',
                      borderRadius: '6px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                  {achievements.filter(a => a.unlocked).length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Achievements Unlocked
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                  {quests.filter(q => q.completed).length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Quests Completed
                </div>
              </div>
              
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                border: '2px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                  {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  Progress Complete
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'achievements' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 16px 0'
              }}>
                Achievements
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: '0'
              }}>
                Unlock certificates to showcase your progress on LinkedIn and other platforms
              </p>
            </div>

            {/* Achievements Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px'
            }}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: `3px solid ${achievement.unlocked ? '#10b981' : '#e5e7eb'}`,
                    opacity: achievement.unlocked ? 1 : 0.6,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {achievement.unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: achievement.unlocked ? '#10b981' : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Award style={{
                        width: '32px',
                        height: '32px',
                        color: achievement.unlocked ? '#ffffff' : '#9ca3af'
                      }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: achievement.unlocked ? '#1f2937' : '#9ca3af',
                        margin: '0 0 4px 0'
                      }}>
                        {achievement.name}
                      </h3>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: achievement.unlocked ? '#10b981' : '#9ca3af'
                      }}>
                        {achievement.points} Points
                      </span>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    margin: '0 0 24px 0',
                    lineHeight: '1.5'
                  }}>
                    {achievement.description}
                  </p>
                  
                  {achievement.unlocked && (
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {/* Only show certificate download for level achievements */}
                      {levelAchievements.some(la => la.id === achievement.id) && (
                        <button
                          onClick={() => downloadCertificate(achievement)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                          }}
                        >
                          <Download style={{ width: '16px', height: '16px' }} />
                          Download Certificate
                        </button>
                      )}
                      
                      {/* Only show online certificate view for level achievements */}
                      {levelAchievements.some(la => la.id === achievement.id) && (
                        <button
                          onClick={() => {
                            // Generate a user-specific certificate ID
                            const levelCode = achievement.name.includes('Bronze') ? 'BRZ' : 
                                            achievement.name.includes('Silver') ? 'SLV' : 
                                            achievement.name.includes('Gold') ? 'GLD' : 
                                            achievement.name.includes('Diamond') ? 'DIA' : 
                                            achievement.name.includes('Platinum') ? 'PLA' : 'BRZ';
                            const certificateId = `TLX-${levelCode}-${Date.now().toString().slice(-6)}`;
                            router.push(`/certificates/${certificateId}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6';
                          }}
                        >
                          🌐 View Certificate Online
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {currentView === 'quests' && (
          <>
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 16px 0'
              }}>
                Daily Quests
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#4b5563',
                margin: '0'
              }}>
                Complete quests to earn XP and level up your Talentix journey
              </p>
            </div>

            {/* Quest Categories */}
            {['daily', 'weekly', 'milestone'].map((category) => (
              <div key={category} style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '24px' }}>
                    {category === 'daily' ? '📅' : category === 'weekly' ? '🗓️' : '🎯'}
                  </span>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0',
                    textTransform: 'capitalize'
                  }}>
                    {category} Quests
                  </h2>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '20px'
                }}>
                  {quests
                    .filter(quest => quest.category === category)
                    .map((quest) => (
                      <div
                        key={quest.id}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          padding: '24px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: `2px solid ${quest.completed ? '#10b981' : '#e5e7eb'}`,
                          opacity: quest.completed ? 0.8 : 1
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              margin: '0 0 8px 0'
                            }}>
                              {quest.title}
                            </h3>
                            <p style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              margin: '0 0 12px 0'
                            }}>
                              {quest.description}
                            </p>
                          </div>
                          
                          {quest.completed ? (
                            <CheckCircle style={{ width: '24px', height: '24px', color: '#10b981' }} />
                          ) : (
                            <Clock style={{ width: '24px', height: '24px', color: '#9ca3af' }} />
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Progress</span>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              {quest.progress} / {quest.maxProgress}
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
                              width: `${(quest.progress / quest.maxProgress) * 100}%`,
                              height: '100%',
                              backgroundColor: quest.completed ? '#10b981' : '#fbbf24',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Zap style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937'
                            }}>
                              +{quest.xpReward} XP
                            </span>
                          </div>

                          {quest.completed ? (
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#10b981',
                              backgroundColor: '#d1fae5',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}>
                              Completed
                            </span>
                          ) : quest.progress >= quest.maxProgress ? (
                            <button
                              onClick={() => completeQuest(quest.id)}
                              style={{
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Claim Reward
                            </button>
                          ) : (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}