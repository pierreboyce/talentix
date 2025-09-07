'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { user, updateUser, signOut } = useAuth();
  const router = useRouter();
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
    emoji: '😊'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    tipOfTheDay: true,
    achievementAlerts: true,
    weeklyDigest: false
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    shareProgress: false,
    analyticsOptIn: true
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      location: user.location || '',
      emoji: user.emoji || '😊'
    });
  }, [user, router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateUser(profileData);
      showMessage('success', 'Profile updated successfully! 🎉');
    } catch (error) {
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you'd call an API to change password
      // For now, we'll just show a success message
      showMessage('success', 'Password changed successfully! 🔐');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        try {
          // In a real app, you'd call an API to delete the account
          showMessage('success', 'Account deletion initiated. You will be signed out shortly.');
          setTimeout(() => {
            signOut();
            router.push('/');
          }, 3000);
        } catch (error) {
          showMessage('error', 'Failed to delete account. Please contact support.');
        }
      }
    }
  };

  const emojiOptions = ['😊', '😎', '🤔', '😄', '🥳', '🤗', '😇', '🙂', '😌', '🥰', '😍', '🤩', '😋', '🤓', '🧐', '🤠'];

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
      padding: '40px 20px',
      fontFamily: 'Fredoka'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#000',
          margin: '0 0 16px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          ⚙️ Settings
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#374151',
          margin: '0 auto',
          maxWidth: '600px'
        }}>
          Customize your Talentix experience and manage your account preferences
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div style={{
          maxWidth: '800px',
          margin: '0 auto 20px auto',
          padding: '12px 20px',
          borderRadius: '12px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: message.type === 'success' ? '#166534' : '#dc2626',
          border: `2px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '40px'
      }}>
        {/* Sidebar Navigation */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '30px',
          height: 'fit-content',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '3px solid #fbbf24'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            margin: '0 0 24px 0'
          }}>
            Settings Menu
          </h2>
          
          {[
            { id: 'profile', icon: '👤', label: 'Profile Settings' },
            { id: 'password', icon: '🔐', label: 'Password & Security' },
            { id: 'notifications', icon: '🔔', label: 'Notifications' },
            { id: 'privacy', icon: '🛡️', label: 'Privacy & Data' },
            { id: 'account', icon: '⚠️', label: 'Account Management' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                padding: '16px 20px',
                margin: '0 0 12px 0',
                backgroundColor: activeSection === section.id ? '#fbbf24' : '#f9fafb',
                border: `2px solid ${activeSection === section.id ? '#f59e0b' : '#e5e7eb'}`,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: activeSection === section.id ? 'bold' : '500',
                color: activeSection === section.id ? '#000' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '3px solid #fbbf24'
        }}>
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#000',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                👤 Profile Settings
              </h2>
              
              <form onSubmit={handleProfileUpdate}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="e.g., London, UK"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px'
                  }}>
                    Profile Emoji
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: '8px'
                  }}>
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setProfileData({...profileData, emoji})}
                        style={{
                          width: '50px',
                          height: '50px',
                          border: `3px solid ${profileData.emoji === emoji ? '#fbbf24' : '#e5e7eb'}`,
                          borderRadius: '12px',
                          backgroundColor: profileData.emoji === emoji ? '#fef3c7' : '#ffffff',
                          fontSize: '1.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (profileData.emoji !== emoji) {
                            e.currentTarget.style.borderColor = '#d1d5db';
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (profileData.emoji !== emoji) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? 'Updating...' : 'Update Profile ✨'}
                </button>
              </form>
            </div>
          )}

          {/* Password Settings */}
          {activeSection === 'password' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#000',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🔐 Password & Security
              </h2>
              
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '32px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fbbf24';
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#f9fafb';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '14px 28px',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? 'Changing...' : 'Change Password 🔐'}
                </button>
              </form>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#000',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🔔 Notification Preferences
              </h2>
              
              {Object.entries({
                emailNotifications: { label: 'Email Notifications', desc: 'Receive updates and alerts via email' },
                jobAlerts: { label: 'Job Alerts', desc: 'Get notified about new job opportunities' },
                tipOfTheDay: { label: 'Daily Career Tips', desc: 'Receive daily career advice and tips' },
                achievementAlerts: { label: 'Achievement Notifications', desc: 'Get notified when you earn points or certificates' },
                weeklyDigest: { label: 'Weekly Progress Digest', desc: 'Weekly summary of your activity and progress' }
              }).map(([key, setting]) => (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  marginBottom: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0 0 4px 0'
                    }}>
                      {setting.label}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {setting.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [key]: !notificationSettings[key as keyof typeof notificationSettings]
                    })}
                    style={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      border: 'none',
                      backgroundColor: notificationSettings[key as keyof typeof notificationSettings] ? '#fbbf24' : '#d1d5db',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: notificationSettings[key as keyof typeof notificationSettings] ? '32px' : '2px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#000',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                🛡️ Privacy & Data
              </h2>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Profile Visibility
                </label>
                <select
                  value={privacySettings.profileVisibility}
                  onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    backgroundColor: '#f9fafb',
                    cursor: 'pointer'
                  }}
                >
                  <option value="private">Private - Only visible to you</option>
                  <option value="friends">Friends - Visible to connections only</option>
                  <option value="public">Public - Visible to everyone</option>
                </select>
              </div>

              {[
                { key: 'shareProgress', label: 'Share Progress with Others', desc: 'Allow others to see your achievements and progress' },
                { key: 'analyticsOptIn', label: 'Analytics & Improvements', desc: 'Help us improve Talentix by sharing anonymous usage data' }
              ].map((setting) => (
                <div key={setting.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  marginBottom: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#000',
                      margin: '0 0 4px 0'
                    }}>
                      {setting.label}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {setting.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => setPrivacySettings({
                      ...privacySettings,
                      [setting.key]: !privacySettings[setting.key as keyof typeof privacySettings]
                    })}
                    style={{
                      width: '60px',
                      height: '30px',
                      borderRadius: '15px',
                      border: 'none',
                      backgroundColor: privacySettings[setting.key as keyof typeof privacySettings] ? '#fbbf24' : '#d1d5db',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: privacySettings[setting.key as keyof typeof privacySettings] ? '32px' : '2px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Account Management */}
          {activeSection === 'account' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#000',
                margin: '0 0 24px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                ⚠️ Account Management
              </h2>
              
              <div style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#92400e',
                  margin: '0 0 12px 0'
                }}>
                  📊 Account Statistics
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '4px 0', color: '#92400e' }}>
                      <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '4px 0', color: '#92400e' }}>
                      <strong>Total points:</strong> {user.score || 0}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '4px 0', color: '#92400e' }}>
                      <strong>Last updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '4px 0', color: '#92400e' }}>
                      <strong>Profile completion:</strong> 85%
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#fee2e2',
                border: '2px solid #fecaca',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  margin: '0 0 12px 0'
                }}>
                  🗑️ Danger Zone
                </h3>
                <p style={{
                  color: '#7f1d1d',
                  marginBottom: '20px',
                  lineHeight: '1.5'
                }}>
                  Once you delete your account, there is no going back. This will permanently delete your profile, 
                  achievements, progress, and all associated data.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#b91c1c';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



