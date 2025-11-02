import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | Talentix',
  description: 'Talentix privacy policy. Learn how we protect and use your personal data as a UK teenager or student using our career tools and job search platform.',
  keywords: [
    'Talentix privacy policy',
    'data protection UK',
    'teen privacy policy',
    'student data privacy',
    'GDPR compliance',
    'privacy policy UK'
  ],
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Talentix',
    description: 'Learn how Talentix protects your personal data and privacy as a UK teenager using our career tools.',
    url: 'https://talentix.co.uk/privacy',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Privacy Policy' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Talentix',
    description: 'How Talentix protects your data and privacy.',
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

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

