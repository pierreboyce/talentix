import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Vacancies for UK Teenagers - Find Your First Job | Talentix',
  description: 'Browse job vacancies and opportunities for UK teenagers and students. Find part-time jobs, apprenticeships, and entry-level positions perfect for 16-18 year olds.',
  keywords: [
    'job vacancies UK',
    'teen job vacancies',
    'student jobs UK',
    'part time jobs UK',
    'entry level jobs',
    'teenager vacancies',
    'youth jobs UK',
    'apprenticeship vacancies',
    'first job vacancies',
    'student employment UK'
  ],
  alternates: {
    canonical: '/vacancies',
  },
  openGraph: {
    title: 'Job Vacancies for UK Teenagers | Talentix',
    description: 'Find job vacancies and opportunities for UK teenagers. Browse part-time jobs, apprenticeships, and entry-level positions.',
    url: 'https://talentix.co.uk/vacancies',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Job Vacancies - Find jobs for UK teenagers' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Vacancies for UK Teenagers | Talentix',
    description: 'Browse job vacancies and opportunities for UK teenagers and students.',
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

export default function VacanciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

