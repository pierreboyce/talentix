import type { MetadataRoute } from 'next'
import { blogPosts } from './blog/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://talentix.co.uk'
  const now = new Date()

  const highPriorityPages = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/cv-reviewer', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/interview-prep', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/video-interview', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/search', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/job-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/apprenticeship-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
  ]

  const mediumPriorityPages = [
    { path: '/cover-letter', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/career-guidance', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/workshops', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/events', priority: 0.6, changeFrequency: 'weekly' as const },
  ]

  const lowPriorityPages = [
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const staticPages = [...highPriorityPages, ...mediumPriorityPages, ...lowPriorityPages].map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const blogPostPages = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [...staticPages, ...blogPostPages]
}


