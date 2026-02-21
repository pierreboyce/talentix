import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Youth-Led Employability Workshops for Schools - Talentix Workshops',
};

export default function WorkshopsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
