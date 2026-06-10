import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";

// Mark root layout as dynamic to prevent prerendering errors on client pages
export const dynamic = 'force-dynamic';
import Navigation from "../components/Navigation";
import NavigationMobile from "../components/NavigationMobile";
import ChatbotClientWrapper from "../components/ChatbotClientWrapper";
import SessionWrapper from "../components/SessionWrapper";
import { PointsProvider } from "../contexts/PointsContext";
import { QuestProvider } from "../contexts/QuestContext";
import { ChatbotProvider } from "../contexts/ChatbotContext";
import { SubscriptionProvider } from "../contexts/SubscriptionContext";
import PointsNotification from "../components/PointsNotification";
import GlobalModalManager from "../components/GlobalModalManager";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastProvider } from "../components/Toast";
import MobileRedirect from "../components/MobileRedirect";
import NavigationWrapper from "../components/NavigationWrapper";
import CommunityModal from "../components/CommunityModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AddToHomePrompt from "../components/AddToHomePrompt";
import GoogleAnalytics from "../components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://talentix.co.uk'),
  title: {
    default: 'Talentix | Jobs & Employability Support for Teenagers in the UK',
    template: '%s | Talentix',
  },
  description: 'Talentix helps teenagers across the UK find their first job, develop employability skills, and build their careers. Browse jobs, workshops, and expert careers guidance.',
  keywords: [
    'first jobs for teenagers UK',
    'jobs for teens UK',
    'teen jobs UK',
    'part-time jobs for 16 year olds UK',
    'jobs for school leavers UK',
    'work for teenagers UK',
    'how to get your first job UK',
    'first job advice teenagers',
    'employability workshops for young people',
    'employability workshops UK',
    'careers advice for teenagers UK',
    'how to write a CV as a teenager',
    'interview tips for first job',
    'how to apply for a job at 16',
    'jobs for 16 year olds UK',
    'school leaver career advice',
    'employability skills for young people',
    'youth employment UK',
    'teen employment UK',
    'CV reviewer UK',
    'interview practice online',
    'apprenticeship tracker UK',
    'career guidance UK',
    'career tools for students',
    'entry level jobs UK',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://talentix.co.uk/',
    title: 'Talentix — Where UK Teenagers Start Their Career Journey',
    description: 'Talentix helps teenagers across the UK find their first job, develop employability skills, and build their careers. Browse jobs, workshops, and expert careers guidance.',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix - Jobs & Employability Support for Teenagers in the UK' }],
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix — Where UK Teenagers Start Their Career Journey',
    description: 'Talentix helps UK teenagers find their first job, develop employability skills, and access careers guidance. For teenagers by teenagers.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#fde047" />
        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              '@id': 'https://talentix.co.uk/#organization',
              name: 'Talentix',
              url: 'https://talentix.co.uk',
              logo: {
                '@type': 'ImageObject',
                url: 'https://talentix.co.uk/tixlogoupdated.png',
                width: 500,
                height: 225
              },
              image: 'https://talentix.co.uk/og-image.jpg',
              description: 'Talentix helps teenagers across the UK find their first job, develop employability skills, and build their careers. Browse jobs, workshops, and expert careers guidance.',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'GB'
              },
              areaServed: {
                '@type': 'Country',
                name: 'United Kingdom'
              },
              audience: {
                '@type': 'Audience',
                audienceType: 'Teenagers and Students (16-18 years old)',
                geographicArea: {
                  '@type': 'Country',
                  name: 'United Kingdom'
                }
              },
              sameAs: [
                'https://www.instagram.com/',
                'https://www.linkedin.com/'
              ],
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://talentix.co.uk/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        {/* JSON-LD Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://talentix.co.uk/#website',
              url: 'https://talentix.co.uk',
              name: 'Talentix',
              description: 'Free career tools for UK teenagers and students. Get your first job with CV reviewer, interview practice, job search, and more.',
              publisher: {
                '@id': 'https://talentix.co.uk/#organization'
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://talentix.co.uk/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              inLanguage: 'en-GB'
            })
          }}
        />
      </head>
      <body className={`${inter.className} ${fredoka.className}`}>
        <ErrorBoundary>
          <ToastProvider>
            <SessionWrapper>
              <SubscriptionProvider>
                <PointsProvider>
                  <QuestProvider>
                    <ChatbotProvider>
                      <MobileRedirect />
                      <NavigationWrapper />
                    <div className="text-black" style={{ minHeight: '100dvh', backgroundColor: 'inherit' }}>
                      {children}
                    </div>
                    <PointsNotification />
                    <ChatbotClientWrapper />
                    <GlobalModalManager />
                    <CommunityModal />
                    <AddToHomePrompt />
                    <GoogleAnalytics />
                    <Analytics />
                    <SpeedInsights />
                    </ChatbotProvider>
                  </QuestProvider>
                </PointsProvider>
              </SubscriptionProvider>
            </SessionWrapper>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
