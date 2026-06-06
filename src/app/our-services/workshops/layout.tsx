import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEN Employability Workshops for Schools UK',
  description: 'In-school SEN and SEND employability workshops for UK secondary schools. Youth-led, DBS-checked facilitators. Get a quote for your cohort.',
  keywords: [
    'SEN employability workshops schools UK',
    'SEND careers workshops secondary school',
    'youth employability workshops SEN',
    'in-school careers workshops London',
    'employability workshops Year 10 Year 11',
    'youth-led careers workshops UK',
  ],
  alternates: { canonical: '/our-services/workshops' },
  openGraph: {
    title: 'SEN Employability Workshops for Schools UK | Talentix',
    description: 'Youth-led, SEN-adapted employability workshops for UK secondary schools. DBS-checked facilitators. Get a quote.',
    url: 'https://talentix.co.uk/our-services/workshops',
    siteName: 'Talentix',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Talentix SEN employability workshops for UK schools' }],
    locale: 'en_GB',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function WorkshopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
