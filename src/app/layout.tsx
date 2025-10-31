import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
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
    default: 'Talentix – Get your first job',
    template: '%s | Talentix',
  },
  description: 'For teenagers by teenagers. Interview prep, video interviews, job tracker, apprenticeship tracker, CV reviewer, cover letter maker and more to help you get your first job.',
  keywords: ['Talentix', 'teen jobs', 'first job', 'CV reviewer', 'cover letter maker', 'interview prep', 'video interviews', 'apprenticeship tracker', 'job tracker', 'career guidance', 'free templates'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://talentix.co.uk/',
    title: 'Talentix – Get your first job',
    description: 'Tools and guidance to help you land your first job.',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix – Get your first job',
    description: 'For teenagers by teenagers. Interview prep, job search tools and more.',
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
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Talentix',
              url: 'https://talentix.co.uk',
              logo: 'https://talentix.co.uk/tixlogo.png',
              sameAs: [
                'https://www.instagram.com/',
                'https://www.linkedin.com/'
              ],
              description: 'For teenagers by teenagers. Tools to help you get your first job.'
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
