import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { blogPosts } from '../data';
import BlogQuiz from './BlogQuiz';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const desc = post.seoDescription;
  return {
    title: `${post.title} | Careers Advice for Teenagers | Talentix`,
    description: desc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: desc,
      url: `https://talentix.co.uk/blog/${post.slug}`,
      siteName: 'Talentix',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: post.title }],
      locale: 'en_GB',
      type: 'article',
      publishedTime: post.isoDate,
      modifiedTime: post.isoDate,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: desc,
      images: ['/og-image.jpg'],
    },
  };
}

const pillColorMap: Record<string, { bg: string; text: string; border: string }> = {
  purple: { bg: '#ede9fe', text: '#6d28d9', border: '#ddd6fe' },
  pink:   { bg: '#fce7f3', text: '#be185d', border: '#fbcfe8' },
  yellow: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  blue:   { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  green:  { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const pill = pillColorMap[post.categoryColor] ?? pillColorMap.purple;
  const postUrl = `https://talentix.co.uk/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    author: { '@type': 'Organization', name: 'Talentix' },
    publisher: {
      '@type': 'Organization',
      name: 'Talentix',
      '@id': 'https://talentix.co.uk/#organization',
      logo: {
        '@type': 'ImageObject',
        url: 'https://talentix.co.uk/tixlogoupdated.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .post-bg {
          background:
            radial-gradient(circle at 8% 15%, rgba(251,191,36,0.18), transparent 36%),
            radial-gradient(circle at 92% 18%, rgba(236,72,153,0.12), transparent 30%),
            linear-gradient(150deg, #fffbeb 0%, #ffffff 46%, #f5f3ff 100%);
        }
        .post-shell {
          background: rgba(255,255,255,0.97);
          border: 1px solid #ede9fe;
          border-radius: 24px;
          box-shadow: 0 12px 40px rgba(124,58,237,0.11);
        }
        .post-body p {
          font-size: 1.05rem;
          line-height: 1.78;
          color: #1f2937;
          margin-bottom: 1.45rem;
          font-family: var(--font-fredoka), 'Fredoka', 'Inter', sans-serif;
        }
        .post-body p:last-child {
          margin-bottom: 0;
        }
        .post-divider {
          border: none;
          border-top: 1px solid #ede9fe;
          margin: 2rem 0;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #7c3aed;
          text-decoration: none;
          transition: color 0.18s ease, gap 0.18s ease;
          font-family: var(--font-fredoka), 'Fredoka', 'Inter', sans-serif;
          margin-bottom: 2rem;
          display: inline-flex;
        }
        .back-link:hover { color: #5b21b6; gap: 0.5rem; }
        .post-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 13px 28px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 0.95rem;
          color: #111827;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          font-family: var(--font-fredoka), 'Fredoka', 'Inter', sans-serif;
          background: linear-gradient(135deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%);
          box-shadow: 0 4px 15px rgba(245,158,11,0.35);
        }
        .post-cta-btn:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 22px rgba(245,158,11,0.42);
        }
      `}} />

      <main className="post-bg min-h-screen py-12 px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl mx-auto">

          <Link href="/blog" className="back-link">
            ← Back to Blog
          </Link>

          <article className="post-shell px-6 py-8 sm:px-8 md:px-12 md:py-10">

            {/* Category pill */}
            <div className="mb-5">
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.34rem 0.9rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: pill.bg,
                  color: pill.text,
                  border: `1px solid ${pill.border}`,
                  letterSpacing: '0.01em',
                  fontFamily: "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif",
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif", letterSpacing: '-0.01em' }}
            >
              {post.title}
            </h1>

            {/* Meta row */}
            <div
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-6 pb-6"
              style={{ borderBottom: '1px solid #ede9fe', fontFamily: "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif" }}
            >
              <span>📅 <time dateTime={post.date}>{post.date}</time></span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>⏱ {post.readTime} read</span>
              <span aria-hidden="true" className="text-gray-300">·</span>
              <span>✍️ {post.author}</span>
            </div>

            {/* Body */}
            <div className="post-body">
              {post.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

          </article>

          {/* Quiz */}
          <BlogQuiz questions={post.quiz} />

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <p
              className="text-sm text-gray-500 mb-4"
              style={{ fontFamily: "var(--font-fredoka), 'Fredoka', 'Inter', sans-serif" }}
            >
              More articles on jobs, CVs, and careers for UK teenagers
            </p>
            <Link href="/blog" className="post-cta-btn">
              ← More articles
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
