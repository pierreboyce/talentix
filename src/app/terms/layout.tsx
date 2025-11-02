import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - User Agreement | Talentix',
  description: 'Read Talentix terms of service and user agreement. Understand the rules and guidelines for using our career tools and job search platform as a UK teenager or student.',
  keywords: [
    'Talentix terms of service',
    'user agreement',
    'terms and conditions',
    'Talentix terms',
    'platform rules UK'
  ],
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Talentix',
    description: 'Read Talentix terms of service and user agreement for UK teenagers using our career tools.',
    url: 'https://talentix.co.uk/terms',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Terms of Service' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Talentix',
    description: 'Talentix terms of service and user agreement.',
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

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

