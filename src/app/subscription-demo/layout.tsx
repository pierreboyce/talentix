// Route segment config to prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SubscriptionDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

