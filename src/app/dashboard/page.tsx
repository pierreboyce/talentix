"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Settings, MapPin, Clock, Star, ExternalLink, FileText, Users, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import EmojiPickerModal from '../../components/EmojiPickerModal';
import NameEditModal from '../../components/NameEditModal';
import { JobPostCardProps } from '../../components/JobPostCard';

// Job tips array that rotates daily
const jobTips = [
  "💡 Tailor your CV to each job application - use keywords from the job description!",
  "🎯 Research the company thoroughly before your interview - know their values and recent news.",
  "📧 Follow up on applications after 1-2 weeks with a polite email expressing continued interest.",
  "🤝 Network actively - 70% of jobs are never publicly advertised.",
  "💼 Use the STAR method (Situation, Task, Action, Result) to structure interview answers.",
  "📱 Keep your LinkedIn profile updated and engage with industry content regularly.",
  "🎨 Create a portfolio or personal website to showcase your work and achievements.",
  "📞 Practice your elevator pitch - be ready to sell yourself in 30 seconds.",
  "🔍 Use job search engines effectively - set up alerts for your target roles.",
  "💪 Develop both hard and soft skills - employers value well-rounded candidates.",
  "📝 Write compelling cover letters that tell your story, don't just repeat your CV.",
  "🕐 Apply to jobs early - be among the first applicants for better visibility.",
  "🎤 Prepare thoughtful questions to ask interviewers - show genuine interest.",
  "📊 Track your applications in a spreadsheet to stay organized and follow up.",
  "🌟 Highlight achievements with numbers - quantify your impact wherever possible.",
  "🔄 Continuously update your skills - take online courses to stay current.",
  "👔 Dress appropriately for interviews - when in doubt, slightly overdress.",
  "📍 Consider location flexibility - remote work opens up more opportunities.",
  "💬 Practice interviewing with friends or family to build confidence.",
  "🎯 Focus on quality over quantity - apply to fewer jobs but with more care.",
  "📧 Use a professional email address for job applications - avoid nicknames.",
  "🔗 Build genuine relationships on LinkedIn - engage meaningfully with connections.",
  "📚 Stay updated with industry trends and news relevant to your field.",
  "💡 Consider informational interviews to learn about roles and companies.",
  "🎨 Customize your resume format for each industry - creative vs. traditional.",
  "📱 Ensure your online presence is professional - employers will Google you.",
  "🤔 Reflect on your career goals regularly and adjust your search strategy.",
  "💼 Consider contract or freelance work to gain experience and build networks.",
  "🎯 Use specific job titles in your search - avoid being too broad.",
  "📝 Keep a job search journal to track what works and what doesn't."
];


export default function Dashboard() {
  const { user, session, loading, updateUser, refreshUser } = useAuth();
  const router = useRouter();
  const { points: userPoints } = usePoints(); // Use shared points context

  // All hooks must be called before any conditional returns
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [displayEmoji, setDisplayEmoji] = useState<string>(user?.emoji || '😊');
  const [dailyTip, setDailyTip] = useState<string>('');

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    setDisplayEmoji(user?.emoji || '😊');
    // Set the daily tip immediately
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const tipIndex = dayOfYear % jobTips.length;
    setDailyTip(jobTips[tipIndex]);
  }, [user?.emoji]);

  // First useEffect - Set greeting based on time of day
  useEffect(() => {
    if (loading) return;
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [loading]);

  // Handle direct OAuth login (when real user data is available)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthUser = urlParams.get('oauth_user');
    const provider = urlParams.get('provider');
    const directLogin = urlParams.get('direct_login');
    
    if (oauthUser && provider && directLogin === 'true') {
      try {
        const userData = JSON.parse(oauthUser);
        
        // Store real OAuth user data in localStorage and create a valid session object
        const sessionData = {
          user: userData,
          provider: provider,
          timestamp: Date.now(),
          // IMPORTANT: include an expires field so AuthContext accepts the session
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          token: `oauth_${provider}_${Date.now()}_${Math.random().toString(36).slice(2)}`
        };
        localStorage.setItem('talentix_user', JSON.stringify(userData));
        localStorage.setItem('talentix_session', JSON.stringify(sessionData));
        // Also set a lightweight cookie so middleware allows protected routes
        document.cookie = `talentix-session=1; path=/; max-age=${24 * 60 * 60}`;

        // Clear URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // Force refresh to update auth context
        refreshUser();
      } catch (error) {
        console.error('Failed to parse OAuth user data:', error);
      }
    }
  }, [refreshUser]);

  // Only redirect if we're sure there's no user and loading is complete
  useEffect(() => {
    // If we are currently processing a direct login via URL params, do not redirect yet
    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : undefined;
    if (sp && (sp.get('oauth_user') || sp.get('direct_login') === 'true')) return;
    // Don't redirect if we're still loading or if we have a user
    if (loading || user || session) {
      return;
    }
    
    // Only redirect after a longer delay to prevent flashing
    const timer = setTimeout(() => {
      // Double check that we still don't have authentication
      if (!user && !session && !loading) {
        router.push('/');
      }
    }, 2000); // Increased delay
    
    return () => clearTimeout(timer);
  }, [loading, user, session, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#fef3c7',
        fontFamily: 'Fredoka, Inter, sans-serif'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'pulse 2s ease-in-out infinite' }}>🚀</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Loading your dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // Talentix Points levels system (same as Talentix Points page)
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

  // NOTE: Do not add new hooks below this point before the first early return.
  // All hook setup for greeting and OAuth handling happens above (lines ~60-110).



  // Search functionality

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim() || "jobs";
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  // Track job clicks and award points
  const trackJobClick = async (job: any) => {
    try {
      // Award points immediately (same as search page)
      // This would integrate with the points system
      console.log('Job clicked:', job);
    } catch (error) {
      console.error('Error tracking job click:', error);
    }
  };

  // Points management is now handled by the shared context


  // Function to handle emoji selection
  const handleEmojiSelect = async (newEmoji: string) => {
    console.log('🔵 handleEmojiSelect called with:', newEmoji);
    console.log('🔵 Current user:', user);
    console.log('🔵 Current displayEmoji:', displayEmoji);
    
    // Debug localStorage contents
    console.log('🔵 localStorage talentix_user:', localStorage.getItem('talentix_user'));
    console.log('🔵 localStorage talentix_session:', localStorage.getItem('talentix_session'));
    console.log('🔵 localStorage talentix_oauth_google:', localStorage.getItem('talentix_oauth_google'));
    console.log('🔵 localStorage talentix_oauth_microsoft:', localStorage.getItem('talentix_oauth_microsoft'));
    
    if (user) {
      try {
        console.log('🔵 Setting displayEmoji to:', newEmoji);
        setDisplayEmoji(newEmoji);
        
        console.log('🔵 Calling updateUser with emoji:', newEmoji);
        const result = await updateUser({ emoji: newEmoji });
        
        console.log('🔵 updateUser result:', result);
        
        if (!result.success) {
          console.error('❌ Failed to update emoji:', result.error);
    } else {
          console.log('✅ Emoji updated successfully');
          // Force a re-render by updating user state
          console.log('🔵 User after update should have emoji:', newEmoji);
        }
      } catch (error) {
        console.error('❌ Error updating emoji:', error);
      }
    } else {
      console.log('❌ No user found, cannot update emoji');
      console.log('❌ Attempting to load user from localStorage manually...');
      
      // Try to manually load user from localStorage
      const storedUser = localStorage.getItem('talentix_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('❌ Found user in localStorage:', userData);
          console.log('❌ This suggests the AuthContext is not loading properly');
          
          // Manually update the emoji in localStorage since AuthContext user is null
          console.log('🔄 Manually updating emoji in localStorage...');
          const updatedUserData = { ...userData, emoji: newEmoji, updatedAt: new Date().toISOString() };
          
          // Update all localStorage entries
          localStorage.setItem('talentix_user', JSON.stringify(updatedUserData));
          if (userData.email) {
            localStorage.setItem(`talentix_user_${userData.email}`, JSON.stringify(updatedUserData));
          }
          if (userData.id && userData.id.includes('oauth_user_')) {
            const provider = userData.id.includes('google') ? 'google' : 'microsoft';
            localStorage.setItem(`talentix_oauth_${provider}`, JSON.stringify(updatedUserData));
          }
          
          // Update session if it exists
          const storedSession = localStorage.getItem('talentix_session');
          if (storedSession) {
            try {
              const sessionData = JSON.parse(storedSession);
              const updatedSession = { ...sessionData, user: updatedUserData };
              localStorage.setItem('talentix_session', JSON.stringify(updatedSession));
            } catch (e) {
              console.log('❌ Error updating session:', e);
            }
          }
          
          // Update the display immediately
          setDisplayEmoji(newEmoji);
          
          console.log('✅ Emoji updated manually in localStorage');
          
          // Try to refresh the AuthContext to load the updated user
          if (refreshUser) {
            console.log('🔄 Calling refreshUser to reload AuthContext...');
            await refreshUser();
          }
          
        } catch (e) {
          console.log('❌ Error parsing stored user:', e);
        }
      } else {
        console.log('❌ No user found in localStorage either');
      }
    }
  };

  // Function to handle name saving
  const handleNameSave = async (newName: string) => {
    if (user) {
      try {
        // Update user through AuthContext
        const result = await updateUser({ name: newName });
        
        if (result.success) {
          console.log('Name updated successfully:', newName);
          // The AuthContext will automatically update the user state
          // No need to reload the page
        } else {
          console.error('Failed to update name:', result.error);
        }
      } catch (error) {
        console.error('Error updating name:', error);
      }
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name || user?.email || 'User';

  // Sample recommended jobs
  const recommendedJobs: JobPostCardProps[] = [
    {
      companyName: "McDonald's",
      companyLogo: '🍟',
      jobTitle: 'Crew Member (Part-time)',
      description: "Join our amazing team to create great customer experiences. Flexible hours and opportunities to progress.",
      applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/part-time-crew-member',
    },
    {
      companyName: 'Boots',
      companyLogo: '💊',
      jobTitle: 'Customer Advisor',
      description: 'Help customers find the right products, introduce them to new things, and make their shopping experience better.',
      applyLink: 'https://www.boots.jobs/retail/customer-advisor/',
    },
    {
      companyName: 'Tesco',
      companyLogo: '🛒',
      jobTitle: 'Customer Assistant',
      description: 'Become the friendly face of our store, helping customers with a smile and ensuring shelves are stocked.',
      applyLink: 'https://www.tesco-careers.com/search-and-apply/',
    },
    {
      companyName: 'Costa Coffee',
      companyLogo: '☕',
      jobTitle: 'Barista',
      description: 'Create the perfect coffee experience for our customers. Full training provided with flexible scheduling.',
      applyLink: 'https://www.costa.co.uk/careers/barista',
    },
    {
      companyName: 'Sainsbury\'s',
      companyLogo: '🛍️',
      jobTitle: 'Sales Assistant',
      description: 'Help customers find what they need and keep our store looking great. Weekend and evening shifts available.',
      applyLink: 'https://sainsburys.jobs/retail/sales-assistant',
    },
    {
      companyName: 'Next',
      companyLogo: '👕',
      jobTitle: 'Sales Associate',
      description: 'Join our fashion team and help customers find their perfect style. Great staff discount and flexible hours.',
      applyLink: 'https://www.next.co.uk/careers/retail-sales-associate',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-4 dashboard-container" style={{ scrollBehavior: 'smooth' }}>
      <style jsx global>{`
        body {
          overflow-y: auto !important;
          overflow-x: visible !important;
          scroll-behavior: smooth !important;
          height: auto !important;
          min-height: 100vh !important;
        }
        html {
          scroll-behavior: smooth !important;
          overflow-x: visible !important;
          height: auto !important;
        }
        .dashboard-container {
          overflow-y: auto !important;
          scroll-behavior: smooth !important;
          padding-top: 16px !important;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Empty left side - no logo or branding */}
            <div className="flex items-center">
              {/* Spacer */}
            </div>
            
            <div className="flex items-center space-x-8">
              <div style={{ width: '420px', marginLeft: '-60px', marginRight: '20px' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    position: 'relative', 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      left: '12px',
                      fontSize: '16px',
                      zIndex: 1
                    }}>🔍</div>
                <input
                  type="text"
                      placeholder="Find your dream job! 🚀"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        fontSize: '14px',
                        border: '3px solid #fde047',
                        borderRadius: '25px',
                        outline: 'none',
                        backgroundColor: '#fffbeb',
                        transition: 'all 0.3s ease',
                        fontFamily: 'inherit'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.backgroundColor = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.2)';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#fde047';
                        e.target.style.backgroundColor = '#fffbeb';
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 18px',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '25px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                    }}
                  >
                    ✨ Search
                  </button>
                </form>
              </div>
              
              <button className="relative p-3 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Greeting & Job Tips Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-8">
        <div className="flex items-start gap-8">
          {/* Profile Emoji */}
          <div className="flex-shrink-0">
            <span className="text-[2.5rem]">{displayEmoji}</span>
            </div>
            
          {/* Greeting Content */}
          <div className="flex-1">
            {/* Modern Greeting Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              height: '160px'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 6px 0',
                fontFamily: 'Fredoka'
              }}>
                {greeting}
              </h2>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#4b5563',
                margin: '0 0 16px 0'
              }}>
                {userName}
              </h3>
              
              {/* Modern Edit Buttons - moved inside greeting card */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-start'
              }}>
                <button
                  onClick={() => setShowEmojiPicker(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  title="Click to change your emoji"
                >
                  ✏️ Edit Emoji
                </button>
                <button 
                  onClick={() => setShowNameEdit(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ffffff',
                    color: '#1f2937',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#1f2937';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  title="Click to change your name"
                >
                  ✏️ Edit Name
                </button>
          </div>
        </div>
      </div>

          {/* Job Tips of the Day - Right Side */}
          <div className="flex-1">
            <div style={{
              height: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div className="text-center">
                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#fde047',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  💡 Job Tip of the Day
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#374151',
                  lineHeight: '1.6',
                  margin: '0',
                  fontWeight: '500',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.05)'
                }}>
                  {dailyTip || "Loading today's career tip..."}
                </p>
              </div>
            </div>
          </div>
        </div>
          </div>


      {/* Talentix Points Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8" style={{marginTop: '16px'}}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e5e7eb',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: '0',
          width: '95%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 6px 0' }}>
                {getCurrentLevel().icon} {getCurrentLevel().name}
              </h2>
              <p style={{ fontSize: '16px', color: '#4b5563', margin: '0' }}>
                {userPoints.toLocaleString()} Talentix Points
              </p>
            </div>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `conic-gradient(${getCurrentLevel().color} ${getNextLevel() ? (userPoints / getNextLevel()!.points) * 360 : 360}deg, #e5e7eb 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}>
                {getCurrentLevel().icon}
              </div>
            </div>
          </div>

          {getNextLevel() && (
              <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
                  Progress to {getNextLevel()!.name} {levels.find(l => l.name === getNextLevel()!.name)?.icon}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
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
          
          {/* View Full Progress Button */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              onClick={() => router.push('/talentix-points')}
              style={{
                backgroundColor: '#fbbf24',
                color: '#1f2937',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
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
              View Full Progress & Achievements
            </button>
          </div>
                  </div>
                </div>
                
      {/* Feature Cards Section - Modern Minimalist Style */}
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', 
        padding: '40px 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div style={{ position: 'relative' }}>
            {/* Navigation Arrows */}
            <button 
              onClick={() => {
                const container = document.getElementById('feature-cards-container');
                if (container) {
                  container.scrollBy({ left: -400, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.backgroundColor = '#fef3c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <span style={{ fontSize: '20px', color: '#374151' }}>←</span>
            </button>

            <button 
              onClick={() => {
                const container = document.getElementById('feature-cards-container');
                if (container) {
                  container.scrollBy({ left: 400, behavior: 'smooth' });
                }
              }}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.backgroundColor = '#fef3c7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <span style={{ fontSize: '20px', color: '#374151' }}>→</span>
            </button>

            {/* Horizontal scroll container */}
            <div 
              id="feature-cards-container"
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '24px', 
                paddingBottom: '16px',
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
              className="scrollbar-hide"
            >
              
              {/* Job Search Feature Card */}
              <div 
                onClick={() => router.push('/search')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)',
                  border: '3px solid #2563eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🔍</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Search style={{ width: '32px', height: '32px', color: '#2563eb' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Job Search
                    </h3>
                    <p style={{ fontSize: '14px', color: '#dbeafe', margin: '0' }}>
                      🎯 Find opportunities
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Search through thousands of job opportunities from top UK companies with smart filters! 🚀
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#2563eb',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🏢 35+ Companies
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Explore Now →
                  </span>
                </div>
              </div>

              {/* CV Reviewer Feature Card */}
              <div 
                onClick={() => router.push('/cv-reviewer')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                  border: '3px solid #16a34a',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(22, 163, 74, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(22, 163, 74, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📄</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <FileText style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      CV Reviewer
                    </h3>
                    <p style={{ fontSize: '14px', color: '#dcfce7', margin: '0' }}>
                      🤖 AI analysis
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Get instant AI-powered feedback on your CV with personalized improvement suggestions! ✨
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#16a34a',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🧠 AI Powered
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Review Now →
                  </span>
                </div>
              </div>

              {/* Interview Prep Feature Card */}
              <div 
                onClick={() => router.push('/interview-prep')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #d97706 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(217, 119, 6, 0.3)',
                  border: '3px solid #d97706',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(217, 119, 6, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(217, 119, 6, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎤</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Users style={{ width: '32px', height: '32px', color: '#d97706' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Interview Prep
                    </h3>
                    <p style={{ fontSize: '14px', color: '#fef3c7', margin: '0' }}>
                      🎯 Practice questions
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Practice with AI-generated interview questions tailored to your industry and role! 💪
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#d97706',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🎤 Practice
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Start Now →
                  </span>
                </div>
              </div>

              {/* Talentix Points Feature Card */}
              <div 
                onClick={() => router.push('/talentix-points')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
                  border: '3px solid #fbbf24',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(251, 191, 36, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🏆</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Trophy style={{ width: '32px', height: '32px', color: '#fbbf24' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Talentix Points
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                      🎯 Track progress
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.5', marginBottom: '24px' }}>
                  Earn points for completing activities and unlock achievements as you progress! 🚀
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#fbbf24',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🎉 {userPoints} Points
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    View Progress →
                  </span>
                </div>
              </div>

              {/* Settings Feature Card */}
              <div 
                onClick={() => router.push('/settings')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #8b5cf6 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                  border: '3px solid #8b5cf6',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>⚙️</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Settings style={{ width: '32px', height: '32px', color: '#8b5cf6' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Settings
                    </h3>
                    <p style={{ fontSize: '14px', color: '#e0e7ff', margin: '0' }}>
                      🔧 Customize account
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Manage your account settings, change password, and personalize your experience! ⚡
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#8b5cf6',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🛠️ Personalize
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Configure →
                  </span>
                </div>
              </div>

              {/* Career Guidance Feature Card */}
              <div 
                onClick={() => router.push('/career-guidance')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #fce7f3 0%, #ec4899 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)',
                  border: '3px solid #ec4899',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(236, 72, 153, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>📚</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ fontSize: '32px' }}>🎓</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Career Guidance
                    </h3>
                    <p style={{ fontSize: '14px', color: '#fce7f3', margin: '0' }}>
                      📖 Expert advice
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Access 50+ expert career guides and tips to accelerate your job search journey! 🌟
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#ec4899',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    📚 50+ Guides
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Learn More →
                  </span>
                </div>
              </div>

              {/* Our Story Feature Card */}
              <div 
                onClick={() => router.push('/our-story')}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
                  border: '3px solid #f59e0b',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>👥</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ fontSize: '32px' }}>🏢</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Our Story
                    </h3>
                    <p style={{ fontSize: '14px', color: '#92400e', margin: '0' }}>
                      💫 Meet the team
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.5', marginBottom: '24px' }}>
                  Learn about Talentix's mission and meet the passionate team behind your success! 🌟
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#f59e0b',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    👨‍💼 Meet Team
                  </span>
                  <span style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    Discover →
                  </span>
                </div>
              </div>

              {/* AI Chat Feature Card */}
              <div 
                onClick={() => {
                  // Trigger AI chat widget instead of navigating
                  const event = new CustomEvent('openChatbot');
                  window.dispatchEvent(event);
                }}
                style={{
                  flexShrink: 0,
                  width: '350px',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 100%)',
                  borderRadius: '20px',
                  padding: '32px',
                  boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)',
                  border: '3px solid #0ea5e9',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(14, 165, 233, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.3)';
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🤖</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ fontSize: '32px' }}>💬</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      AI Career Chat
                    </h3>
                    <p style={{ fontSize: '14px', color: '#e0f2fe', margin: '0' }}>
                      🧠 Smart assistance
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Get instant AI-powered career advice and personalized job search guidance! 🚀
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    padding: '8px 16px',
                    backgroundColor: '#ffffff',
                    color: '#0ea5e9',
                    fontSize: '12px',
                    fontWeight: '700',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🤖 AI Powered
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Chat Now →
                  </span>
                </div>
              </div>
              
            </div>
                      </div>
                      </div>
                    </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fun Recommended Jobs Section */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #facc15 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '3.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 16px 0',
              fontFamily: 'Fredoka',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              lineHeight: '1.1'
            }}>
              Recommended Jobs
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#4b5563',
              margin: '0',
              fontWeight: '500'
            }}>
              Perfect opportunities matched to your profile
            </p>
                </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {recommendedJobs.map((job, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: '2px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#fbbf24';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {job.companyLogo}
                      </div>
                      <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                        {job.jobTitle}
                      </h3>
                      <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
                        {job.companyName}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669', margin: '0 0 4px 0' }}>
                      £8.50-£11.00/hr
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                      Part-time
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>UK Wide</span>
              </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>2 days ago</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: 'currentColor' }} />
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>4.5</span>
                  </div>
                </div>

                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                  {job.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Entry Level
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Training Provided
                    </span>
                  </div>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      trackJobClick({
                        companyName: job.companyName,
                        jobTitle: job.jobTitle
                      });
                      window.open(job.applyLink, '_blank');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: '#fbbf24',
                      color: '#1f2937',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f59e0b';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fbbf24';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Apply Now
                    <ExternalLink style={{ width: '16px', height: '16px' }} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Emoji Picker Modal */}
      <EmojiPickerModal
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onEmojiSelect={handleEmojiSelect}
        currentEmoji={displayEmoji}
      />

      {/* Name Edit Modal */}
      <NameEditModal
        isOpen={showNameEdit}
        onClose={() => setShowNameEdit(false)}
        onNameSave={handleNameSave}
        currentName={userName}
      />
    </div>
  );
} 