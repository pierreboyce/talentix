'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { Search, Briefcase, Calendar, Link as LinkIcon, ChevronDown, Check, X, Sparkles, Download, Trash2 } from 'lucide-react';

interface Apprenticeship {
  id: string;
  name: string;
  company: string;
  location: string;
  openDate: string;
  link: string;
  status: 'Not Started' | 'In Progress' | 'Applied' | 'Interview' | 'Rejected' | 'Accepted';
  field: string;
  type: string;
  applicationsCount?: number;
}

export default function ApprenticeshipTrackerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isMobile, isTablet } = useDeviceDetection();

  // State
  const [searchField, setSearchField] = useState('');
  const [apprenticeships, setApprenticeships] = useState<Apprenticeship[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<string | null>(null);

  // Load apprenticeships from localStorage on mount
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`apprenticeships-${user.id}`);
      if (saved) {
        try {
          setApprenticeships(JSON.parse(saved));
          setHasSearched(true);
        } catch (error) {
          console.error('Error loading apprenticeships:', error);
        }
      }
    }
  }, [user?.id]);

  // Save apprenticeships to localStorage whenever they change
  useEffect(() => {
    if (user?.id && apprenticeships.length > 0) {
      localStorage.setItem(`apprenticeships-${user.id}`, JSON.stringify(apprenticeships));
    }
  }, [apprenticeships, user?.id]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSearch = async () => {
    if (!searchField.trim()) {
      alert('Please enter a field of work (e.g., law, finance, tech)');
      return;
    }

    console.log('🔍 Search triggered', {
      apprenticeshipsCount: apprenticeships.length,
      userId: user?.id,
      hasExisting: apprenticeships.length > 0
    });

    // Check if user has apprenticeships and if they've disabled the modal
    if (apprenticeships.length > 0 && user?.id) {
      const dontShowPref = localStorage.getItem(`apprenticeship-modal-disabled-${user.id}`);
      console.log('📦 Modal preference:', dontShowPref);
      
      if (dontShowPref === 'true') {
        // Just add to existing apprenticeships
        console.log('⏭️ Skipping modal (user preference)');
        await performSearch(searchField.trim(), false);
        return;
      }

      // Show modal
      console.log('🎨 Showing modal!');
      setPendingSearch(searchField.trim());
      setShowClearModal(true);
      return;
    }

    // No existing apprenticeships, just search
    console.log('📝 No existing apprenticeships, searching directly');
    await performSearch(searchField.trim(), false);
  };

  const performSearch = async (field: string, clearExisting: boolean) => {
    if (clearExisting) {
      setApprenticeships([]);
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/apprenticeship/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field })
      });

      if (!response.ok) {
        throw new Error('Failed to search apprenticeships');
      }

      const data = await response.json();
      
      // Add unique IDs and the search field to each apprenticeship
      const newApprenticeships = data.apprenticeships.map((app: any, index: number) => ({
        ...app,
        id: `${Date.now()}-${index}`,
        status: 'Not Started' as const,
        field
      }));

      // Append to existing apprenticeships
      setApprenticeships(prev => [...prev, ...newApprenticeships]);
      setHasSearched(true);
      setSearchField('');
    } catch (error) {
      console.error('Error searching apprenticeships:', error);
      alert('Failed to search apprenticeships. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleModalKeepExisting = () => {
    if (dontShowAgain && user?.id) {
      localStorage.setItem(`apprenticeship-modal-disabled-${user.id}`, 'true');
    }
    if (pendingSearch) {
      performSearch(pendingSearch, false);
    }
    setShowClearModal(false);
    setPendingSearch(null);
    setDontShowAgain(false);
  };

  const handleModalClearAll = () => {
    if (dontShowAgain && user?.id) {
      localStorage.setItem(`apprenticeship-modal-disabled-${user.id}`, 'true');
    }
    if (pendingSearch) {
      performSearch(pendingSearch, true);
    }
    setShowClearModal(false);
    setPendingSearch(null);
    setDontShowAgain(false);
  };

  const handleModalCancel = () => {
    setShowClearModal(false);
    setPendingSearch(null);
    setDontShowAgain(false);
  };

  const updateStatus = (id: string, newStatus: Apprenticeship['status']) => {
    setApprenticeships(prev =>
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );
    setShowStatusDropdown(null);
  };

  const deleteApprenticeship = (id: string) => {
    if (confirm('Are you sure you want to remove this apprenticeship?')) {
      setApprenticeships(prev => prev.filter(app => app.id !== id));
    }
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all apprenticeships?')) {
      setApprenticeships([]);
      setHasSearched(false);
      if (user?.id) {
        localStorage.removeItem(`apprenticeships-${user.id}`);
      }
    }
  };

  const getStatusColor = (status: Apprenticeship['status']) => {
    switch (status) {
      case 'Not Started': return '#9ca3af';
      case 'In Progress': return '#3b82f6';
      case 'Applied': return '#8b5cf6';
      case 'Interview': return '#f59e0b';
      case 'Rejected': return '#ef4444';
      case 'Accepted': return '#10b981';
      default: return '#6b7280';
    }
  };

  const StatusDropdown = ({ apprenticeship }: { apprenticeship: Apprenticeship }) => {
    const statuses: Apprenticeship['status'][] = [
      'Not Started', 'In Progress', 'Applied', 'Interview', 'Rejected', 'Accepted'
    ];

    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowStatusDropdown(showStatusDropdown === apprenticeship.id ? null : apprenticeship.id)}
          style={{
            padding: isMobile ? '8px 12px' : '6px 10px',
            backgroundColor: getStatusColor(apprenticeship.status),
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: isMobile ? '13px' : '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {apprenticeship.status}
          <ChevronDown style={{ width: '14px', height: '14px' }} />
        </button>

        {showStatusDropdown === apprenticeship.id && (
          <>
            <div
              onClick={() => setShowStatusDropdown(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e5e7eb',
                zIndex: 1000,
                minWidth: '140px'
              }}
            >
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => updateStatus(apprenticeship.id, status)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: apprenticeship.status === status ? '#f3f4f6' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: apprenticeship.status === status ? '600' : '400',
                    color: '#1f2937',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderRadius: apprenticeship.status === status ? '6px' : '0'
                  }}
                  onMouseEnter={(e) => {
                    if (apprenticeship.status !== status) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (apprenticeship.status !== status) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: isMobile ? '20px' : '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: isMobile ? '24px' : '32px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isMobile ? '60px' : '70px',
            height: isMobile ? '60px' : '70px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '20px',
            marginBottom: '16px',
            boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.4)'
          }}>
            <Briefcase style={{ width: isMobile ? '28px' : '32px', height: isMobile ? '28px' : '32px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: '0 0 8px 0',
            fontFamily: "'Fredoka', 'Inter', sans-serif"
          }}>
            Apprenticeship Tracker
          </h1>
          <p style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Discover and track apprenticeship opportunities in your field
          </p>
        </div>

        {/* Search Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: isMobile ? '20px' : '28px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '12px',
            alignItems: isMobile ? 'stretch' : 'center'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '20px',
                height: '20px',
                color: '#9ca3af',
                pointerEvents: 'none'
              }} />
              <input
                type="text"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter field of work (e.g., law, finance, engineering, tech...)"
                disabled={isSearching}
                style={{
                  width: '100%',
                  padding: isMobile ? '14px 14px 14px 44px' : '12px 14px 12px 44px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchField.trim()}
              style={{
                padding: isMobile ? '14px 24px' : '12px 28px',
                background: isSearching || !searchField.trim() 
                  ? '#d1d5db' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSearching || !searchField.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isSearching || !searchField.trim() ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              {isSearching ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '18px', height: '18px' }} />
                  Search AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Apprenticeships Table */}
        {hasSearched && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: isMobile ? '16px' : '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}>
            {/* Header with Clear Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h2 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Your Apprenticeships ({apprenticeships.length})
              </h2>
              {apprenticeships.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  Clear All
                </button>
              )}
            </div>

            {apprenticeships.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: isMobile ? '40px 20px' : '60px 20px',
                color: '#9ca3af'
              }}>
                <Briefcase style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', margin: 0 }}>
                  No apprenticeships yet. Start by searching for a field!
                </p>
              </div>
            ) : (
              // Card Grid View - Same for both mobile and desktop
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: isMobile ? '16px' : '20px',
                padding: isMobile ? '0' : '4px'
              }}>
                {apprenticeships.map(app => {
                  // Get company logo from Clearbit or use first letter
                  const getCompanyLogo = (companyName: string) => {
                    const cleanName = companyName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
                    return `https://logo.clearbit.com/${cleanName}.com`;
                  };

                  return (
                    <div
                      key={app.id}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '20px',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {/* Company Logo + External Link */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <img
                          src={getCompanyLogo(app.company)}
                          alt={app.company}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            objectFit: 'contain',
                            backgroundColor: '#f9fafb',
                            padding: '8px'
                          }}
                          onError={(e) => {
                            // Fallback to initials if logo fails to load
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            backgroundColor: '#f9fafb',
                            display: 'none',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#3b82f6'
                          }}
                        >
                          {app.company.charAt(0).toUpperCase()}
                        </div>
                        <a
                          href={app.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#9ca3af',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                        >
                          <LinkIcon style={{ width: '20px', height: '20px' }} />
                        </a>
                      </div>

                      {/* Applications Count */}
                      {app.applicationsCount && (
                        <p style={{
                          fontSize: '11px',
                          color: '#9ca3af',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                          letterSpacing: '0.5px'
                        }}>
                          {app.applicationsCount} APPLICATIONS
                        </p>
                      )}

                      {/* Title */}
                      <h3 style={{
                        fontSize: isMobile ? '16px' : '18px',
                        fontWeight: '700',
                        color: '#1f2937',
                        margin: '0 0 8px 0',
                        lineHeight: '1.3',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.5px'
                      }}>
                        {app.name}
                      </h3>

                      {/* Company Name */}
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: '0 0 12px 0'
                      }}>
                        {app.company}
                      </p>

                      {/* Location */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9ca3af"/>
                        </svg>
                        <span style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {app.location}
                        </span>
                      </div>

                      {/* Type */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <Briefcase style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                        <span style={{
                          fontSize: '13px',
                          color: '#6b7280'
                        }}>
                          {app.type}
                        </span>
                      </div>

                      {/* Status and Delete */}
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        marginTop: 'auto',
                        paddingTop: '12px',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <div style={{ flex: 1 }}>
                          <StatusDropdown apprenticeship={app} />
                        </div>
                        <button
                          onClick={() => deleteApprenticeship(app.id)}
                          style={{
                            padding: '6px',
                            backgroundColor: '#fee2e2',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        >
                          <Trash2 style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Clear Apprenticeships Modal */}
      {showClearModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'slideUp 0.3s ease',
            position: 'relative'
          }}>
            {/* Decorative sparkles */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              animation: 'sparkle 2s ease-in-out infinite'
            }}>
              <Sparkles style={{ width: '24px', height: '24px', color: '#fbbf24' }} />
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              🎯 Hey there!
            </h3>

            {/* Message */}
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '24px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              You already have <strong>{apprenticeships.length}</strong> apprenticeship{apprenticeships.length !== 1 ? 's' : ''} saved.
              <br />
              What would you like to do?
            </p>

            {/* Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                onClick={handleModalKeepExisting}
                style={{
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                ✨ Keep & Add More
              </button>

              <button
                onClick={handleModalClearAll}
                style={{
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
              >
                🗑️ Clear & Start Fresh
              </button>

              <button
                onClick={handleModalCancel}
                style={{
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '500',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                Cancel
              </button>
            </div>

            {/* Checkbox */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  accentColor: '#10b981'
                }}
              />
              <span style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)',
                userSelect: 'none'
              }}>
                Don't show this again
              </span>
            </label>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
