import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story - Meet the Talentix Team | Talentix',
  description: 'Meet the incredible team behind Talentix - passionate teenagers dedicated to helping UK students get their first job. Learn about our journey and mission.',
  keywords: [
    'Talentix team',
    'Talentix story',
    'teen career platform',
    'UK student jobs team',
    'teenagers helping teenagers',
    'Talentix founders',
    'youth employment UK',
    'career platform UK'
  ],
  alternates: {
    canonical: '/our-story',
  },
  openGraph: {
    title: 'Our Story - Meet the Talentix Team | Talentix',
    description: 'Meet the team behind Talentix. Passionate teenagers helping UK students get their first job with free career tools and resources.',
    url: 'https://talentix.co.uk/our-story',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Team - For teenagers by teenagers' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Story - Meet the Talentix Team | Talentix',
    description: 'Meet the passionate team behind Talentix, helping UK teenagers get their first job.',
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

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

