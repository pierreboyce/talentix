"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import FeaturesMarquee from '../../components/FeaturesMarquee';
import HomepageFeaturesCarousel from '../../components/HomepageFeaturesCarousel';
import FeatureShowcaseCarousel from '../../components/FeatureShowcaseCarousel';
import HomepageMobile from '../../components/HomepageMobile';
import ClientOnly from '../../components/ClientOnly';
import SignUpModal from '../../components/SignUpModal';
import SignInModal from '../../components/SignInModal';

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


const heroWorkshopImages = [
  "/Talentix%20Workshops%20Images/IMG_2206.jpeg",
  "/Talentix%20Workshops%20Images/IMG_2209.jpeg",
  "/Talentix%20Workshops%20Images/IMG_2212.jpeg",
  "/Talentix%20Workshops%20Images/IMG_2218.jpeg",
  "/Talentix%20Workshops%20Images/IMG_2228.jpeg",
  "/Talentix%20Workshops%20Images/IMG_2286.jpeg",
];

const workedWithLogos = [
  { src: "/Jp-Morgan-Logo-PNG-Photo.png", alt: "J.P. Morgan", mobileScale: 1.55 },
  { src: "/EY-Logo-PNG-Images-HD.png", alt: "EY", mobileScale: 1.3 },
  { src: "/AOShearman_Logo.png", alt: "A&O Shearman", mobileScale: 0.9 },
  { src: "/Morgan-Stanley-Logo-PNG-HD.png", alt: "Morgan Stanley", mobileScale: 1.35 },
  { src: "/R.png", alt: "Rolls-Royce", mobileScale: 0.95 },
  { src: "/Barclays-Logo-PNG-1024x173.webp", alt: "Barclays", mobileScale: 1.0 },
  { src: "/l.avif", alt: "Endeavour Academy Bexley", mobileScale: 1.45 },
  { src: "/st-albans-academy.png", alt: "Ark St Albans Academy", mobileScale: 1.25 },
];

const workshopTestimonialPlaceholders = [
  {
    quote: "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students [...] I haven't seen them more engaged!",
    name: "Emma Seffens",
    role: "Careers Officer at Endeavour Academy Bexley"
  },
  {
    quote: "The Talentix workshop was exactly what our Year 11s needed. They connected with the students in a way that felt real and relatable.",
    name: "Charlene Steele",
    role: "Careers Lead at Ark St Albans Academy"
  },
  {
    quote: "Probably the best workshop I've ever had!",
    name: "Teddy",
    role: "Year 10"
  }
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
                               (document.body.textContent?.trim().length ?? 0) > 100;
        
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
  const [activeHeroWorkshopImage, setActiveHeroWorkshopImage] = useState(0);
  const [activeWorkshopTestimonial, setActiveWorkshopTestimonial] = useState(0);

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
    if (typeof window === "undefined") return;
    
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
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
    }, [router]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroWorkshopImage((current) => (current + 1) % heroWorkshopImages.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const testimonialTimer = window.setInterval(() => {
      setActiveWorkshopTestimonial((current) => (current + 1) % workshopTestimonialPlaceholders.length);
    }, 4200);

    return () => window.clearInterval(testimonialTimer);
  }, []);

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
      <section className="relative min-h-screen lg:min-h-[calc(100vh-80px)] flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-20 md:py-28 lg:py-8 xl:py-10 overflow-hidden">
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

        <div className="hero-layout-wrap z-10 relative w-full max-w-[1600px] mx-auto flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-12">
          {/* Left Side - Logo and Text Group */}
          <div className="hero-left-content w-full lg:w-auto lg:flex-1 flex flex-col items-start gap-6 lg:translate-y-0 xl:translate-y-0">
            {/* Logo - Centered slightly left */}
            <div className="hero-logo-container hero-logo-mobile-hidden w-full lg:w-auto px-8 md:px-12 lg:px-0 lg:mt-0 xl:mt-0">
              <Image
                src="/longtalentixupdated.png"
                alt="Talentix Logo"
                width={280}
                height={130}
                className="lg:w-[320px] lg:h-[150px] xl:w-[360px] xl:h-[170px]"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            {/* Text Container - Centered but slightly left */}
            <div className="hero-text-container w-full lg:w-auto px-8 md:px-12 lg:px-0">
              <h1
                className="hero-main-heading text-[3.2rem] md:text-[5rem] lg:text-[10rem] xl:text-[12rem] font-black leading-[0.9] tracking-[-0.02em] mb-0"
                style={{
                  fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  textShadow: "0 6px 18px rgba(17, 24, 39, 0.12)",
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="hero-word-black">FOR </span>
                <br className="hero-split-break" />
                <span className="hero-word-gold">TEENAGERS</span>
                <br />
                <span className="hero-word-black">BY </span>
                <br className="hero-split-break" />
                <span className="hero-word-gold">TEENAGERS</span>
              </h1>
              <div className="hero-what-we-do-wrap mt-8 md:mt-10 lg:mt-16 xl:mt-20">
                <button
                  onClick={() => setShowWhatWeDoModal(true)}
                  className="hero-what-we-do-btn btn-primary-purple-small border-3 border-purple-400/80 rounded-lg text-base font-semibold relative z-10"
                  style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                >
                  What do we do? 🤔
                </button>
              </div>
          </div>
          </div>

          {/* Image Container - Right Side */}
          <div className="hero-workshop-circle-wrap flex-shrink-0" aria-hidden="true">
            <div className="hero-workshop-circle">
              <Image
                key={heroWorkshopImages[activeHeroWorkshopImage]}
                src={heroWorkshopImages[activeHeroWorkshopImage]}
                alt="Talentix youth-led employability workshop in a UK secondary school"
                fill
                sizes="(max-width: 1024px) 320px, 520px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Talentix Workshops Section */}
      <section className="workshops-section relative py-14 md:py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-yellow-200 blur-3xl"></div>
          <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-purple-200 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="workshops-layout">
            <Image
              src="/talentixworkshopslogo.png"
              alt="Talentix Workshops logo"
              width={260}
              height={120}
              className="workshops-mobile-top-logo"
              style={{ objectFit: "contain" }}
            />

            <div className="workshops-image-shell" aria-hidden="true">
              <Image
                key={isMobile ? heroWorkshopImages[activeHeroWorkshopImage] : '/Talentix%20Workshops%20Images/IMG_2234.jpeg'}
                src={isMobile ? heroWorkshopImages[activeHeroWorkshopImage] : '/Talentix%20Workshops%20Images/IMG_2234.jpeg'}
                alt="Students taking part in a Talentix employability workshop"
                width={900}
                height={720}
                className="workshops-main-image"
                style={{ objectFit: "cover" }}
              />
              <div className="workshops-image-fade" />
            </div>
            {isMobile ? (
              <div className="workshops-mobile-image-dots" aria-label="workshop image slide indicators">
                {heroWorkshopImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveHeroWorkshopImage(index)}
                    className={`workshops-mobile-image-dot ${index === activeHeroWorkshopImage ? 'is-active' : ''}`}
                    aria-label={`Show workshop image ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}

            <div className="workshops-right">
              <Image
                src="/talentixworkshopslogo.png"
                alt="Talentix Workshops logo"
                width={220}
                height={102}
                className="workshops-testimonial-logo"
                style={{ objectFit: "contain" }}
              />
              <div className="workshops-testimonial-card" key={activeWorkshopTestimonial}>
                <p className="workshops-testimonial-label">Testimonials</p>
                <blockquote className="workshops-testimonial-quote">
                  "{workshopTestimonialPlaceholders[activeWorkshopTestimonial].quote}"
                </blockquote>
                <p className="workshops-testimonial-person">
                  {workshopTestimonialPlaceholders[activeWorkshopTestimonial].name}
                </p>
                <p className="workshops-testimonial-role">
                  {workshopTestimonialPlaceholders[activeWorkshopTestimonial].role}
                </p>

                <div className="workshops-dots" aria-label="testimonial slide indicators">
                  {workshopTestimonialPlaceholders.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveWorkshopTestimonial(index)}
                      className={`workshops-dot ${index === activeWorkshopTestimonial ? "is-active" : ""}`}
                      aria-label={`Show testimonial placeholder ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/our-services/workshops')}
                  className="workshops-learn-more-btn btn-primary-purple-small"
                  style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                >
                  Learn more
                </button>
              </div>

              <button
                type="button"
                onClick={() => router.push('/our-services/workshops')}
                className="workshops-playful-btn"
                style={{ fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
              >
                What are Talentix Workshops? ✨
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEN positioning band */}
      <section style={{ padding: '48px 24px', background: '#1a1a2e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', background: '#1a1a2e', border: '4px solid #4ECDC4', boxShadow: '8px 8px 0 #FFD23F', borderRadius: '20px', padding: '28px 26px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: '#4ECDC4', color: '#1a1a2e', fontWeight: 800, padding: '4px 14px', borderRadius: '999px', fontFamily: 'Fredoka, sans-serif', fontSize: '0.95rem' }}>
            SEN-adapted workshops
          </span>
          <h2 style={{ margin: '12px 0 8px', color: '#ffffff', fontSize: '1.6rem', fontWeight: 900, fontFamily: 'Fredoka, sans-serif' }}>
            Built to be inclusive
          </h2>
          <p style={{ margin: '0 auto', maxWidth: '640px', color: '#cbd5e1', lineHeight: 1.6, fontFamily: 'Fredoka, sans-serif' }}>
            All our sessions are delivered by DBS-checked, SEN-trained facilitators. We adapt pace and language for SEN and SEND learners and deliver in both mainstream and specialist settings.
          </p>
        </div>
      </section>

      {/* Worked With Section */}
      <section
        className="pt-28 pb-28 md:pt-32 md:pb-32 relative overflow-hidden"
        style={{ background: '#FFD700' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 left-8 text-6xl animate-bounce">🏢</div>
          <div className="absolute top-12 right-12 text-5xl animate-pulse">🤝</div>
          <div className="absolute bottom-10 left-1/4 text-4xl animate-spin" style={{ animationDuration: '8s' }}>✨</div>
          <div className="absolute bottom-8 right-1/4 text-5xl animate-bounce">🚀</div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2
              className="font-black text-gray-900 mb-3"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontFamily: "'Fredoka', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                textShadow: '2px 2px 0 rgba(255,255,255,0.35)',
              }}
            >
              Worked With
            </h2>
            <p className="text-gray-800 text-lg md:text-xl font-medium" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Trusted by leading organisations and schools
            </p>
          </div>

          <div
            className="mx-auto rounded-[28px] p-5 md:p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.22)',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div className="worked-with-logos md:grid md:grid-cols-4 md:gap-8">
              {workedWithLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="group worked-with-logo-card p-2 md:p-[20px_18px] min-h-[78px] md:min-h-[130px]"
                  style={{
                    background: 'rgba(255,255,255,0.94)',
                    borderRadius: '20px',
                    border: '2px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 28px rgba(0,0,0,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.12)';
                  }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={200}
                    height={90}
                    className="mx-auto object-contain worked-with-logo-image w-full h-[34px] md:h-[78px] max-w-[78px] md:max-w-[190px]"
                    style={{
                      transform: `scale(${logo.mobileScale})`,
                      transformOrigin: 'center'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureShowcaseCarousel />

      <HomepageFeaturesCarousel />

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

      {/* SCHOOL TESTIMONIAL SECTION */}
      <div style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #FEF7CD 0%, #FDE047 30%, #FACC15 70%, #F59E0B 100%)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#1a1a2e', marginBottom: '12px', fontFamily: 'Fredoka, sans-serif' }}>
              What schools say about us 🌟
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#374151', fontFamily: 'Fredoka, sans-serif' }}>
              Real feedback from a school we have worked with.
            </p>
          </div>
          <div style={{ background: '#1a1a2e', border: '4px solid #FFD23F', boxShadow: '10px 10px 0 #FF6B9D', borderRadius: '24px', padding: '40px 36px', maxWidth: '720px', margin: '0 auto 56px' }}>
            <blockquote style={{ margin: 0, fontSize: '1.35rem', lineHeight: 1.6, color: '#ffffff', fontFamily: 'Fredoka, sans-serif', fontWeight: 500 }}>
              "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students. I haven't seen them more engaged."
            </blockquote>
            <p style={{ margin: '24px 0 0', fontWeight: 800, color: '#FFD23F', fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem' }}>
              Emma Seffens
            </p>
            <p style={{ margin: '2px 0 0', color: '#cbd5e1', fontFamily: 'Fredoka, sans-serif', fontSize: '0.98rem' }}>
              Careers Officer, Endeavour Academy Bexley
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #FDE047 0%, #F97316 100%)', borderRadius: '24px', padding: '40px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#111827', marginBottom: '12px', fontFamily: 'Fredoka, sans-serif' }}>
                Ready to get started? 🚀
              </h3>
              <p style={{ color: '#374151', marginBottom: '24px', fontFamily: 'Fredoka, sans-serif', fontSize: '1.1rem' }}>
                Join Talentix and take your next step today.
              </p>
              <button onClick={() => setShowSignUpModal(true)} style={{ background: '#111827', color: 'white', fontWeight: 'bold', padding: '16px 32px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontFamily: 'Fredoka, sans-serif', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)' }}>
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
            © 2026 Talentix - Made with 💖 for job seekers everywhere!
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
              <h2 className="modal-title" style={{ fontSize: '34px', fontWeight: 'bold', marginBottom: '14px', fontFamily: "'Fredoka', sans-serif" }}>
                What we do 🎉
              </h2>
              <p className="modal-description" style={{ fontSize: '17px', marginBottom: '24px', lineHeight: 1.6, color: '#374151' }}>
                <strong>Talentix</strong> is a youth-led employment organisation. We help teenagers take their next step through in-school workshops, free online events, and a platform built for teens.
              </p>
              <div style={{ display: 'grid', gap: '14px', marginBottom: '26px', textAlign: 'left' }}>
                <div style={{ background: '#f9fafb', borderLeft: '6px solid #FFD23F', borderRadius: '12px', padding: '16px 18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1a1a2e', fontFamily: "'Fredoka', sans-serif" }}>🏫 Workshops</h3>
                  <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#374151' }}>
                    In-school employability workshops for Years 10 to 13. Two flagship formats: Teens and Jobs covers CVs, mock interviews, and job search. Future Ready Teens builds confidence, communication, goal-setting, and personal branding. We also build bespoke sessions around your cohort. Every facilitator is DBS-checked and SEN-trained, and sessions are adapted for SEN and SEND learners in mainstream and specialist settings. 94% of students recommend us to other schools.
                  </p>
                </div>
                <div style={{ background: '#f9fafb', borderLeft: '6px solid #4ECDC4', borderRadius: '12px', padding: '16px 18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1a1a2e', fontFamily: "'Fredoka', sans-serif" }}>🎤 Events</h3>
                  <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#374151' }}>
                    Free online career events open to teens across the UK. Past events include our Ultimate CV Workshop and an Assessment Centre and Interview Masterclass with RISE. Our Mock Interview Series puts students in front of real professionals by sector.
                  </p>
                </div>
                <div style={{ background: '#f9fafb', borderLeft: '6px solid #4A90E2', borderRadius: '12px', padding: '16px 18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1a1a2e', fontFamily: "'Fredoka', sans-serif" }}>💻 Platform</h3>
                  <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, color: '#374151' }}>
                    talentix.co.uk gives teens job search, a CV reviewer, interview prep, and AI career guidance. Built for teens, by teens.
                  </p>
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

        @keyframes heroCircleFloat {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-16px) translateX(-6px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes heroBlobMorph {
          0%, 100% {
            border-radius: 39% 61% 52% 48% / 45% 42% 58% 55%;
          }
          50% {
            border-radius: 58% 42% 38% 62% / 53% 64% 36% 47%;
          }
        }

        .hero-workshop-circle-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          max-width: 640px;
          margin-left: auto;
        }

        .hero-workshop-circle {
          position: relative;
          width: 520px;
          height: 520px;
          border-radius: 39% 61% 52% 48% / 45% 42% 58% 55%;
          border: 4px solid rgba(255, 255, 255, 0.6);
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6), rgba(251, 191, 36, 0.3));
          box-shadow: 0 20px 50px rgba(17, 24, 39, 0.22);
          animation: heroCircleFloat 5s ease-in-out infinite, heroBlobMorph 8s ease-in-out infinite;
          overflow: hidden;
          transform: translateX(40px);
        }

        .hero-word-black {
          color: #0f172a;
          -webkit-text-fill-color: #0f172a;
        }

        .hero-word-gold {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 55%, #eab308 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-split-break {
          display: none;
        }

        .workshops-section {
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 45%, #f8fafc 100%);
        }

        .workshops-layout {
          margin-top: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          align-items: center;
          min-height: clamp(300px, 34vw, 390px);
        }

        .workshops-image-shell {
          position: relative;
          display: flex;
          justify-content: flex-start;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .workshops-mobile-top-logo {
          display: none;
        }

        .workshops-right {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          padding-top: 0.65rem;
        }

        .workshops-testimonial-logo {
          position: absolute;
          top: -2.6rem;
          left: 0;
          margin: 0;
          width: clamp(290px, 42vw, 520px);
          height: auto;
          z-index: 0;
        }

        .workshops-main-image {
          width: 100%;
          height: 100%;
          display: block;
          border: none;
        }

        .workshops-image-fade {
          position: absolute;
          top: 0;
          right: 0;
          width: 34%;
          height: 100%;
          background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff 85%);
          pointer-events: none;
        }

        .workshops-mobile-image-dots {
          display: none;
        }

        .workshops-mobile-image-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .workshops-mobile-image-dot.is-active {
          width: 20px;
          background: #8b5cf6;
        }

        .workshops-testimonial-card {
          margin-top: 0;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ede9fe;
          border-radius: 20px;
          padding: 1.05rem 1.05rem 0.95rem;
          box-shadow: 0 12px 26px rgba(124, 58, 237, 0.12);
          animation: workshopFadeIn 0.35s ease-in-out;
          position: relative;
          z-index: 1;
        }

        .workshops-testimonial-label {
          margin: 0 0 0.6rem;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          font-weight: 700;
        }

        .workshops-testimonial-quote {
          margin: 0;
          font-size: 1rem;
          line-height: 1.55;
          color: #1f2937;
          font-weight: 600;
        }

        .workshops-testimonial-person {
          margin: 1rem 0 0.15rem;
          color: #111827;
          font-weight: 700;
        }

        .workshops-testimonial-role {
          margin: 0;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .workshops-dots {
          margin-top: 0.9rem;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .workshops-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .workshops-dot.is-active {
          width: 22px;
          background: #8b5cf6;
        }

        .workshops-learn-more-btn {
          margin-top: 0.9rem;
          align-self: flex-start;
        }

        .workshops-playful-btn {
          display: block;
          margin-top: 0.6rem;
          align-self: flex-start;
          border: none;
          border-radius: 999px;
          padding: 0.7rem 1.05rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #8b5cf6 0%, #f59e0b 100%);
          box-shadow: 0 8px 18px rgba(139, 92, 246, 0.28);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .workshops-playful-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(139, 92, 246, 0.32);
        }

        .worked-with-logos {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 10px !important;
        }

        .worked-with-logo-card {
          width: calc((100% - 20px) / 3) !important;
          min-width: 0 !important;
          padding: 8px !important;
          min-height: 78px !important;
        }

        .worked-with-logo-image {
          width: 100% !important;
          max-width: 78px !important;
          height: 34px !important;
          object-fit: contain !important;
          transform-origin: center;
        }

        @keyframes workshopFadeIn {
          0% {
            opacity: 0.35;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 768px) {
          .worked-with-logos {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 2rem !important;
          }

          .worked-with-logo-card {
            width: auto !important;
            padding: 20px 18px !important;
            min-height: 130px !important;
          }

          .worked-with-logo-image {
            max-width: 190px !important;
            height: 78px !important;
            transform: scale(1) !important;
          }
        }

        @media (min-width: 1024px) {
          .workshops-layout {
            grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
            gap: 1.2rem;
          }

          .workshops-testimonial-logo {
            top: 5.25rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-main-heading {
            transform: scale(2);
            transform-origin: left top;
            display: inline-block;
            margin-bottom: 7rem;
          }

          .hero-what-we-do-btn {
            font-size: 1.25rem;
            padding: 0.9rem 1.8rem;
            border-radius: 0.8rem;
          }

          .hero-workshop-circle-wrap {
            margin-top: -5.25rem;
          }

          .hero-workshop-circle {
            transform: translateX(40px) translateY(-90px);
          }

          /* Desktop logo container positioning - centered slightly left */
          .hero-logo-container {
            padding-left: 6rem !important;
            padding-right: 3rem !important;
            margin-right: 2rem;
          }
          
          /* Desktop text container positioning */
          .hero-text-container {
            padding-left: 6rem !important;
            padding-right: 2rem !important;
          }
          
          @media (min-width: 1280px) {
            .hero-main-heading {
              margin-bottom: 8.5rem;
            }

            .hero-what-we-do-btn {
              font-size: 1.35rem;
              padding: 1rem 2rem;
            }

            .hero-workshop-circle-wrap {
              margin-top: -6rem;
            }

            .hero-workshop-circle {
              transform: translateX(40px) translateY(-90px);
            }

            .hero-logo-container {
              padding-left: 8rem !important;
            }
            
            .hero-text-container {
              padding-left: 8rem !important;
            }
          }
        }

        @media (max-width: 768px) {
          .hero-split-break {
            display: block;
          }

          .hero-word-gold {
            -webkit-text-stroke: 0;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.25);
          }

          .hero-word-black {
            font-size: 1.22em;
            line-height: 0.9;
          }

          .hero-layout-wrap {
            gap: 2rem;
          }

          .hero-left-content {
            order: 2;
            align-items: center;
            gap: 0.9rem;
          }

          .hero-text-container {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-logo-mobile-hidden {
            display: none;
          }

          .hero-main-heading {
            font-size: clamp(3rem, 10.8vw, 4.15rem) !important;
            line-height: 0.84 !important;
            letter-spacing: -0.03em !important;
            text-shadow: 0 6px 18px rgba(17, 24, 39, 0.1);
            margin-bottom: 0.5rem;
            text-align: center;
          }

          .hero-what-we-do-wrap {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .hero-workshop-circle-wrap {
            order: 1;
            width: 100%;
            max-width: none;
            justify-content: center;
            margin: 0 auto 1.4rem;
          }

          .workshops-layout {
            gap: 0.95rem;
            min-height: auto;
          }

          .workshops-right {
            padding-top: 0.35rem;
          }

          .workshops-playful-btn {
            order: 1;
            align-self: center;
            margin: 0 0 0.75rem;
          }

          .workshops-testimonial-logo {
            display: none;
          }

          .workshops-mobile-top-logo {
            display: block;
            width: clamp(200px, 66vw, 330px);
            height: auto;
            margin: 0 auto 0.6rem;
          }

          .workshops-image-shell {
            height: 240px;
          }

          .workshops-image-fade {
            width: 38%;
          }

          .workshops-mobile-image-dots {
            display: flex;
            justify-content: center;
            gap: 0.45rem;
            margin-top: 0.55rem;
          }

          .workshops-testimonial-card {
            order: 2;
            padding: 0.9rem;
          }

          .workshops-testimonial-quote {
            font-size: 0.96rem;
          }

          .hero-workshop-circle {
            width: 340px;
            height: 340px;
            transform: none;
          }
        }
        
        /* Mobile-specific modal fixes */
        @media (max-width: 768px) {
          .hero-workshop-circle {
            width: 340px;
            height: 340px;
            transform: none;
          }

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

          .hero-workshop-circle {
            width: 240px;
            height: 240px;
            transform: none;
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





