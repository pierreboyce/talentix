import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apprenticeship Tracker UK - Find Apprenticeships',
  description: 'Track and find apprenticeship opportunities in the UK. Free apprenticeship tracker for students and teenagers. Search apprenticeships by location, level, and industry.',
  keywords: [
    'apprenticeship tracker UK',
    'apprenticeships for 16 year olds',
    'UK apprenticeships',
    'apprenticeship search',
    'apprentice jobs UK',
    'level 2 apprenticeships',
    'level 3 apprenticeships',
    'teen apprenticeships',
    'student apprenticeships UK',
    'apprenticeship opportunities',
    'find apprenticeship UK',
    'apprenticeship vacancies',
    'apprenticeship program UK'
  ],
  alternates: {
    canonical: '/apprenticeship-tracker',
  },
  openGraph: {
    title: 'Apprenticeship Tracker UK | Talentix',
    description: 'Find and track apprenticeship opportunities across the UK. Search apprenticeships by location, level, and industry. Perfect for UK students aged 16+.',
    url: 'https://talentix.co.uk/apprenticeship-tracker',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Apprenticeship Tracker - Find UK apprenticeships' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apprenticeship Tracker UK | Talentix',
    description: 'Find and track apprenticeship opportunities for UK students. Search by location, level, and industry to find your perfect apprenticeship.',
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

