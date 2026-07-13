import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free CV Reviewer for UK Teenagers – AI-Powered Feedback',
  description: 'Get instant AI-powered CV feedback and reviews for your first job application. Free CV reviewer tool for UK students and teenagers. Improve your CV with personalized suggestions for better job opportunities.',
  keywords: [
    'CV reviewer UK',
    'CV builder for students',
    'free CV review',
    'CV checker UK',
    'teen CV builder',
    'student CV reviewer',
    'first job CV',
    'CV feedback UK',
    'CV improvement',
    'CV analysis UK',
    'resume reviewer',
    'CV builder 16 year old',
    'job application CV'
  ],
  alternates: {
    canonical: '/cv-reviewer',
  },
  openGraph: {
    title: 'FREE CV Reviewer | Talentix',
    description: 'AI-powered CV reviewer and builder specifically designed for UK students and teenagers applying for their first job. Get instant feedback and improve your CV.',
    url: 'https://talentix.co.uk/cv-reviewer',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix CV Reviewer - Free CV feedback for UK students' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREE CV Reviewer | Talentix',
    description: 'AI-powered CV reviewer and builder for UK teenagers and students. Get instant feedback on your CV for your first job application.',
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

export default function CVReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

