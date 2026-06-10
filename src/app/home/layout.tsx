import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talentix | Jobs & Employability Support for Teenagers in the UK',
  description: 'Talentix helps teenagers across the UK find their first job, develop employability skills, and build their careers. Browse jobs, workshops, and expert careers guidance.',
  keywords: [
    'first jobs for teenagers UK',
    'jobs for teens UK',
    'teen jobs UK',
    'part-time jobs for 16 year olds UK',
    'jobs for school leavers UK',
    'work for teenagers UK',
    'how to get your first job UK',
    'first job advice teenagers',
    'jobs for 16 year olds UK',
    'jobs for 17 year olds UK',
    'youth employment UK',
    'teen employment UK',
    'CV reviewer UK',
    'interview practice online',
    'career guidance UK',
    'employability skills for young people',
    'apprenticeships for teens UK',
    'school leaver career advice',
    'entry level jobs UK',
    'student jobs UK',
  ],
  alternates: {
    canonical: '/home',
  },
  openGraph: {
    title: 'Talentix — Where UK Teenagers Start Their Career Journey',
    description: 'Talentix helps teenagers across the UK find their first job, develop employability skills, and build their careers. Browse jobs, workshops, and expert careers guidance.',
    url: 'https://talentix.co.uk/home',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix - Jobs & Employability Support for Teenagers in the UK' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talentix — Where UK Teenagers Start Their Career Journey',
    description: 'Talentix helps UK teenagers find their first job, develop employability skills, and access careers guidance. For teenagers by teenagers.',
    images: ['/og-image.jpg'],
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
