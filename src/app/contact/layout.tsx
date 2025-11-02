import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get Help with Your First Job UK | Talentix',
  description: 'Contact Talentix for help with job searching, CV writing, interview prep, or career guidance. Get support for UK teenagers and students looking for their first job.',
  keywords: [
    'contact Talentix',
    'career help UK',
    'teen job support',
    'student career help',
    'Talentix contact',
    'career guidance contact',
    'job search help UK',
    'teen employment support'
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Talentix - Get Career Help | Talentix',
    description: 'Contact Talentix for career guidance and job search help. We support UK teenagers and students in finding their first job.',
    url: 'https://talentix.co.uk/contact',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Contact Talentix - Career help for UK teenagers' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Talentix | Talentix',
    description: 'Get in touch with Talentix for career guidance and job search support.',
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

