"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import FeaturesMarquee from '../components/FeaturesMarquee';
import { JobPostCardProps } from '../components/JobPostCard';
import SignUpModal from '../components/SignUpModal';
import SignInModal from '../components/SignInModal';
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
    applyLink: 'https://www.boots.jobs/retail/customer-advisor/',
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
    applyLink: 'https://www.costa.co.uk/careers/job-search/',
  },
];

function HomeContent() {
  const { user, loading } = useAuth();
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

  // Debug helper: Press Ctrl+Shift+C to clear all auth data
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyC') {
        console.log('🧹 Manual auth data clear triggered');
        localStorage.removeItem('talentix_user');
        localStorage.removeItem('talentix_session');
        document.cookie = 'talentix-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        window.location.reload();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const [score, setScore] = useState(0);
  const [location, setLocation] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    console.log('🏠 Homepage useEffect:', { 
      user: !!user, 
      isLoaded, 
      loading, 
      hasUserData: !!(user?.email || user?.name),
      localStorage: typeof window !== "undefined" ? !!localStorage.getItem('talentix_user') : false
    });
    
    // Only redirect if we have a complete user object and everything is loaded
    if (typeof window !== "undefined" && user && user.email && isLoaded && !loading) {
      console.log('🏠 Complete user found, setting score and redirecting to dashboard');
      setScore(user.score || 0);
      setLocation(user.location || "Manchester");
      
      // Add a small delay to ensure state is fully set
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } else if (typeof window !== "undefined" && !user && isLoaded && !loading) {
      console.log('🏠 No user found, resetting to defaults');
      setScore(0);
      setLocation("Manchester");
    }
  }, [user, router, isLoaded, loading]);

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
    <div className="min-h-screen bg-white text-gray-800">
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
            src="/logo.png"
            alt="Talentix Logo"
            width={250}
            height={115}
            style={{ objectFit: 'contain', backgroundColor: 'transparent' }}
            className="mx-auto mb-0"
            priority
          />
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-4"
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
          <button 
            onClick={() => setShowSignUpModal(true)}
            className="mt-32 btn-primary-yellow border-4 border-yellow-400/80 rounded-xl text-lg font-semibold relative z-10"
            style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Sign up now
          </button>
        </div>
      </section>

      <FeaturesMarquee />

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
              className="font-bold text-gray-900 mb-4" 
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '40px' }}>
            
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
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
                  <h3 style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0 0 24px 0',
                    fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    textAlign: 'left'
                  }}>
                    OUR STORY
                  </h3>
                  
                  <p style={{
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>
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
        </div>
      </section>

      {/* Contact Us Section - Fun Design */}
      <section className="py-24 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Fun Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-5xl animate-pulse">📞</div>
          <div className="absolute top-20 right-20 text-4xl animate-bounce">📧</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-spin">💬</div>
          <div className="absolute bottom-10 right-10 text-5xl animate-pulse">🤝</div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 
            className="font-bold text-gray-900 mb-8" 
            style={{ 
              fontSize: '4rem',
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            💬 Get In Touch! 💬
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Have questions? Need help? We'd love to hear from you! 🎉
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div 
              className="bg-white rounded-3xl p-8 shadow-xl border-2 border-yellow-200 transform transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Fredoka'" }}>
                Email Us
              </h3>
              <p className="text-gray-600 mb-4">Send us a message anytime!</p>
              <a 
                href="mailto:talentixuk@gmail.com"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ textDecoration: 'none' }}
              >
                talentixuk@gmail.com
              </a>
            </div>
            
            {/* Phone Card */}
            <div 
              className="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 transform transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Fredoka'" }}>
                Call Us
              </h3>
              <p className="text-gray-600 mb-4">Give us a ring!</p>
              <a 
                href="tel:07828946517"
                className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{ textDecoration: 'none' }}
              >
                07828 946517
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Website Screenshots Carousel */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 
            className="font-bold text-center mb-16 text-gray-900" 
            style={{ 
              fontSize: '4rem',
              fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🖥️ See Talentix In Action! 📱
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Dashboard Screenshot */}
            <div className="bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4 mb-4">
                <div className="text-8xl text-center">🏠</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Fredoka'" }}>
                Your Dashboard
              </h3>
              <p className="text-gray-600">Track your progress, earn points, and manage your career journey!</p>
            </div>
            
            {/* CV Reviewer Screenshot */}
            <div className="bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-4 mb-4">
                <div className="text-8xl text-center">📄</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Fredoka'" }}>
                AI CV Review
              </h3>
              <p className="text-gray-600">Get instant feedback on your CV from our smart AI system!</p>
            </div>
            
            {/* Job Search Screenshot */}
            <div className="bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-300 hover:scale-105 hover:rotate-1">
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-4 mb-4">
                <div className="text-8xl text-center">🔍</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Fredoka'" }}>
                Job Search
              </h3>
              <p className="text-gray-600">Find your perfect first job with our powerful search tools!</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => setShowSignUpModal(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-3xl font-bold text-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform"
              style={{ fontFamily: "'Fredoka'" }}
            >
              🚀 Try It Now - It's Free! 🚀
            </button>
          </div>
        </div>
      </section>
      
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)} 
      />
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
      
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
