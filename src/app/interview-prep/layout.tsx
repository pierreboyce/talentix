import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Practice Tool | Talentix',
  description: 'Practice interview questions tailored to your dream job. Free interview prep tool for UK teenagers preparing for their first job interview. Build confidence with AI-powered interview practice.',
  keywords: [
    'interview prep UK',
    'interview practice online',
    'first job interview questions',
    'teen interview prep',
    'student interview practice',
    'interview questions UK',
    'job interview prep',
    'interview practice free',
    '16 year old interview',
    'interview skills UK',
    'interview preparation',
    'teenager interview practice',
    'job interview questions UK'
  ],
  alternates: {
    canonical: '/interview-prep',
  },
  openGraph: {
    title: 'Interview Practice Tool | Talentix',
    description: 'Free interview preparation tool with tailored questions for UK teenagers applying for their first job. Practice interview questions and build confidence.',
    url: 'https://talentix.co.uk/interview-prep',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Interview Prep - Practice interviews for your first job' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interview Practice Tool | Talentix',
    description: 'Free interview prep with tailored questions for UK teenagers. Practice for your first job interview with AI-powered interview questions.',
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

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

