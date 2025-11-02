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
    default: 'Talentix – First Jobs for Teenagers in the UK',
    template: '%s | Talentix',
  },
  description: 'Free career tools for UK teenagers and students aged 16-18. CV reviewer, interview practice, job search, apprenticeship tracker, and more. Get your first job with Talentix - for teenagers by teenagers.',
  keywords: [
    'teen jobs UK',
    'first job UK',
    'jobs for 16 year olds UK',
    'jobs for 17 year olds',
    'CV reviewer UK',
    'CV builder for students',
    'interview practice online',
    'interview prep UK',
    'video interview practice',
    'job tracker UK',
    'apprenticeship tracker UK',
    'cover letter maker UK',
    'career guidance UK',
    'teen employment UK',
    'student jobs UK',
    'first job for teenagers',
    'teen job search',
    'youth employment UK',
    'career tools for students',
    'job application help UK',
    'free CV review',
    'interview practice free',
    'teen career advice',
    'student career guidance',
    'apprenticeships for 16 year olds',
    'entry level jobs UK'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://talentix.co.uk/',
    title: 'Talentix – First Jobs for Teenagers in the UK',
    description: 'Free career tools for UK teenagers aged 16-18. CV reviewer, interview practice, job search, apprenticeship tracker, and career guidance. Get your first job with Talentix.',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix - First Jobs for Teenagers in the UK' }],
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix – First Jobs for Teenagers in the UK',
    description: 'Free career tools for UK teenagers. CV reviewer, interview practice, job search, apprenticeship tracker. For teenagers by teenagers.',
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
                url: 'https://talentix.co.uk/tixlogo.png',
                width: 500,
                height: 225
              },
              image: 'https://talentix.co.uk/og-image.jpg',
              description: 'Free career tools and resources for UK teenagers and students aged 16-18. CV reviewer, interview practice, job search, apprenticeship tracker, and career guidance. For teenagers by teenagers.',
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
