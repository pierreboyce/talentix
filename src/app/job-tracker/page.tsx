'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { Plus, Calendar, Building2, ExternalLink, Edit3, Trash2, Filter, Search } from 'lucide-react';
import AuthGuard from '../../components/AuthGuard';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  link?: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  notes?: string;
}

export default function JobTrackerPage() {
  const router = useRouter();
  const { isMobile, isTablet } = useDeviceDetection();
  
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    link: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'applied' as 'applied' | 'interview' | 'offer' | 'rejected',
    notes: ''
  });

  const [loading, setLoading] = useState(true);

  // Load applications from localStorage
  useEffect(() => {
    const savedApps = localStorage.getItem('jobApplications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
    setLoading(false);
  }, []);

  // Save applications to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('jobApplications', JSON.stringify(applications));
    }
  }, [applications, loading]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingApp) {
      // Update existing application
      setApplications(prev => prev.map(app => 
        app.id === editingApp.id 
          ? { ...app, ...formData }
          : app
      ));
    } else {
      // Add new application
      const newApp: JobApplication = {
        id: Date.now().toString(),
        ...formData
      };
      setApplications(prev => [...prev, newApp]);
    }
    
    handleCloseModal();
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      title: app.title,
      company: app.company,
      link: app.link || '',
      dateApplied: app.dateApplied,
      status: app.status,
      notes: app.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApp(null);
    setFormData({
      title: '',
      company: '',
      link: '',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'applied',
      notes: ''
    });
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    interviews: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer').length,
    responseRate: applications.length > 0 ? Math.round(((applications.filter(app => app.status !== 'applied').length) / applications.length) * 100) : 0
  };

  const statusConfig = {
    applied: { icon: '📝', label: 'Applied', color: '#3b82f6' },
    interview: { icon: '🎤', label: 'Interview', color: '#f59e0b' },
    offer: { icon: '🎉', label: 'Offer', color: '#10b981' },
    rejected: { icon: '❌', label: 'Rejected', color: '#ef4444' }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthGuard>
      <React.Fragment>
      {/* Add/Edit Modal - Moved to top level */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: isMobile ? 'blur(8px)' : 'blur(4px)',
            WebkitBackdropFilter: isMobile ? 'blur(8px)' : 'blur(4px)',
            display: 'flex',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: isMobile ? 'stretch' : 'center',
            zIndex: 9999999,
            padding: isMobile ? '0' : '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: isMobile ? '0' : '16px',
            padding: isMobile ? '20px' : '32px',
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px',
            height: isMobile ? '100vh' : 'auto',
            maxHeight: isMobile ? '100vh' : '90vh',
            boxShadow: isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: isMobile ? '24px' : '24px',
              paddingBottom: isMobile ? '16px' : '0',
              borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
              flexShrink: 0
            }}>
              <h2 style={{
                fontSize: isMobile ? '22px' : '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0',
                fontFamily: "'Fredoka', 'Inter', sans-serif"
              }}>
                {editingApp ? 'Edit Application' : 'Add New Application'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: isMobile ? '#f3f4f6' : 'none',
                  border: 'none',
                  fontSize: isMobile ? '20px' : '28px',
                  color: isMobile ? '#374151' : '#6b7280',
                  cursor: 'pointer',
                  padding: isMobile ? '12px' : '4px',
                  borderRadius: isMobile ? '8px' : '50%',
                  width: isMobile ? '44px' : 'auto',
                  height: isMobile ? '44px' : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: isMobile ? 'bold' : 'normal'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            {/* Form Content Wrapper */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: isMobile ? '4px' : '0'
            }}>
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '24px' : '20px',
                paddingBottom: isMobile ? '20px' : '0'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      minHeight: isMobile ? '52px' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      minHeight: isMobile ? '52px' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Job Posting Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      minHeight: isMobile ? '52px' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Date Applied *
                  </label>
                  <input
                    type="date"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      minHeight: isMobile ? '52px' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      backgroundColor: '#ffffff',
                      minHeight: isMobile ? '52px' : 'auto',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: isMobile ? '8px' : '6px'
                  }}>
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: isMobile ? '16px' : '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: isMobile ? '12px' : '8px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                    placeholder="Add any notes about this application..."
                  />
                </div>

                {/* Submit Button Container */}
                <div style={{
                  display: 'flex',
                  gap: isMobile ? '12px' : '12px',
                  justifyContent: isMobile ? 'stretch' : 'flex-end',
                  marginTop: isMobile ? '32px' : '24px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  {!isMobile && (
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    style={{
                      padding: isMobile ? '16px 24px' : '12px 24px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: isMobile ? '12px' : '8px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'background-color 0.2s ease',
                      minHeight: isMobile ? '52px' : 'auto',
                      width: isMobile ? '100%' : 'auto'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  >
                    {editingApp ? 'Update Application' : 'Add Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
        display: 'flex'
      }}>
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div style={{
          width: '280px',
          backgroundColor: '#1f2937',
          padding: '24px 0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}>
        {/* Logo */}
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fbbf24',
            margin: '0',
            fontFamily: "'Fredoka', 'Inter', sans-serif"
          }}>
            📋 Job Tracker
          </h1>
        </div>

        {/* Navigation */}
        <div style={{ padding: '0 16px', marginBottom: '32px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
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
        </div>

        {/* Stats */}
        <div style={{ padding: '0 16px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#9ca3af',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Quick Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '13px' }}>Total</span>
              <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>{stats.total}</span>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '13px' }}>Interviews</span>
              <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>{stats.interviews}</span>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '13px' }}>Offers</span>
              <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>{stats.offers}</span>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#374151',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '13px' }}>Response Rate</span>
              <span style={{ color: '#fbbf24', fontWeight: '600', fontSize: '14px' }}>{stats.responseRate}%</span>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        marginLeft: isMobile ? '0' : '280px',
        padding: isMobile ? '16px' : '32px',
        width: isMobile ? '100%' : 'calc(100% - 280px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: isMobile ? '24px' : '32px',
          gap: isMobile ? '16px' : '0'
        }}>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif",
              textAlign: isMobile ? 'center' : 'left'
            }}>
              📋 Job Applications
            </h1>
            <p style={{
              color: '#6b7280',
              margin: '0',
              fontSize: isMobile ? '14px' : '16px',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              Track your job applications and stay organized
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: isMobile ? '14px 20px' : '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: isMobile ? '12px' : '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              fontSize: isMobile ? '14px' : '16px',
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '48px' : 'auto',
              position: 'relative',
              zIndex: 99999,
              isolation: 'isolate',
              outline: 'none',
              touchAction: 'manipulation',
              userSelect: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Plus style={{ width: '20px', height: '20px', pointerEvents: 'none' }} />
            <span style={{ pointerEvents: 'none' }}>Add Application</span>
          </button>
        </div>

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '20px',
          marginBottom: isMobile ? '24px' : '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #3b82f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '6px' : '8px' }}>📊</div>
            <div style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#3b82f6',
              margin: '0 0 4px 0'
            }}>
              {stats.total}
            </div>
            <div style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>Total Applications</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #f59e0b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '6px' : '8px' }}>🎤</div>
            <div style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#f59e0b',
              margin: '0 0 4px 0'
            }}>
              {stats.interviews}
            </div>
            <div style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>Interviews</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #10b981',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '6px' : '8px' }}>🎉</div>
            <div style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#10b981',
              margin: '0 0 4px 0'
            }}>
              {stats.offers}
            </div>
            <div style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>Offers</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '16px' : '24px',
            borderRadius: isMobile ? '12px' : '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #8b5cf6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: isMobile ? '6px' : '8px' }}>📈</div>
            <div style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              margin: '0 0 4px 0'
            }}>
              {stats.responseRate}%
            </div>
            <div style={{ color: '#6b7280', fontSize: isMobile ? '12px' : '14px' }}>Response Rate</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '16px',
          marginBottom: isMobile ? '20px' : '24px'
        }}>
          <div style={{ position: 'relative', flex: '1' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: isMobile ? '14px 12px 14px 44px' : '12px 12px 12px 44px',
                border: '2px solid #e5e7eb',
                borderRadius: isMobile ? '10px' : '12px',
                fontSize: isMobile ? '16px' : '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                minHeight: isMobile ? '48px' : 'auto',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: isMobile ? '14px 16px' : '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: isMobile ? '10px' : '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              minHeight: isMobile ? '48px' : 'auto',
              width: isMobile ? '100%' : 'auto',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            padding: isMobile ? '32px 20px' : '48px',
            borderRadius: isMobile ? '12px' : '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: isMobile ? '12px' : '16px' }}>📋</div>
            <h3 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {applications.length === 0 ? 'No applications yet' : 'No applications found'}
            </h3>
            <p style={{ color: '#6b7280', margin: '0', fontSize: isMobile ? '14px' : '16px' }}>
              {applications.length === 0 
                ? 'Start tracking your job applications to stay organized!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: isMobile ? '16px' : '20px'
          }}>
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: isMobile ? '12px' : '16px',
                  padding: isMobile ? '20px' : '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: isMobile ? '12px' : '16px',
                  right: isMobile ? '12px' : '16px',
                  padding: isMobile ? '4px 10px' : '6px 12px',
                  backgroundColor: statusConfig[app.status].color,
                  color: '#ffffff',
                  borderRadius: '20px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {statusConfig[app.status].icon} {statusConfig[app.status].label}
                </div>

                {/* Content */}
                <div style={{ marginBottom: isMobile ? '12px' : '16px', paddingRight: isMobile ? '70px' : '80px' }}>
                  <h3 style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 8px 0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    {app.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <Building2 style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px', color: '#6b7280' }} />
                    <span style={{ color: '#6b7280', fontSize: isMobile ? '14px' : '16px', fontWeight: '500' }}>
                      {app.company}
                    </span>
                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                      </a>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#6b7280',
                    fontSize: isMobile ? '13px' : '14px'
                  }}>
                    <Calendar style={{ width: isMobile ? '14px' : '16px', height: isMobile ? '14px' : '16px' }} />
                    <span>Applied {new Date(app.dateApplied).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isMobile ? '6px' : '8px'
                  }}>
                    {Object.entries(statusConfig).map(([status, config], index) => (
                      <div
                        key={status}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          flex: 1
                        }}
                      >
                        <div style={{
                          width: isMobile ? '28px' : '32px',
                          height: isMobile ? '28px' : '32px',
                          borderRadius: '50%',
                          backgroundColor: app.status === status || 
                            (app.status === 'interview' && status === 'applied') ||
                            (app.status === 'offer' && (status === 'applied' || status === 'interview')) ||
                            (app.status === 'rejected' && status === 'applied')
                            ? config.color : '#e5e7eb',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: '600'
                        }}>
                          {config.icon}
                        </div>
                        <span style={{
                          fontSize: isMobile ? '9px' : '10px',
                          color: app.status === status ? config.color : '#9ca3af',
                          fontWeight: '500',
                          textAlign: 'center'
                        }}>
                          {config.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {app.notes && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: isMobile ? '10px' : '12px',
                    borderRadius: '8px',
                    marginBottom: isMobile ? '12px' : '16px'
                  }}>
                    <p style={{
                      fontSize: isMobile ? '13px' : '14px',
                      color: '#6b7280',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {app.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: isMobile ? '6px' : '8px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => handleEdit(app)}
                    style={{
                      padding: isMobile ? '10px' : '8px',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: isMobile ? '44px' : 'auto',
                      minHeight: isMobile ? '44px' : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5e7eb';
                      e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <Edit3 style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    style={{
                      padding: isMobile ? '10px' : '8px',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: isMobile ? '44px' : 'auto',
                      minHeight: isMobile ? '44px' : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.color = '#dc2626';
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </React.Fragment>
    </AuthGuard>
  );
}