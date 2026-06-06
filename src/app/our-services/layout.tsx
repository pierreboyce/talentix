import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services - Career Workshops & Assemblies for Schools UK | Talentix',
  description: 'SEN and SEND-inclusive career and employability workshops for UK schools. Youth-led, DBS-checked facilitators. Help students prepare for their first job.',
  keywords: [
    'SEN employability workshops schools UK',
    'SEND careers workshops secondary school',
    'youth employability workshops SEN',
    'career workshops UK',
    'school career assemblies',
    'youth career workshops',
    'student career sessions',
    'career guidance for schools',
    'teen career workshops UK',
    'school career talks',
    'youth employment workshops',
    'career prep for students',
    'school career services UK'
  ],
  alternates: {
    canonical: '/our-services',
  },
  openGraph: {
    title: 'Our Services - Career Workshops for UK Schools | Talentix',
    description: 'Career workshops and assemblies for UK schools and youth organisations. Interactive sessions to help students prepare for their first job.',
    url: 'https://talentix.co.uk/our-services',
    siteName: 'Talentix',
    images: [{ 
      url: '/og-image.jpg', 
      width: 1200, 
      height: 630, 
      alt: 'Talentix Services - Career workshops for UK schools' 
    }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Workshops for UK Schools | Talentix',
    description: 'Interactive career workshops and assemblies for UK schools. Help students prepare for their first job.',
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

export default function OurServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

