import type { Metadata } from 'next';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'SEN & Employability School Workshops',
  alternateName: ['SEN school workshops', 'employability school workshops', 'SEN employability workshops'],
  description:
    'Talentix delivers SEN and employability school workshops for secondary students in Years 10–13. Sessions cover CV writing, interview skills, and workplace readiness — inclusive, youth-led, and DBS-checked. Suitable for mainstream schools, SEN settings, and sixth forms across the UK.',
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
    serviceUrl: 'https://talentix.co.uk/our-services/workshops',
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
  title: 'SEN & Employability School Workshops | Talentix',
  description:
    'Talentix delivers SEN and employability school workshops for Years 10–13. Youth-led, DBS-checked sessions covering CV writing, interview skills, and workplace readiness — for mainstream schools, SEN settings, and sixth forms across the UK.',
  keywords: [
    'SEN employability school workshops',
    'SEN school workshops',
    'employability school workshops',
    'SEN workshops for schools UK',
    'SEND employability workshops',
    'SEN careers workshops',
    'employability workshops for young people',
    'employability workshops UK',
    'school employability workshops',
    'SEN careers education',
    'SEND school workshops',
    'youth employability workshops',
    'careers workshops for students',
    'interview skills workshops teenagers',
    'CV writing workshops young people',
    'employability training young people UK',
    'workplace readiness workshops UK',
    'employability programmes for young people',
    'careers skills workshops UK',
    'sixth form employability workshops',
    'secondary school careers workshops',
  ],
  alternates: { canonical: '/our-services/workshops' },
  openGraph: {
    title: 'SEN & Employability School Workshops | Talentix',
    description:
      'Youth-led SEN and employability school workshops for Years 10–13. CV writing, interview prep, and workplace readiness — inclusive sessions for mainstream schools, SEN settings, and sixth forms.',
    url: 'https://talentix.co.uk/our-services/workshops',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix SEN and employability school workshops in the UK' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEN & Employability School Workshops | Talentix',
    description:
      'Youth-led, DBS-checked SEN and employability school workshops for secondary students. CV writing, interview skills, workplace readiness — across the UK.',
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
