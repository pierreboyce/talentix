import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Guidance & Advice for UK Students | Talentix',
  description: 'Get free career guidance and advice for UK teenagers and students. Career planning tools, interview tips, CV advice, and job search help for your first job.',
  keywords: [
    'career guidance UK',
    'career advice for teens',
    'student career guidance',
    'teenager career advice',
    'first job advice UK',
    'career planning UK',
    'youth career guidance',
    'student career help',
    'teen career resources',
    'career support UK',
    'job search advice UK',
    'career development UK',
    'teen employment advice'
  ],
  alternates: {
    canonical: '/career-guidance',
  },
  openGraph: {
    title: 'Career Guidance for UK Students & Teens | Talentix',
    description: 'Free career guidance and advice for UK teenagers. Get help with CV writing, interview prep, job searching, and career planning for your first job.',
    url: 'https://talentix.co.uk/career-guidance',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Career Guidance - Free advice for UK students' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Guidance for UK Students | Talentix',
    description: 'Free career advice and guidance for UK teenagers. Get support with CV writing, interviews, and job searching.',
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

