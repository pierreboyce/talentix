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

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talentix",
  description: "Helping you get your first job. For teenagers by teenagers...",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      </head>
      <body className={`${inter.className} ${fredoka.className}`}>
        <ErrorBoundary>
          <ToastProvider>
            <SessionWrapper>
              <SubscriptionProvider>
                <PointsProvider>
                  <QuestProvider>
                    <ChatbotProvider>
                      {/* Desktop Navigation - shown only on desktop */}
                      <div className="desktop-nav">
                        <Navigation />
                      </div>
                      {/* Mobile Navigation - shown only on mobile */}
                      <div className="mobile-nav">
                        <NavigationMobile />
                      </div>
                    <div className="min-h-screen bg-white text-black">
                    {children}
                    </div>
                    <PointsNotification />
                    <ChatbotClientWrapper />
                    <GlobalModalManager />
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
