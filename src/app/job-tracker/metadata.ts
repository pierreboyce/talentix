import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Application Tracker for Students UK',
  description: 'Track all your job applications in one place. Free job tracker tool for UK students and teenagers. Organize applications, follow-ups, and interviews for your first job search.',
  keywords: [
    'job tracker UK',
    'application tracker',
    'job application tracker',
    'track job applications',
    'student job tracker',
    'teen job applications',
    'first job tracker',
    'job search tracker',
    'application management UK',
    'interview tracker',
    'job hunt tracker',
    'application organizer',
    'job tracker tool'
  ],
  alternates: {
    canonical: '/job-tracker',
  },
  openGraph: {
    title: 'Job Application Tracker for UK Students | Talentix',
    description: 'Organize and track all your job applications in one place. Free job tracker designed for UK teenagers managing their first job search.',
    url: 'https://talentix.co.uk/job-tracker',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Job Tracker - Track your job applications' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Tracker for UK Students | Talentix',
    description: 'Free job application tracker to help UK teenagers organize and manage their job search. Track applications, interviews, and follow-ups.',
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

