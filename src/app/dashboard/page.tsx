"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, User, Settings, MapPin, Clock, Star, ExternalLink, FileText, Users, Trophy, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePoints } from '../../contexts/PointsContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import DashboardMobile from '../../components/DashboardMobile';
import ClientOnly from '../../components/ClientOnly';
import ProBanner from '../../components/ProBanner';
import EmojiPickerModal from '../../components/EmojiPickerModal';
import NameEditModal from '../../components/NameEditModal';

// Interface for job post cards
interface JobPostCardProps {
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  description: string;
  applyLink: string;
}

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
  const { user, session, loading, signOut, updateUser, refreshUser } = useAuth();
  const router = useRouter();
  const { points: userPoints, setPoints } = usePoints(); // Use shared points context
  const { subscription } = useSubscription();
  const { isMobile } = useDeviceDetection();

  // Simple mount tracking
  useEffect(() => {
    console.log('📍 Dashboard mounted successfully');
  }, []);

  // All state hooks must be at the top
  const [greeting, setGreeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [displayEmoji, setDisplayEmoji] = useState<string>(user?.emoji || '😊');
  const [dailyTip, setDailyTip] = useState<string>('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Removed mobile conditional rendering to prevent hydration issues

  // Event handler functions to avoid inline handlers
  const handleEmojiPickerOpen = () => setShowEmojiPicker(true);
  const handleNameEditOpen = () => setShowNameEdit(true);
  const handlePointsNavigation = () => router.push('/talentix-points');
  const handleSearchNavigation = () => router.push('/search');
  const handleCVReviewerNavigation = () => router.push('/cv-reviewer');
  const handleInterviewPrepNavigation = () => router.push('/interview-prep');
  const handleVideoInterviewNavigation = () => router.push('/video-interview');
  const handleSettingsNavigation = () => router.push('/settings');
  const handleCareerGuidanceNavigation = () => router.push('/career-guidance');
  
  const handleScrollLeft = () => {
    const container = document.getElementById('feature-cards-container');
    if (container) {
      container.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    const container = document.getElementById('feature-cards-container');
    if (container) {
      container.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };
  
  const handleAIChatOpen = () => {
    const chatEvent = new CustomEvent('openChatbot', { 
      detail: { message: 'Hello! I need help with my career.' } 
    });
    window.dispatchEvent(chatEvent);
  };
  
  const handleJobApply = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const handleJobClick = (e: React.MouseEvent, job: any) => {
    e.preventDefault();
    trackJobClick({
      companyName: job.companyName,
      jobTitle: job.jobTitle
    });
    window.open(job.applyLink, '_blank', 'noopener,noreferrer');
  };

  // Add a ref to prevent multiple redirects and track auth state
  const redirectAttempted = useRef(false);
  const authCheckCount = useRef(0);
  const authStable = useRef(false);
  const stableUserEmail = useRef<string | null>(null);

  // Authentication redirect effect - restored with stability improvements
  useEffect(() => {
    // If auth is stable and user hasn't changed, skip entirely
    if (authStable.current && user?.email === stableUserEmail.current) {
      return;
    }

    authCheckCount.current += 1;
    const checkId = authCheckCount.current;
    
    console.log(`📊 Dashboard auth check #${checkId}:`, { 
      loading, 
      user: !!user, 
      userEmail: user?.email,
      session: !!session,
      authStable: authStable.current
    });
    
    // If we have a user, mark auth as stable
    if (user?.email) {
      console.log(`📊 Dashboard #${checkId}: User authenticated (${user.email}), marking auth as stable`);
      authStable.current = true;
      stableUserEmail.current = user.email;
      
      if (localStorage.getItem('talentix_signin_success')) {
        localStorage.removeItem('talentix_signin_success');
      }
      redirectAttempted.current = false;
      return;
    }
    
    // If we lost the user, reset stability
    if (authStable.current && !user) {
      console.log(`📊 Dashboard #${checkId}: User lost, resetting auth stability`);
      authStable.current = false;
      stableUserEmail.current = null;
    }

    // If we're loading, wait
    if (loading) {
      console.log(`📊 Dashboard #${checkId}: Still loading, waiting...`);
      return;
    }

    // If we already attempted a redirect, don't do it again
    if (redirectAttempted.current) {
      console.log(`📊 Dashboard #${checkId}: Redirect already attempted, skipping`);
      return;
    }

    // Clean up any signin flags that might cause issues
    if (localStorage.getItem('talentix_signin_success')) {
      localStorage.removeItem('talentix_signin_success');
    }
    if (localStorage.getItem('signin_in_progress')) {
      localStorage.removeItem('signin_in_progress');
    }

    // Check for OAuth landing
    const params = new URLSearchParams(window.location.search);
    const isOAuthLanding = params.get('direct_login') === 'true' || params.has('oauth_user');
    if (isOAuthLanding) {
      console.log(`📊 Dashboard #${checkId}: OAuth landing detected, skipping auth redirect`);
      return;
    }
    
    // Final check - no user, no session, not loading, haven't redirected yet
    console.log(`📊 Dashboard #${checkId}: No auth found, will redirect to home in 2 seconds`);
    const timer = setTimeout(() => {
      if (!user && !session && !loading && !redirectAttempted.current) {
        console.log(`📊 Dashboard #${checkId}: Final redirect to home - no authentication`);
        redirectAttempted.current = true;
        router.push('/');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [loading, user?.email, !!session, router]);

  useEffect(() => {
    setDisplayEmoji(user?.emoji || '😊');
    // Set the daily tip immediately
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const tipIndex = dayOfYear % jobTips.length;
    setDailyTip(jobTips[tipIndex]);
  }, [user?.emoji]);

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

  // First useEffect - Set greeting based on time of day
  useEffect(() => {
    if (loading) return;
    
    // Remove strict authentication check for now
    // if (!user || !session) {
    //   router.push('/');
    //   return;
    // }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [loading]);

  // Points are now handled by the shared context

  // Handle direct OAuth login (when real user data is available)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthUser = urlParams.get('oauth_user');
    const provider = urlParams.get('provider');
    const directLogin = urlParams.get('direct_login');
    
    if (oauthUser && provider && directLogin === 'true') {
      try {
        const userData = JSON.parse(oauthUser);
        
        // Store real OAuth user data in localStorage
        console.log('💾 Storing OAuth user data:', userData);
        localStorage.setItem('talentix_user', JSON.stringify(userData));
        localStorage.setItem(`talentix_oauth_${provider}`, JSON.stringify(userData));
        localStorage.setItem(`talentix_user_${userData.email}`, JSON.stringify(userData));
        
        // Create session with longer expiry
        const session = {
          user: userData,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          token: `oauth_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        console.log('💾 Storing session:', session);
        localStorage.setItem('talentix_session', JSON.stringify(session));
        
        // Create JWT token for OAuth user for API authentication
        const createJWTToken = async () => {
          try {
            console.log('🔄 Creating JWT token for OAuth user:', userData.email);
            const jwtResponse = await fetch('/api/auth/create-oauth-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: userData })
            });
            
            console.log('📡 JWT API response status:', jwtResponse.status);
            
            if (jwtResponse.ok) {
              const jwtData = await jwtResponse.json();
              console.log('📊 JWT API response data:', jwtData);
              if (jwtData.token) {
                localStorage.setItem('auth_token', jwtData.token);
                console.log('✅ JWT token created and stored for OAuth user');
              } else {
                console.error('❌ No token in response:', jwtData);
              }
            } else {
              const errorData = await jwtResponse.json();
              console.error('❌ JWT API error:', jwtResponse.status, errorData);
            }
          } catch (error) {
            console.error('❌ Failed to create JWT token for OAuth user:', error);
          }
        };
        
        createJWTToken();
        
        // Clear URL parameters
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('oauth_user');
        newUrl.searchParams.delete('provider');
        newUrl.searchParams.delete('direct_login');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Update auth context directly instead of reloading
        console.log('✅ OAuth user data stored, updating auth context');
        
        // Force auth context to update by calling refreshUser
        setTimeout(() => {
          window.dispatchEvent(new Event('talentix-auth-update'));
          // Also try to access the auth context directly if available
          if (typeof window !== 'undefined' && (window as any).talentixAuthRefresh) {
            (window as any).talentixAuthRefresh();
          }
        }, 100);
        
      } catch (error) {
        console.error('Error processing real OAuth user data:', error);
      }
    }
  }, []);

  // Handle subscription success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');
    
    if (subscriptionStatus === 'success') {
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success message with refresh option
      setTimeout(() => {
        const shouldRefresh = confirm('🎉 Welcome to Talentix Pro! Your subscription has been activated successfully.\n\nWould you like to refresh the page to see your updated Pro features?');
        
        if (shouldRefresh) {
          window.location.reload();
        }
      }, 1500);
    }
  }, []);



  const handleSignOutClick = () => {
    
    // Simple, direct approach - no async/await
    try {
      
      // Clear all localStorage immediately
      localStorage.removeItem('talentix_session');
    localStorage.removeItem('talentix_user');
      
      // Force redirect immediately
      window.location.href = '/';
      
    } catch (error) {
      console.error('Simple sign out error:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  // Search functionality
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim() || "jobs";
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSearchSubmit = () => {
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

  // Get user's actual name for certificates
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix if no name
    return 'Talentix User'; // Final fallback
  };

  // Function to handle emoji selection
  const handleEmojiSelect = async (newEmoji: string) => {
    
    if (user) {
      try {
        setDisplayEmoji(newEmoji);
        
        const result = await updateUser({ emoji: newEmoji });
        
        
        if (!result.success) {
          console.error('❌ Failed to update emoji:', result.error);
    } else {
          // Force a re-render by updating user state
        }
      } catch (error) {
        console.error('❌ Error updating emoji:', error);
      }
    } else {
      
      // Try to manually load user from localStorage
      const storedUser = localStorage.getItem('talentix_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Manually update the emoji in localStorage since AuthContext user is null
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
            }
          }
          
          // Update the display immediately
          setDisplayEmoji(newEmoji);
          
          
          // Try to refresh the AuthContext to load the updated user
          if (refreshUser) {
            await refreshUser();
          }
          
        } catch (e) {
        }
      } else {
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
      applyLink: 'https://www.boots.jobs/search-jobs',
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
      applyLink: 'https://www.costacareers.co.uk',
    },
    {
      companyName: 'Sainsbury\'s',
      companyLogo: '🛍️',
      jobTitle: 'Sales Assistant',
      description: 'Help customers find what they need and keep our store looking great. Weekend and evening shifts available.',
      applyLink: 'https://sainsburys.jobs',
    },
    {
      companyName: 'Next',
      companyLogo: '👕',
      jobTitle: 'Sales Associate',
      description: 'Join our fashion team and help customers find their perfect style. Great staff discount and flexible hours.',
      applyLink: 'https://careers.next.co.uk',
    },
  ];

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

  // Render mobile version if on mobile device
  if (isMobile) {
    return (
      <ClientOnly fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }>
        <DashboardMobile
          user={user}
          greeting={greeting}
          userName={userName}
          displayEmoji={displayEmoji}
          dailyTip={dailyTip}
          userPoints={userPoints}
          getCurrentLevel={getCurrentLevel}
          getNextLevel={getNextLevel}
          levels={levels}
          handleEmojiPickerOpen={handleEmojiPickerOpen}
          handleNameEditOpen={handleNameEditOpen}
          handlePointsNavigation={handlePointsNavigation}
          handleScrollLeft={handleScrollLeft}
          handleScrollRight={handleScrollRight}
          scrollContainerRef={scrollContainerRef}
          subscription={subscription}
        />
        
        {/* Mobile Modals */}
        <EmojiPickerModal
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onEmojiSelect={handleEmojiSelect}
          currentEmoji={displayEmoji}
        />

        <NameEditModal
          isOpen={showNameEdit}
          onClose={() => setShowNameEdit(false)}
          onNameSave={handleNameSave}
          currentName={userName}
        />
      </ClientOnly>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-gray-50 pt-4 dashboard-container" style={{ scrollBehavior: 'smooth' }}>
      <style jsx global>{`
        /* Dashboard hover effects */
        .dashboard-search-btn:hover {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          transform: translateY(-2px) scale(1.05) !important;
          box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4) !important;
        }
        
        .dashboard-feature-card:hover {
          transform: translateY(-5px) scale(1.02) !important;
        }
        
        .dashboard-feature-card.interview:hover {
          box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4) !important;
        }
        
        .dashboard-feature-card.tracker:hover {
          box-shadow: 0 15px 35px rgba(22, 163, 74, 0.4) !important;
        }
        
        .dashboard-feature-card.cover-letter:hover {
          box-shadow: 0 15px 35px rgba(217, 119, 6, 0.4) !important;
        }
        
        .dashboard-feature-card.cv-reviewer:hover {
          box-shadow: 0 15px 35px rgba(251, 191, 36, 0.4) !important;
        }
        
        .dashboard-feature-card.interview-prep:hover {
          box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4) !important;
        }
        
        .dashboard-feature-card.points:hover {
          box-shadow: 0 15px 35px rgba(236, 72, 153, 0.4) !important;
        }
        
        .dashboard-feature-card.career:hover {
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.4) !important;
        }
        
        .dashboard-feature-card.search:hover {
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.4) !important;
        }
        
        .dashboard-job-card:hover {
          border-color: #fbbf24 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        
        .dashboard-apply-btn:hover {
          background-color: #f59e0b !important;
          transform: translateY(-1px) !important;
        }
        
        .dashboard-nav-btn:hover {
          background-color: #fbbf24 !important;
          color: #000000 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .dashboard-points-btn:hover {
          background-color: #f59e0b !important;
        }
        
        .dashboard-input:hover {
          border-color: #fbbf24 !important;
          background-color: #fef3c7 !important;
        }
        
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    type="button"
                    onClick={handleSearchSubmit}
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
                    className="dashboard-search-btn"
                  >
                    ✨ Search
                  </button>
                </div>
              </div>
              

              {/* Playful Profile Section */}
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div 
                  className="relative transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                  style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>👤</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span 
                    className="transition-all duration-300 group-hover:scale-105"
                    style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      fontFamily: 'Fredoka, sans-serif',
                      background: 'linear-gradient(135deg, #1f2937, #4b5563, #6b7280)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {userName}
                  </span>
                  {/* Pro Badge - Show if user has Pro subscription */}
                  {subscription?.tier === 'pro' && (
                    <div 
                      className="relative transition-all duration-300 hover:scale-110 animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)',
                        borderRadius: '12px',
                        padding: '4px 10px',
                        boxShadow: '0 3px 12px rgba(245, 158, 11, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.9)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1) translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.6)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 3px 12px rgba(245, 158, 11, 0.4)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%)';
                      }}
                    >
                      <span 
                        style={{
                          fontSize: '11px',
                          fontWeight: '900',
                          fontFamily: 'Fredoka, sans-serif',
                          color: 'white',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                          letterSpacing: '0.5px',
                        }}
                      >
                        PRO
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Greeting & Job Tips Section */}
      <div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-8">
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
              height: '160px',
              position: 'relative',
              zIndex: 1
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
                  onClick={handleEmojiPickerOpen}
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
                  className="dashboard-nav-btn"
                  title="Click to change your emoji"
                >
                  ✏️ Edit Emoji
                </button>
                <button 
                  onClick={handleNameEditOpen}
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
                  className="dashboard-nav-btn"
                  title="Click to change your name"
                >
                  ✏️ Edit Name
                </button>
          </div>
        </div>
      </div>

          {/* Job Tips of the Day - Right Side */}
          <div className="flex-1 relative" style={{ zIndex: 0 }}>
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
              onClick={handlePointsNavigation}
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
              className="dashboard-points-btn"
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
        <div className="responsive-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            {/* Navigation Arrows - Desktop only */}
            <button 
              onClick={handleScrollLeft}
              className="desktop-show"
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
            >
              <span style={{ fontSize: '20px', color: '#374151' }}>←</span>
            </button>

            <button 
              onClick={handleScrollRight}
              className="desktop-show"
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
            >
              <span style={{ fontSize: '20px', color: '#374151' }}>→</span>
            </button>

            {/* Feature cards container - responsive */}
            <div 
              id="feature-cards-container"
              className="feature-cards-responsive"
              style={{ 
                display: 'flex', 
                overflowX: 'auto', 
                gap: '16px', 
                paddingBottom: '16px',
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              
              {/* Job Search Feature Card */}
              <div 
                onClick={handleSearchNavigation}
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
                className="dashboard-feature-card interview"
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

              {/* CV Reviewer Feature Card with Pro Banner */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProBanner feature="cv-reviewer" />
                <div 
                  onClick={handleCVReviewerNavigation}
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
                className="dashboard-feature-card tracker"
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
              </div>

              {/* Interview Prep Feature Card */}
              <div 
                onClick={handleInterviewPrepNavigation}
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
                className="dashboard-feature-card cover-letter"
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

              {/* Video Interview Feature Card with Pro Banner */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProBanner feature="video-interview" />
                <div 
                  onClick={handleVideoInterviewNavigation}
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
                className="dashboard-feature-card video-interview"
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem', opacity: '0.3' }}>🎬</div>
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
                    <Camera style={{ width: '32px', height: '32px', color: '#ec4899' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0' }}>
                      Video Interview
                    </h3>
                    <p style={{ fontSize: '14px', color: '#fce7f3', margin: '0' }}>
                      🎥 Practice on camera
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
                  Practice video interviews with AI questions and get comfortable being on camera! 📹
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
                    📹 Record & Review
                  </span>
                  <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '600' }}>
                    Practice Now →
                  </span>
                </div>
                </div>
              </div>

              {/* Talentix Points Feature Card */}
              <div 
                onClick={handlePointsNavigation}
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
                className="dashboard-feature-card cv-reviewer"
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
                onClick={handleSettingsNavigation}
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
                className="dashboard-feature-card interview-prep"
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

              {/* Career Guidance Feature Card with Pro Banner */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ProBanner feature="career-guidance" />
                <div 
                  onClick={handleCareerGuidanceNavigation}
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
                  className="dashboard-feature-card points"
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
              </div>

              {/* AI Chat Feature Card */}
              <div 
                onClick={handleAIChatOpen}
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
                className="dashboard-feature-card search"
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
                className="dashboard-job-card"
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
                    onClick={(e) => handleJobClick(e, job)}
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
                    className="dashboard-apply-btn"
                  >
                    Apply Now
                    <ExternalLink style={{ width: '16px', height: '16px' }} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Achievement Badges Section */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              margin: '0 0 16px 0',
              fontFamily: 'Fredoka',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: '1.1'
            }}>
              🏆 Achievement Gallery 🏆
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#e0f2fe',
              margin: '0',
              fontWeight: '600'
            }}>
              Unlock badges as you complete career milestones!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { name: 'First Login', emoji: '🎉', unlocked: true, description: 'Welcome to Talentix!' },
              { name: 'CV Master', emoji: '📄', unlocked: userPoints >= 50, description: 'Upload your first CV' },
              { name: 'Interview Ready', emoji: '🎤', unlocked: userPoints >= 100, description: 'Complete interview prep' },
              { name: 'Job Hunter', emoji: '🔍', unlocked: userPoints >= 150, description: 'Apply to 5 jobs' },
              { name: 'Social Star', emoji: '⭐', unlocked: userPoints >= 200, description: 'Share your profile' },
              { name: 'Career Champion', emoji: '👑', unlocked: userPoints >= 500, description: 'Reach Silver level' }
            ].map((badge, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: badge.unlocked ? '#ffffff' : '#f3f4f6',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  boxShadow: badge.unlocked ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: badge.unlocked ? '3px solid #fbbf24' : '2px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  opacity: badge.unlocked ? 1 : 0.6,
                  transform: badge.unlocked ? 'scale(1)' : 'scale(0.95)'
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '12px',
                  filter: badge.unlocked ? 'none' : 'grayscale(100%)'
                }}>
                  {badge.emoji}
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: badge.unlocked ? '#1f2937' : '#6b7280', 
                  margin: '0 0 8px 0' 
                }}>
                  {badge.name}
                </h3>
                <p style={{ 
                  fontSize: '12px', 
                  color: badge.unlocked ? '#4b5563' : '#9ca3af', 
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {badge.description}
                </p>
                {badge.unlocked && (
                  <div style={{
                    marginTop: '12px',
                    padding: '6px 12px',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    ✅ Unlocked!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Fun Career Stats Dashboard */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #fce7f3 0%, #ec4899 50%, #be185d 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(236, 72, 153, 0.3)'
          }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              margin: '0 0 16px 0',
              fontFamily: 'Fredoka',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: '1.1'
            }}>
              📊 Your Career Journey 📊
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#fce7f3',
              margin: '0',
              fontWeight: '600'
            }}>
              Track your progress and celebrate wins!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {(() => {
              // Derive real stats from localStorage and quest progress
              let daysActive = 1;
              try {
                const storedUser = localStorage.getItem('talentix_user');
                if (storedUser) {
                  const u = JSON.parse(storedUser);
                  if (u?.createdAt) {
                    const created = new Date(u.createdAt).getTime();
                    const today = new Date();
                    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                    daysActive = Math.max(1, Math.ceil((startOfToday - created) / (1000 * 60 * 60 * 24)) + 1);
                  }
                }
              } catch {}

              // CVs reviewed from quest progress cv_analysis (progress or completed)
              let cvsReviewed = 0;
              try {
                // Check both id-based and email-based quest keys for compatibility
                const sessionStr = localStorage.getItem('talentix_session');
                const userStr = localStorage.getItem('talentix_user');
                const userObj = userStr ? JSON.parse(userStr) : null;
                const possibleKeys = [] as string[];
                if (userObj?.id) possibleKeys.push(`talentix-quests-${userObj.id}`);
                if (userObj?.email) possibleKeys.push(`talentix-quests-${userObj.email}`);
                for (const k of possibleKeys) {
                  const q = localStorage.getItem(k);
                  if (q) {
                    const arr = JSON.parse(q) as Array<any>;
                    const cvQuest = arr.find(qi => qi.id === 'cv_analysis');
                    if (cvQuest) {
                      cvsReviewed = cvQuest.completed ? Math.max(cvQuest.maxProgress, 1) : cvQuest.progress || 0;
                      break;
                    }
                  }
                }
              } catch {}

              // Interview practice count from quest 'interview_practice'
              let interviewCount = 0;
              try {
                const userStr = localStorage.getItem('talentix_user');
                const userObj = userStr ? JSON.parse(userStr) : null;
                const possibleKeys = [] as string[];
                if (userObj?.id) possibleKeys.push(`talentix-quests-${userObj.id}`);
                if (userObj?.email) possibleKeys.push(`talentix-quests-${userObj.email}`);
                for (const k of possibleKeys) {
                  const q = localStorage.getItem(k);
                  if (q) {
                    const arr = JSON.parse(q) as Array<any>;
                    const iq = arr.find(qi => qi.id === 'interview_practice');
                    if (iq) {
                      interviewCount = iq.completed ? Math.max(iq.maxProgress, iq.progress) : (iq.progress || 0);
                      break;
                    }
                  }
                }
              } catch {}

              // Jobs applied from job tracker
              let jobsApplied = 0;
              try {
                const apps = localStorage.getItem('job_applications');
                if (apps) {
                  const parsed = JSON.parse(apps) as Array<any>;
                  jobsApplied = parsed.length;
                }
              } catch {}

              const stats = [
                { title: 'Days Active', value: String(daysActive), emoji: '📅', color: '#3b82f6', bgColor: '#dbeafe', description: 'Keep the streak going!' },
                { title: 'CVs Reviewed', value: String(cvsReviewed), emoji: '📄', color: '#10b981', bgColor: '#dcfce7', description: 'Each review makes you stronger' },
                { title: 'Interview Prep', value: String(interviewCount), emoji: '🎤', color: '#f59e0b', bgColor: '#fef3c7', description: 'Practice makes perfect' },
                { title: 'Jobs Applied', value: String(jobsApplied), emoji: '🎯', color: '#8b5cf6', bgColor: '#e0e7ff', description: "You're putting yourself out there!" }
              ];

              return stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: stat.bgColor,
                  borderRadius: '20px',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  border: `3px solid ${stat.color}20`,
                  transition: 'all 0.3s ease'
                }}
                className="dashboard-feature-card"
              >
                <div style={{ 
                  fontSize: '4rem', 
                  marginBottom: '16px',
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: `${index * 0.5}s`
                }}>
                  {stat.emoji}
                </div>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: stat.color,
                  margin: '0 0 8px 0',
                  fontFamily: 'Fredoka'
                }}>
                  {stat.value}
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#1f2937', 
                  margin: '0 0 8px 0' 
                }}>
                  {stat.title}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#4b5563', 
                  margin: '0',
                  lineHeight: '1.4',
                  fontStyle: 'italic'
                }}>
                  {stat.description}
                </p>
              </div>
              ));
            })()}
          </div>
        </div>

        {/* Motivational Quote Section */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f3e8ff 0%, #8b5cf6 50%, #7c3aed 100%)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
            maxWidth: '800px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Floating quote marks */}
            <div style={{ position: 'absolute', top: '10px', left: '20px', fontSize: '6rem', opacity: '0.2', color: '#ffffff' }}>"</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '20px', fontSize: '6rem', opacity: '0.2', color: '#ffffff', transform: 'rotate(180deg)' }}>"</div>
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: '0 0 24px 0',
                fontFamily: 'Fredoka',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                💪 Daily Motivation 💪
              </h2>
              <blockquote style={{
                fontSize: '1.5rem',
                color: '#f3e8ff',
                margin: '0 0 20px 0',
                lineHeight: '1.6',
                fontStyle: 'italic',
                fontWeight: '500'
              }}>
                "Your future career is created by what you do today, not tomorrow."
              </blockquote>
              <p style={{
                fontSize: '1rem',
                color: '#e0e7ff',
                margin: '0',
                fontWeight: '600'
              }}>
                — The Talentix Team ✨
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ 
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: '0 0 16px 0',
              fontFamily: 'Fredoka',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              lineHeight: '1.1'
            }}>
              ⚡ Quick Actions ⚡
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#4b5563',
              margin: '0',
              fontWeight: '500'
            }}>
              Jump into your career activities!
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              { 
                title: 'Upload New CV', 
                description: 'Get AI feedback instantly',
                emoji: '📤', 
                action: () => router.push('/cv-reviewer'),
                color: '#10b981'
              },
              { 
                title: 'Practice Interview', 
                description: 'Boost your confidence',
                emoji: '🎯', 
                action: () => router.push('/interview-prep'),
                color: '#f59e0b'
              },
              { 
                title: 'Search Jobs', 
                description: 'Find your dream role',
                emoji: '🔍', 
                action: () => router.push('/search'),
                color: '#3b82f6'
              },
              { 
                title: 'Chat with AI', 
                description: 'Get career advice',
                emoji: '💬', 
                action: handleAIChatOpen,
                color: '#8b5cf6'
              }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'left',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: `3px solid ${action.color}20`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
                className="dashboard-feature-card"
              >
                <div style={{
                  fontSize: '3rem',
                  backgroundColor: `${action.color}20`,
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '80px',
                  minHeight: '80px'
                }}>
                  {action.emoji}
                </div>
                <div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#1f2937', 
                    margin: '0 0 8px 0',
                    fontFamily: 'Fredoka'
                  }}>
                    {action.title}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '0',
                    lineHeight: '1.4'
                  }}>
                    {action.description}
                  </p>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  fontSize: '24px',
                  color: action.color
                }}>
                  →
                </div>
              </button>
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