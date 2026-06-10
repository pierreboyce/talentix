import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employability Workshops for Schools, SEN & Sixth Forms | Talentix',
  description: 'Join Talentix employability workshops to build your CV, ace interviews, and develop the workplace skills you need to land your first job. Open to all young people across the UK.',
  keywords: [
    'employability workshops for young people',
    'employability workshops UK',
    'employability skills workshops teenagers',
    'youth employability workshops',
    'careers workshops for students',
    'job skills workshops for teens',
    'workplace readiness workshops UK',
    'employability training young people UK',
    'school employability workshops',
    'interview skills workshops teenagers',
    'CV writing workshops young people',
    'work experience workshops UK',
    'employability programmes for young people',
    'careers skills workshops UK',
    'employability skills',
    'workplace readiness',
    'job-ready teenagers',
    'school leavers UK',
  ],
  alternates: { canonical: '/our-services/workshops' },
  openGraph: {
    title: 'Employability Workshops for Schools, SEN & Sixth Forms | Talentix',
    description: 'Join Talentix employability workshops to build your CV, ace interviews, and develop the workplace skills you need to land your first job. Open to all young people across the UK.',
    url: 'https://talentix.co.uk/our-services/workshops',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix employability workshops for young people in the UK' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employability Workshops for Schools, SEN & Sixth Forms | Talentix',
    description: 'CV writing, interview prep, and workplace readiness workshops for teenagers and school leavers across the UK.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
