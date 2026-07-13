import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Interview Practice',
  description: 'Practice video interviews with AI feedback for your first job application. Free video interview simulator for UK students and teenagers. Record and review your interview performance.',
  keywords: [
    'video interview practice',
    'online interview practice UK',
    'virtual interview prep',
    'video interview simulator',
    'interview recording practice',
    'teen video interview',
    'first job video interview',
    'interview practice online UK',
    'video interview feedback',
    'record interview practice',
    'video interview prep UK',
    'student video interview',
    'interview recording tool UK'
  ],
  alternates: {
    canonical: '/video-interview',
  },
  openGraph: {
    title: 'Video Interview Practice | Talentix',
    description: 'Practice video interviews with instant AI feedback. Record yourself answering interview questions and get personalized feedback to improve your interview skills.',
    url: 'https://talentix.co.uk/video-interview',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Video Interview Practice - Practice interviews with AI feedback' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Video Interview Practice | Talentix',
    description: 'Record and practice video interviews with AI feedback. Perfect for UK students preparing for their first job video interview.',
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
};

export default function VideoInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

