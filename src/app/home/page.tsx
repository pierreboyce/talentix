"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import FeaturesMarquee from '../../components/FeaturesMarquee';
import HomepageFeaturesCarousel from '../../components/HomepageFeaturesCarousel';
import FeatureShowcaseCarousel from '../../components/FeatureShowcaseCarousel';
import HomepageMobile from '../../components/HomepageMobile';
import ClientOnly from '../../components/ClientOnly';
import { JobPostCardProps } from '../../components/JobPostCard';
import SignUpModal from '../../components/SignUpModal';
import SignInModal from '../../components/SignInModal';
import { ExternalLink, Building2, ShoppingBag, Store, Coffee } from "lucide-react";

const floatingEmojis = [
  { emoji: '💰', top: '10%', left: '5%', size: 'text-[10rem]', rotate: '-15deg' },
  { emoji: '📄', top: '15%', left: '85%', size: 'text-[7rem]', rotate: '20deg' },
  { emoji: '🗣️', top: '75%', left: '10%', size: 'text-[10rem]', rotate: '10deg' },
  { emoji: '💡', top: '65%', left: '90%', size: 'text-[10rem]', rotate: '-5deg' },
  { emoji: '🤝', top: '50%', left: '45%', size: 'text-[10rem]', rotate: '15deg' },
  { emoji: '🧠', top: '85%', left: '50%', size: 'text-[10rem]', rotate: '-10deg' },
  { emoji: '✨', top: '5%', left: '40%', size: 'text-[10rem]', rotate: '5deg' },
  { emoji: '📈', top: '30%', left: '15%', size: 'text-[10rem]', rotate: '12deg' },
  { emoji: '🚀', top: '80%', left: '75%', size: 'text-[10rem]', rotate: '-15deg' },
];

const demoJobs = [
  {
    company: "McDonald's",
    logo: "🍔",
    position: "Crew Member",
    location: "Manchester",
    salary: "£8.50 - £9.50/hour",
    type: "Part-time",
    description: "Join our team! We're looking for enthusiastic crew members to help serve our customers.",
    rating: 4.2,
    applicants: 12
  },
  {
    company: "Tesco",
    logo: "🛒",
    position: "Customer Service Assistant",
    location: "London",
    salary: "£9.00 - £10.00/hour",
    type: "Part-time",
    description: "Help customers find what they need and provide excellent service.",
    rating: 4.5,
    applicants: 8
  },
  {
    company: "Costa Coffee",
    logo: "☕",
    position: "Barista",
    location: "Birmingham",
    salary: "£8.75 - £9.75/hour",
    type: "Part-time",
    description: "Learn to make amazing coffee and serve customers in a friendly environment.",
    rating: 4.8,
    applicants: 15
  },
];

const demoBlogs = [
  {
    id: 1,
    title: "How to Write Your First CV",
    image: "/blog-cv.jpg",
    excerpt: "Learn how to create a compelling CV that highlights your strengths and potential.",
    readTime: "5 min read",
    category: "CV Writing"
  },
  {
    id: 2,
    title: "Interview Tips for Teens",
    image: "/blog-interview.jpg",
    excerpt: "Master the art of interviewing with these proven techniques for teenagers.",
    readTime: "7 min read",
    category: "Interviewing"
  },
  {
    id: 3,
    title: "Where to Find Your First Job",
    image: "/blog-findjob.jpg",
    excerpt: "Discover the best places to look for your first job, from local businesses to online platforms.",
    readTime: "6 min read",
    category: "Job Search"
  },
];

const featuredJobs: JobPostCardProps[] = [
  {
    companyName: "McDonald's",
    companyLogo: 'Building2',
    jobTitle: 'Crew Member (Part-time)',
    description: "Join our amazing team to create great customer experiences. Flexible hours and opportunities to progress.",
    applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/part-time-crew-member',
  },
  {
    companyName: 'Boots',
    companyLogo: 'ShoppingBag',
    jobTitle: 'Customer Advisor',
    description: 'Help customers find the right products, introduce them to new things, and make their shopping experience better.',
    applyLink: 'https://www.boots.jobs/search-jobs',
  },
  {
    companyName: 'Tesco',
    companyLogo: 'Store',
    jobTitle: 'Customer Assistant',
    description: 'Become the friendly face of our store, helping customers with a smile and ensuring shelves are stocked.',
    applyLink: 'https://www.tesco-careers.com/search-and-apply/',
  },
  {
    companyName: 'Costa Coffee',
    companyLogo: 'Coffee',
    jobTitle: 'Barista (Part-time)',
    description: 'Create amazing coffee experiences for our customers. Perfect for students with flexible scheduling available.',
    applyLink: 'https://www.costacareers.co.uk',
  },
];

function HomeContent() {
  // Auto-refresh detection for blank gradient screen
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkForBlankScreen = () => {
      // Check after a short delay if content hasn't loaded
      const timer = setTimeout(() => {
        const hasMainContent = document.querySelector('section') !== null || 
                               document.querySelector('h1') !== null ||
                               document.body.textContent?.trim().length > 100;
        
        // If we're on /home but see blank gradient (only navigation visible), refresh
        if (window.location.pathname === '/home' && !hasMainContent) {
          const nav = document.querySelector('nav, header');
          const hasOnlyNav = nav !== null && document.body.children.length <= 2;
          
          if (hasOnlyNav) {
            console.log('🔄 Blank gradient detected on /home, refreshing page');
            window.location.reload();
          }
        }
      }, 1500);

      return () => clearTimeout(timer);
    };

    return checkForBlankScreen();
  }, []);

  // EMERGENCY FIX: Don't render homepage content if we're not on the home page
  if (typeof window !== "undefined" && window.location.pathname !== '/home') {
    console.log('🚫 Homepage component blocked - not on home path:', window.location.pathname);
    return null;
  }

  const { user, loading } = useAuth();
  const { isMobile } = useDeviceDetection();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Clear any corrupted auth state on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for corrupted or incomplete user data
      const storedUser = localStorage.getItem('talentix_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // If user data exists but is incomplete, clear it
          if (!userData.email || !userData.name) {
            console.log('🧹 Clearing incomplete user data');
            localStorage.removeItem('talentix_user');
            localStorage.removeItem('talentix_session');
            document.cookie = 'talentix-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          }
        } catch (error) {
          console.log('🧹 Clearing corrupted user data');
          localStorage.removeItem('talentix_user');
          localStorage.removeItem('talentix_session');
          document.cookie = 'talentix-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      }
    }
  }, []);


  const [score, setScore] = useState(0);
  const [location, setLocation] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showWhatWeDoModal, setShowWhatWeDoModal] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Listen for custom events from feature carousel
  useEffect(() => {
    const handleOpenSignUpModal = () => {
      setShowSignUpModal(true);
    };

    window.addEventListener('openSignUpModal', handleOpenSignUpModal);
    
    return () => {
      window.removeEventListener('openSignUpModal', handleOpenSignUpModal);
    };
  }, []);

  // Removed mobile conditional rendering to prevent hydration issues

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoaded(true);
    }
  }, []);

  // Add redirect guard to prevent multiple redirects
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log('🏠 Homepage useEffect (SHOULD NOT RUN ON DASHBOARD):', { 
      currentPath: typeof window !== "undefined" ? window.location.pathname : 'unknown',
      user: !!user, 
      isLoaded, 
      loading, 
      hasRedirected,
      hasUserData: !!(user?.email || user?.name),
      localStorage: typeof window !== "undefined" ? !!localStorage.getItem('talentix_user') : false
    });
    
    // Only redirect if we have a complete user object and everything is loaded AND we haven't redirected yet
    // AND we're actually on the home page (not already on dashboard)
    if (typeof window !== "undefined" && user && user.email && isLoaded && !loading && !hasRedirected && window.location.pathname === '/home') {
      console.log('🏠 Complete user found, setting score and redirecting to dashboard');
      setHasRedirected(true); // Prevent multiple redirects
      setScore(user.score || 0);
      setLocation(user.location || "Manchester");
      
      // Use router.replace instead of push to prevent back navigation issues
      router.replace('/dashboard');
    } else if (typeof window !== "undefined" && !user && isLoaded && !loading && !hasRedirected) {
      console.log('🏠 No user found, resetting to defaults');
      setScore(0);
      setLocation("Manchester");
    }
  }, [user, router, isLoaded, loading, hasRedirected]);

  // Handle OAuth errors
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        'oauth_cancelled': 'OAuth authentication was cancelled',
        'oauth_missing_params': 'OAuth authentication failed - missing parameters',
        'oauth_invalid_state': 'OAuth authentication failed - invalid state',
        'oauth_callback_error': 'OAuth authentication failed - callback error',
        'oauth_config_error': 'OAuth credentials not configured. Please set up your .env.local file with Google and Microsoft OAuth credentials.',
        'oauth_missing_code': 'Google OAuth configuration error. Please check your Google Cloud Console redirect URI is set to: http://localhost:3000/api/auth/callback/google'
      };
      
      setOauthError(errorMessages[error] || 'OAuth authentication failed');
      
      // Clear error from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      router.replace(newUrl.pathname + newUrl.search);
      
      // Clear error after 8 seconds for config error (more time to read)
      setTimeout(() => setOauthError(null), error === 'oauth_config_error' ? 8000 : 5000);
    }
  }, [searchParams, router]);

  if (showLoader) {
  return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fde047',
          background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 50%, #fde047 100%)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '1rem'
          }}>
            <h1 style={{
              fontSize: '12rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
              padding: 0
            }}>
              Loading
            </h1>
            <span style={{
              fontSize: '12rem',
              color: '#1f2937',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: '0s'
            }}>
              .
            </span>
            <span style={{
              fontSize: '12rem',
              color: '#1f2937',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: '0.5s'
            }}>
              .
            </span>
            <span style={{
              fontSize: '12rem',
              color: '#1f2937',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: '1s'
            }}>
              .
            </span>
          </div>
        </div>
        
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { 
              opacity: 1; 
            }
            50% { 
              opacity: 0.3; 
            }
          }
          
          body {
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        `}</style>
      </div>
    );
  }

  // OAuth Error Display
  if (oauthError) {
    const isConfigError = oauthError.includes('credentials not configured');
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h2>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{oauthError}</p>
            
            {isConfigError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>To enable OAuth:</strong>
                </p>
                <ol className="text-xs text-yellow-700 list-decimal list-inside space-y-1">
                  <li>Create a <code className="bg-yellow-200 px-1 rounded">.env.local</code> file in your project root</li>
                  <li>Follow the setup instructions in <code className="bg-yellow-200 px-1 rounded">oauth-setup.md</code></li>
                  <li>Restart your development server</li>
                </ol>
          </div>
            )}
            
            <div className="space-y-2">
              <button
                onClick={() => setOauthError(null)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded mr-2"
              >
                Continue
              </button>
              {isConfigError && (
                <button
                  onClick={() => window.open('/api/auth/oauth/test', '_blank')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
                >
                  Check Config
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting signed-in users (only if we have complete user data)
  if (user && user.email && isLoaded && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white text-gray-800"
      suppressHydrationWarning
      data-is-mobile={isMobile ? 'true' : 'false'}
    >
      {/* New Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Floating Emojis */}
        {floatingEmojis.map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.size} opacity-30 float`}
            style={{ 
              top: item.top, 
              left: item.left, 
              transform: `rotate(${item.rotate})`,
              zIndex: 1
            }}
          >
            {item.emoji}
          </div>
        ))}

        <div className="z-10 relative">
          <Image
            src="/talentixborder.png"
            alt="Talentix Logo"
            width={250}
            height={115}
            style={{ objectFit: 'contain', backgroundColor: 'transparent' }}
            className="mx-auto mb-0"
            priority
          />
          <h2 
            className="text-sm md:text-base lg:text-lg text-white leading-tight mb-4"
            style={{ 
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              marginTop: '-8px'
            }}
          >
            to get you your first job
          </h2>
          <h1 
            className="font-bold text-[5rem] md:text-[8rem] lg:text-[12rem] text-gray-900 leading-tight"
            style={{ 
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              position: 'relative',
              zIndex: 1
            }}
          >
            for <span className="yellow-gradient-text">teenagers</span> by a <span className="yellow-gradient-text">teenager</span>
          </h1>
          <div className="flex flex-col items-center gap-4 mt-32">
            <button 
              onClick={() => setShowSignUpModal(true)}
              className="btn-primary-yellow border-4 border-yellow-400/80 rounded-xl text-lg font-semibold relative z-10"
              style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              Sign up now
            </button>
            
            <button 
              onClick={() => {
                console.log('Button clicked! Setting modal to true');
                setShowWhatWeDoModal(true);
                console.log('showWhatWeDoModal state should now be:', true);
              }}
              className="btn-primary-purple-small border-3 border-purple-400/80 rounded-lg text-base font-semibold relative z-10"
              style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              What do we do? 🤔
            </button>
          </div>
        </div>
      </section>

      <FeatureShowcaseCarousel />

      <HomepageFeaturesCarousel />

      {/* Featured Jobs Section - Fun & Engaging Design */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pt-40 pb-24 relative overflow-hidden">
        {/* Fun Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">💼</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">🎯</div>
          <div className="absolute bottom-20 left-20 text-4xl animate-spin">⭐</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-bounce">🚀</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="font-bold text-gray-900 mb-4 featured-jobs-heading" 
              style={{ 
                fontSize: '4.5rem',
                fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Featured Jobs
            </h2>
            {/* Subtitle removed per request */}
          </div>
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            {featuredJobs.map((job) => {
              // Function to render the appropriate icon with fun colors
              const renderIcon = (iconName: string) => {
                const iconData = {
                  'Building2': { icon: Building2, color: '#ef4444', bgColor: '#fef2f2' }, // Red theme for McDonald's
                  'ShoppingBag': { icon: ShoppingBag, color: '#8b5cf6', bgColor: '#f5f3ff' }, // Purple theme for Boots
                  'Store': { icon: Store, color: '#06b6d4', bgColor: '#f0fdff' }, // Cyan theme for Tesco
                  'Coffee': { icon: Coffee, color: '#f59e0b', bgColor: '#fffbeb' } // Amber theme for Costa
                };
                
                const data = iconData[iconName as keyof typeof iconData] || iconData['Building2'];
                const IconComponent = data.icon;
                
                return {
                  icon: <IconComponent size={28} color={data.color} />,
                  color: data.color,
                  bgColor: data.bgColor
                };
              };

              const iconInfo = renderIcon(job.companyLogo);
              
              return (
                <div key={job.companyName} style={{
                  position: 'relative',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: '3px solid transparent',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  background: `linear-gradient(135deg, ${iconInfo.bgColor} 0%, #ffffff 30%, ${iconInfo.bgColor} 100%)`,
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 6s ease infinite',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `3px solid ${iconInfo.color}`;
                  e.currentTarget.style.boxShadow = `0 30px 60px rgba(0, 0, 0, 0.2), 0 0 30px ${iconInfo.color}40`;
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02) rotate(1deg)';
                  e.currentTarget.style.backgroundPosition = '100% 100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '3px solid transparent';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0px) scale(1) rotate(0deg)';
                  e.currentTarget.style.backgroundPosition = '0% 0%';
                }}
                >
                  {/* Floating decorative elements */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '15px',
                    fontSize: '24px',
                    opacity: '0.25',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    ✨
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    fontSize: '18px',
                    opacity: '0.15',
                    animation: 'float 4s ease-in-out infinite reverse'
                  }}>
                    💼
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        width: '72px',
                        height: '72px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${iconInfo.color}20 0%, ${iconInfo.color}10 100%)`,
                        borderRadius: '20px',
                        border: `3px solid ${iconInfo.color}30`,
                        boxShadow: `0 8px 20px ${iconInfo.color}20`,
                        transition: 'all 0.3s ease',
                        animation: 'iconPulse 2s ease-in-out infinite'
                      }}>
                        <div style={{ color: iconInfo.color, transform: 'scale(1.2)' }}>
                          {iconInfo.icon}
                        </div>
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          background: `linear-gradient(135deg, ${iconInfo.color} 0%, #1f2937 100%)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          margin: '0 0 6px 0',
                          fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {job.jobTitle}
                        </h3>
                        <p style={{
                          fontSize: '18px',
                          color: iconInfo.color,
                          margin: '0',
                          fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                          fontWeight: '600',
                          opacity: '0.8'
                        }}>
                          🏢 {job.companyName}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    lineHeight: '1.5',
                    margin: '0 0 20px 0'
                  }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: `linear-gradient(135deg, ${iconInfo.color} 0%, #fbbf24 50%, ${iconInfo.color} 100%)`,
                        color: '#ffffff',
                        padding: '16px 32px',
                        borderRadius: '25px',
                        textDecoration: 'none',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        boxShadow: `0 8px 20px ${iconInfo.color}40`,
                        position: 'relative',
                        overflow: 'hidden',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 15px 35px ${iconInfo.color}60`;
                        e.currentTarget.style.background = `linear-gradient(135deg, #fbbf24 0%, ${iconInfo.color} 50%, #fbbf24 100%)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                        e.currentTarget.style.boxShadow = `0 8px 20px ${iconInfo.color}40`;
                        e.currentTarget.style.background = `linear-gradient(135deg, ${iconInfo.color} 0%, #fbbf24 50%, ${iconInfo.color} 100%)`;
                      }}
                    >
                      🚀 Apply Now!
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story and Our Services Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '40px' }}>
            
            {/* Our Story Box */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div className="stack-on-mobile" style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
                <div style={{ flexShrink: 0 }}>
                  <Image
                    src="/pierre headshot.jpeg"
                    alt="Pierre Headshot"
                    width={180}
                    height={240}
                    style={{ borderRadius: '24px', objectFit: 'cover', boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.15)' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 className="homepage-our-story-title" style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0 0 24px 0',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    textAlign: 'left'
                  }}>
                    OUR STORY
                  </h3>
                  
                  <p className="homepage-our-story-text" style={{
                    fontSize: '18px',
                    color: '#4b5563',
                    lineHeight: '1.7',
                    margin: '0 0 24px 0',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}>
                    The Our Story section highlights the journey that shaped the organisation, outlining its background, guiding values, and the principles that continue to influence its work today.
                  </p>
                  
                  <button
                    onClick={() => router.push('/our-story')}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#000',
                      padding: '16px 32px',
                      borderRadius: '25px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.4)';
                    }}
                  >
                    🚀 Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Our Services Box */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div className="stack-on-mobile" style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
                <div style={{ flexShrink: 0 }}>
                  <Image
                    src="/talentix our services.jpeg"
                    alt="Talentix Our Services"
                    width={180}
                    height={240}
                    style={{ borderRadius: '24px', objectFit: 'cover', boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.15)' }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0 0 24px 0',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    textAlign: 'left'
                  }}>
                    SERVICES
                  </h3>
                  
                  <p style={{
                    fontSize: '18px',
                    color: '#4b5563',
                    lineHeight: '1.7',
                    margin: '0 0 24px 0',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                  }}>
                    Here we'll talk about how our services can help your school or you as an individual. We offer interactive workshops & assemblies within schools to help you secure your first job!
                  </p>
                  
                  <button
                    onClick={() => router.push('/our-services')}
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#000',
                      padding: '16px 32px',
                      borderRadius: '25px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(251, 191, 36, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.4)';
                    }}
                  >
                    ⚡ Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          

          {/* Footer Links */}
          <div className="mt-16 pt-8 border-t border-gray-300 text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <button
                onClick={() => router.push('/privacy')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                🔒 Privacy Policy
              </button>
              <button
                onClick={() => router.push('/terms')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                📋 Terms of Service
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                💌 Contact Us
              </button>
              <button
                onClick={() => router.push('/admin-access')}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                🔐 Admin
              </button>
            </div>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              © {new Date().getFullYear()} Talentix. All rights reserved. Made with ❤️ for your career success.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section - Modern Playful Design */}
      <section className="py-24 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">📞</div>
          <div className="absolute top-20 right-20 text-5xl animate-pulse">📧</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-spin" style={{ animationDuration: '6s' }}>💬</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-pulse" style={{ animationDelay: '1s' }}>🤝</div>
          <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '2s' }}>✨</div>
          <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse" style={{ animationDelay: '1.5s' }}>💫</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="mb-16">
          <h2 
              className="font-black text-gray-900 mb-6" 
            style={{ 
                fontSize: '5rem',
                fontFamily: 'Fredoka, sans-serif',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 30%, #f59e0b 70%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            💬 Get In Touch! 💬
          </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Email Card - Enhanced */}
            <div 
              className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gradient-to-r from-purple-300 to-pink-300 transform transition-all duration-500 hover:scale-110 hover:rotate-2 hover:shadow-3xl"
              style={{ 
                padding: '40px 30px',
                boxShadow: '0 25px 50px rgba(139, 92, 246, 0.3)',
                border: '4px solid transparent',
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #a855f7, #ec4899) border-box'
              }}
            >
              <div className="text-8xl mb-6 group-hover:animate-bounce">📧</div>
              <h3 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Email Us
              </h3>
              <p className="text-lg text-gray-600 mb-6 font-medium" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Send us a message anytime!
              </p>
              <a 
                href="mailto:enquiries@talentix.co.uk"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-3xl font-black text-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 group-hover:animate-pulse"
                style={{ textDecoration: 'none', fontFamily: 'Fredoka, sans-serif' }}
              >
                enquiries@talentix.co.uk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PLAYFUL TESTIMONIALS CARDS SECTION */}
      <div style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #FEF7CD 0%, #FDE047 30%, #FACC15 70%, #F59E0B 100%)',
        minHeight: '600px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '900',
              color: '#374151',
              marginBottom: '16px',
              fontFamily: 'Fredoka, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              What our users are saying 🌟
          </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#6B7280',
              fontFamily: 'Fredoka, sans-serif'
            }}>
              Here's what some of our users have to say about Talentix! 💖
            </p>
          </div>

          {/* 3-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {/* Card 1 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  Sarah Johnson 😊
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @sarahjohnson
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                The platform has really helped me stay focused on my career goals and discover opportunities I never knew existed! 🚀
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
              </div>
            </div>
            
            {/* Card 2 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  Marcus Chen 🎯
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @marcuschen
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                The site is super easy to use and understand, especially for someone like me just starting my career journey! ✨
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
              </div>
            </div>
            
            {/* Card 3 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  Emma Rodriguez 💼
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @emmarodriguez
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                Talentix is clean and looks professional. It gave me the confidence boost I needed to pursue better opportunities! 🌟
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
            </div>
          </div>
          
            {/* Card 4 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  David Thompson 🏆
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @davidthompson
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                The AI interview practice has been invaluable in preparing me for real interviews. I feel so much more confident now! 💪
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
              </div>
            </div>

            {/* Card 5 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  Lisa Park 📄
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @lisapark
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                The CV builder helped me create a professional resume that stands out. I started getting more interview calls immediately! 📞
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
              </div>
            </div>

            {/* Card 6 */}
            <div style={{
              background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)',
              padding: '32px',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-8px)';
              (e.target as HTMLElement).style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  Alex Kumar 📚
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#9CA3AF',
                  fontFamily: 'Fredoka, sans-serif'
                }}>
                  @alexkumar
                </p>
              </div>
              <p style={{
                color: '#D1D5DB',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem'
              }}>
                The learning resources are comprehensive and well-organized. Perfect for continuous skill development and career growth! 🌱
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{
                    color: '#FFD600',
                    fontSize: '1.4rem',
                    textShadow: '0 0 10px rgba(255, 214, 0, 0.5)'
                  }}>★</span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FDE047 0%, #F97316 100%)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '600px',
              margin: '0 auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px',
                fontFamily: 'Fredoka, sans-serif'
              }}>
                Ready to join them? 🚀
              </h3>
              <p style={{
                color: '#374151',
                marginBottom: '24px',
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1.1rem'
              }}>
                Start your career journey today and become our next success story! ✨
              </p>
            <button 
              onClick={() => setShowSignUpModal(true)}
                style={{
                  background: '#111827',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '16px 32px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontFamily: 'Fredoka, sans-serif',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1.05)';
                  (e.target as HTMLElement).style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'scale(1)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
                }}
              >
                Get Started Free 💫
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            © 2024 Talentix - Made with 💖 for job seekers everywhere!
          </p>
        </div>
      </footer>
      
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
      />
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
      
      {/* What do we do? Modal - Simple Test */}
      {showWhatWeDoModal ? (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px'
          }}
          onClick={() => setShowWhatWeDoModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '95vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowWhatWeDoModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Content */}
            <div style={{ textAlign: 'center' }}>
              <h2 
                className="modal-title"
                style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold', 
                  marginBottom: '20px',
                  fontFamily: "'Fredoka', sans-serif"
                }}
              >
                What We Do 🎉
              </h2>
              
              <p 
                className="modal-description"
                style={{ 
                  fontSize: '18px', 
                  marginBottom: '30px',
                  lineHeight: '1.6'
                }}
              >
                <strong>Talentix</strong> is a youth-led employment agency helping teenagers land their dream jobs through interactive workshops and powerful digital tools! 🚀
              </p>

              <h3 
                className="modal-subtitle"
                style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold', 
                  marginBottom: '20px',
                  fontFamily: "'Fredoka', sans-serif"
                }}
              >
                ✨ Our Amazing Features
              </h3>

              {/* Simple feature list */}
              <div 
                className="modal-features-grid"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '15px',
                  marginBottom: '30px'
                }}
              >
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>📄</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>CV Reviewer</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>AI-powered analysis</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🎤</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Interview Practice</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Video prep & feedback</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔍</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Job Search</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Perfect opportunities</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🧭</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Career Guidance</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Expert advice</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>🏆</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Talentix Points</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Earn rewards</p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '20px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '30px', marginBottom: '10px' }}>👥</div>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Community</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Connect & share</p>
                </div>
              </div>

              {/* Call to action */}
              <button 
                onClick={() => {
                  setShowWhatWeDoModal(false);
                  setShowSignUpModal(true);
                }}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '25px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: "'Fredoka', sans-serif"
                }}
              >
                Get Started Now! 🎯
              </button>
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Fun Animations for Job Cards */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes modalFadeIn {
          0% { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        /* Mobile-specific modal fixes */
        @media (max-width: 768px) {
          .modal-title {
            font-size: 28px !important;
            margin-bottom: 15px !important;
          }
          
          .modal-description {
            font-size: 16px !important;
            margin-bottom: 20px !important;
            padding: 0 10px !important;
          }
          
          .modal-subtitle {
            font-size: 20px !important;
            margin-bottom: 15px !important;
          }
          
          .modal-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          
          .modal-features-grid > div {
            padding: 15px !important;
            font-size: 14px !important;
          }
          
          .modal-features-grid h4 {
            font-size: 14px !important;
            margin-bottom: 3px !important;
          }
          
          .modal-features-grid p {
            font-size: 12px !important;
          }
          
          .modal-features-grid > div > div:first-child {
            font-size: 24px !important;
            margin-bottom: 8px !important;
          }
          
          .homepage-our-story-title {
            font-size: 1.75rem !important;
            margin: 0 0 16px 0 !important;
          }
          
          .homepage-our-story-text {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            margin: 0 0 16px 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .modal-title {
            font-size: 24px !important;
            margin-bottom: 12px !important;
          }
          
          .modal-description {
            font-size: 14px !important;
            margin-bottom: 18px !important;
            padding: 0 5px !important;
          }
          
          .modal-subtitle {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          
          .modal-features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          
          .modal-features-grid > div {
            padding: 12px !important;
          }
          
          .modal-features-grid h4 {
            font-size: 13px !important;
          }
          
          .modal-features-grid p {
            font-size: 11px !important;
          }
          
          .modal-features-grid > div > div:first-child {
            font-size: 22px !important;
            margin-bottom: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
