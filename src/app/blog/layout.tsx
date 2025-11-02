import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Blog - Job Search Tips & Advice for UK Teenagers | Talentix',
  description: 'Career advice, job search tips, and guidance for UK teenagers and students. Learn how to write CVs, prepare for interviews, and get your first job.',
  keywords: [
    'career blog UK',
    'teen job advice',
    'student career tips',
    'job search blog',
    'career advice for teens',
    'teen employment blog',
    'first job blog UK',
    'student job tips',
    'career guidance blog',
    'teen career resources'
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Career Blog for UK Teenagers | Talentix',
    description: 'Career advice and job search tips for UK teenagers. Learn how to get your first job with our helpful blog posts.',
    url: 'https://talentix.co.uk/blog',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Career Blog - Advice for UK teenagers' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Blog for UK Teenagers | Talentix',
    description: 'Career advice and job search tips for UK teenagers preparing for their first job.',
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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

