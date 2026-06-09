import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talentix – Jobs for Teenagers UK | Teen Employment & Youth Careers',
  description: 'Find jobs for teenagers in the UK with Talentix. Free CV reviewer, interview practice, job search, and career guidance for 16-18 year olds. Start your career today.',
  keywords: [
    'jobs for teenagers UK',
    'teen employment UK',
    'work experience for teens',
    'youth careers UK',
    'first job for teenagers',
    'teen job search UK',
    'jobs for 16 year olds UK',
    'jobs for 17 year olds UK',
    'student jobs UK',
    'entry level jobs UK',
    'apprenticeships for teens',
    'CV for teenagers',
    'interview prep for teens',
    'career guidance UK',
    'youth employment platform',
  ],
  alternates: {
    canonical: '/home',
  },
  openGraph: {
    title: 'Talentix – Jobs for Teenagers UK',
    description: 'The UK\'s career platform for teenagers. Free CV reviewer, interview practice, job search, apprenticeship tracker, and more. Get your first job with Talentix.',
    url: 'https://talentix.co.uk/home',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix - Jobs for Teenagers in the UK' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix – Jobs for Teenagers UK',
    description: 'Free CV reviewer, interview practice, job search and career guidance for UK teenagers. Get your first job with Talentix.',
    images: ['/og-image.jpg'],
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
