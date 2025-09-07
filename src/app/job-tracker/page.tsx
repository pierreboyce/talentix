"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { Plus, Calendar, Building2, ExternalLink, Edit3, Trash2, Filter, Search } from 'lucide-react';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  link: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected';
  notes: string;
  createdAt: string;
}

const statusConfig = {
  applied: { icon: '📩', label: 'Applied', color: '#3b82f6', bgColor: '#dbeafe' },
  interview: { icon: '🎤', label: 'Interview', color: '#8b5cf6', bgColor: '#e9d5ff' },
  offer: { icon: '🎉', label: 'Offer', color: '#10b981', bgColor: '#d1fae5' },
  rejected: { icon: '❌', label: 'Rejected', color: '#ef4444', bgColor: '#fee2e2' }
};

export default function JobTracker(): React.ReactElement {
  const { user, loading } = useAuth();
  const { addPoints } = usePoints();
  const router = useRouter();
  
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
    dateApplied: '',
    status: 'applied' as JobApplication['status'],
    notes: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Load applications from localStorage
    const savedApps = localStorage.getItem('job_applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  const saveApplications = (apps: JobApplication[]) => {
    localStorage.setItem('job_applications', JSON.stringify(apps));
    setApplications(apps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newApp: JobApplication = {
      id: editingApp?.id || Date.now().toString(),
      ...formData,
      createdAt: editingApp?.createdAt || new Date().toISOString()
    };

    let updatedApps;
    if (editingApp) {
      updatedApps = applications.map(app => app.id === editingApp.id ? newApp : app);
    } else {
      updatedApps = [newApp, ...applications];
      addPoints(5, 'Added new job application');
    }

    saveApplications(updatedApps);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingApp(null);
    setFormData({
      title: '',
      company: '',
      link: '',
      dateApplied: '',
      status: 'applied',
      notes: ''
    });
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      title: app.title,
      company: app.company,
      link: app.link,
      dateApplied: app.dateApplied,
      status: app.status,
      notes: app.notes
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const updatedApps = applications.filter(app => app.id !== id);
      saveApplications(updatedApps);
    }
  };

  const handleStatusChange = (id: string, newStatus: JobApplication['status']) => {
    const updatedApps = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    saveApplications(updatedApps);
    
    if (newStatus === 'interview') {
      addPoints(10, 'Got an interview!');
    } else if (newStatus === 'offer') {
      addPoints(25, 'Got a job offer!');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const stats = {
    total: applications.length,
    interviews: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)',
      display: 'flex'
    }}>
      {/* Sidebar */}
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
            color: '#d1d5db',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            margin: '0 0 16px 0'
          }}>
            Quick Stats
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>📊 Total</span>
              <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{stats.total}</span>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>🎤 Interviews</span>
              <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>{stats.interviews}</span>
            </div>
            
            <div style={{
              padding: '12px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#d1d5db', fontSize: '14px' }}>🎉 Offers</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>{stats.offers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        padding: '32px',
        width: 'calc(100% - 280px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              📋 Job Applications
            </h1>
            <p style={{
              color: '#6b7280',
              margin: '0',
              fontSize: '16px'
            }}>
              Track your job applications and stay organized
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            Add Application
          </button>
        </div>

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #3b82f6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#3b82f6',
              margin: '0 0 4px 0'
            }}>
              {stats.total}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Applications</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #8b5cf6',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎤</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              margin: '0 0 4px 0'
            }}>
              {stats.interviews}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Interviews</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #10b981',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#10b981',
              margin: '0 0 4px 0'
            }}>
              {stats.offers}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Offers</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ef4444',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ef4444',
              margin: '0 0 4px 0'
            }}>
              {stats.total > 0 ? Math.round((stats.interviews + stats.offers) / stats.total * 100) : 0}%
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Response Rate</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '24px'
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
                padding: '12px 12px 12px 44px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Status</option>
            <option value="applied">📩 Applied</option>
            <option value="interview">🎤 Interview</option>
            <option value="offer">🎉 Offer</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '48px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {applications.length === 0 ? 'No applications yet' : 'No applications found'}
            </h3>
            <p style={{ color: '#6b7280', margin: '0' }}>
              {applications.length === 0 
                ? 'Start tracking your job applications to stay organized!'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: `2px solid ${statusConfig[app.status].color}`,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '6px 12px',
                  backgroundColor: statusConfig[app.status].bgColor,
                  color: statusConfig[app.status].color,
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {statusConfig[app.status].icon} {statusConfig[app.status].label}
                </div>

                {/* Content */}
                <div style={{ marginBottom: '16px', paddingRight: '80px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: '0 0 4px 0',
                    fontFamily: "'Fredoka', 'Inter', sans-serif"
                  }}>
                    {app.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    marginBottom: '8px'
                  }}>
                    <Building2 style={{ width: '16px', height: '16px' }} />
                    <span>{app.company}</span>
                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#3b82f6',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink style={{ width: '14px', height: '14px' }} />
                      </a>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    <Calendar style={{ width: '16px', height: '16px' }} />
                    <span>Applied {new Date(app.dateApplied).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    {Object.entries(statusConfig).map(([status, config], index) => (
                      <div
                        key={status}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          opacity: app.status === status || 
                                  (app.status === 'interview' && status === 'applied') ||
                                  (app.status === 'offer' && (status === 'applied' || status === 'interview')) ||
                                  (app.status === 'rejected' && status === 'applied')
                                  ? 1 : 0.3
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: config.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          marginBottom: '4px'
                        }}>
                          {config.icon}
                        </div>
                        <span style={{
                          fontSize: '10px',
                          color: '#6b7280',
                          textAlign: 'center'
                        }}>
                          {config.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div style={{ marginBottom: '16px' }}>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplication['status'])}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="applied">📩 Applied</option>
                    <option value="interview">🎤 Interview</option>
                    <option value="offer">🎉 Offer</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                {/* Notes */}
                {app.notes && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <p style={{
                      fontSize: '14px',
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
                  gap: '8px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => handleEdit(app)}
                    style={{
                      padding: '8px',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      transition: 'all 0.2s ease'
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
                      padding: '8px',
                      backgroundColor: '#fef2f2',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#ef4444',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 24px 0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Job Posting Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Date Applied *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateApplied}
                  onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as JobApplication['status'] })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="applied">📩 Applied</option>
                  <option value="interview">🎤 Interview</option>
                  <option value="offer">🎉 Offer</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  placeholder="Add any notes about this application..."
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '24px'
              }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {editingApp ? 'Update Application' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

