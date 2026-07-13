import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talentix Points - Earn Rewards for Career Progress',
  description: 'Earn Talentix Points by completing career tasks, CV reviews, interview practice, and more. Track your progress and unlock achievements as you prepare for your first job in the UK.',
  keywords: [
    'Talentix Points',
    'career rewards',
    'student achievements',
    'job search rewards',
    'career gamification',
    'teen career points',
    'student progress tracking',
    'career milestones UK'
  ],
  alternates: {
    canonical: '/talentix-points',
  },
  openGraph: {
    title: 'Talentix Points - Career Rewards System | Talentix',
    description: 'Earn points and unlock achievements as you use Talentix career tools. Track your progress toward getting your first job in the UK.',
    url: 'https://talentix.co.uk/talentix-points',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Points - Career rewards for UK students' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix Points - Career Rewards | Talentix',
    description: 'Earn points and achievements as you prepare for your first job with Talentix career tools.',
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

export default function TalentixPointsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

