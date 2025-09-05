import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import ChatbotClientWrapper from "../components/ChatbotClientWrapper";
import SessionWrapper from "../components/SessionWrapper";
import { PointsProvider } from "../contexts/PointsContext";
import { QuestProvider } from "../contexts/QuestContext";
import { ChatbotProvider } from "../contexts/ChatbotContext";
import PointsNotification from "../components/PointsNotification";

const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talentix - Get Your First Job, The Smart Way",
  description: "Talentix helps teenagers land their first job with AI-powered CV reviews, real job listings, expert advice, and more.",
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
      </head>
      <body className={`${inter.className} ${fredoka.className}`}>
        <SessionWrapper>
          <PointsProvider>
            <QuestProvider>
              <ChatbotProvider>
                <Navigation />
                <div className="min-h-screen bg-white text-black">
                {children}
                </div>
                <PointsNotification />
                <ChatbotClientWrapper />
              </ChatbotProvider>
            </QuestProvider>
          </PointsProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
