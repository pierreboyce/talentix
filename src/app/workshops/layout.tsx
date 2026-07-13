import type { Metadata } from 'next';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Employability Workshops for UK Secondary Schools',
  alternateName: ['SEN school workshops', 'employability school workshops', 'SEN employability workshops'],
  description:
    'Talentix delivers employability workshops for secondary students in Years 10–13 across UK schools. Sessions cover CV writing, interview skills, and workplace readiness — inclusive, youth-led, and DBS-checked, fully adapted for SEN and SEND cohorts. Suitable for mainstream schools, SEN settings, and sixth forms across the UK.',
  serviceType: 'Employability workshop for schools',
  provider: {
    '@type': 'Organization',
    name: 'Talentix',
    url: 'https://talentix.co.uk',
    logo: {
      '@type': 'ImageObject',
      url: 'https://talentix.co.uk/tixlogoupdated.png',
    },
  },
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Schools, SEN settings, SEND cohorts, sixth forms, secondary students',
  },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://talentix.co.uk/workshops',
    serviceLocation: {
      '@type': 'Place',
      name: 'In-school, United Kingdom',
    },
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Workshop programmes',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Future Ready Teens — employability school workshop',
          description: 'Personal branding, mock interviews, SMART goal-setting, and communication skills for secondary students.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Teens & Jobs — SEN employability school workshop',
          description: 'CV writing, cover letters, interview practice, and workplace professionalism. Adapted for SEN and SEND cohorts.',
        },
      },
    ],
  },
  review: {
    '@type': 'Review',
    reviewBody:
      "I would definitely recommend Talentix to other schools, you're really inclusive, you really tailored it to our students. I haven't seen them more engaged.",
    author: {
      '@type': 'Person',
      name: 'Emma Seffens',
      jobTitle: 'Careers Officer, Endeavour Academy Bexley',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
  },
};

export const metadata: Metadata = {
  title: 'Employability Workshops for UK Secondary Schools',
  description:
    'Youth-led employability workshops for Years 10-13 in UK secondary schools. Interactive CVs, interviews, and confidence-building sessions — fully adapted for SEN and SEND cohorts. Book a workshop today.',
  keywords: [
    'employability workshops UK',
    'employability workshops for secondary schools',
    'school employability workshops',
    'careers workshops for students',
    'youth employability workshops',
    'employability workshops for young people',
    'secondary school careers workshops',
    'sixth form employability workshops',
    'interview skills workshops teenagers',
    'CV writing workshops young people',
    'employability training young people UK',
    'workplace readiness workshops UK',
    'employability programmes for young people',
    'careers skills workshops UK',
    'SEN employability school workshops',
    'SEN school workshops',
    'SEND employability workshops',
    'SEN workshops for schools UK',
    'SEN careers workshops',
    'SEND school workshops',
  ],
  alternates: { canonical: '/workshops' },
  openGraph: {
    title: 'Employability Workshops for UK Secondary Schools | Talentix',
    description:
      'Youth-led employability workshops for Years 10-13 in UK secondary schools. CV writing, interview prep, and workplace readiness — inclusive sessions adapted for SEN and SEND cohorts.',
    url: 'https://talentix.co.uk/workshops',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix employability workshops for UK secondary schools' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employability Workshops for UK Secondary Schools | Talentix',
    description:
      'Youth-led employability workshops for UK secondary students. CV writing, interview skills, workplace readiness — SEN and SEND adaptable.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
