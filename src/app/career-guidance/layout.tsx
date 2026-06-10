import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers Advice for Teenagers | Talentix',
  description: 'Free careers advice for teenagers across the UK. CV writing tips, interview preparation, job application help, and first job guidance. Start your career journey with Talentix.',
  keywords: [
    'careers advice for teenagers UK',
    'how to write a CV as a teenager',
    'interview tips for first job',
    'how to get work experience as a teenager',
    'first job tips for teens',
    'employability skills for young people',
    'how to apply for a job at 16',
    'jobs for 16 year olds UK',
    'school leaver career advice',
    'career guidance UK',
    'CV advice for teenagers',
    'interview prep UK',
    'youth career guidance',
    'first job advice UK',
    'job search advice UK',
  ],
  alternates: {
    canonical: '/career-guidance',
  },
  openGraph: {
    title: 'Careers Advice for Teenagers | Talentix',
    description: 'Free careers advice for teenagers across the UK. CV tips, interview preparation, and first job guidance — all in one place.',
    url: 'https://talentix.co.uk/career-guidance',
    siteName: 'Talentix',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Talentix careers advice for teenagers in the UK'
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers Advice for Teenagers | Talentix',
    description: 'Free CV tips, interview prep, and first job guidance for UK teenagers. Start your career journey on Talentix.',
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

export default function CareerGuidanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

