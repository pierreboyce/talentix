import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Teen Job Search UK - Find Your First Job',
  description: 'Search for jobs for 16, 17, and 18 year olds in the UK. Find part-time jobs, apprenticeships, and first job opportunities near you. Job search tool designed for UK teenagers.',
  keywords: [
    'teen jobs UK',
    'jobs for 16 year olds UK',
    'jobs for 17 year olds',
    'first job UK',
    'teenager jobs',
    'student jobs UK',
    'part time jobs for teens',
    'jobs near me teenager',
    'UK teen employment',
    'youth jobs UK',
    'entry level jobs UK',
    'teen job search',
    'jobs for students UK',
    'apprentice jobs UK'
  ],
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Teen Jobs UK - Find Your First Job | Talentix',
    description: 'Search thousands of job opportunities for UK teenagers aged 16-18. Find part-time jobs, apprenticeships, and entry-level positions near you.',
    url: 'https://talentix.co.uk/search',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Job Search - Find jobs for UK teenagers' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teen Jobs UK - Job Search for Students | Talentix',
    description: 'Find your first job in the UK. Search thousands of opportunities for teenagers aged 16-18 including part-time jobs and apprenticeships.',
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

