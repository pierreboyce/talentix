import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cover Letter Maker for Students UK | Free Cover Letter Builder',
  description: 'Create professional cover letters for your job applications. Free AI-powered cover letter maker designed for UK students and teenagers applying for their first job.',
  keywords: [
    'cover letter maker UK',
    'cover letter builder',
    'free cover letter',
    'cover letter generator',
    'student cover letter',
    'teen cover letter',
    'first job cover letter',
    'cover letter template UK',
    'cover letter writer',
    'application letter UK',
    'job application cover letter',
    'cover letter help UK',
    'professional cover letter'
  ],
  alternates: {
    canonical: '/cover-letter',
  },
  openGraph: {
    title: 'Cover Letter Maker for UK Students | Talentix',
    description: 'Free AI-powered cover letter builder for UK students. Create professional cover letters tailored to your job applications in minutes.',
    url: 'https://talentix.co.uk/cover-letter',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Cover Letter Maker - Create professional cover letters' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cover Letter Maker UK | Talentix',
    description: 'Free AI-powered cover letter builder for UK students and teenagers. Create professional cover letters for your job applications.',
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

