import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://talentix.co.uk'
  const now = new Date()
  
  // High priority pages (main features for UK teen job seekers)
  const highPriorityPages = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/cv-reviewer', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/interview-prep', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/video-interview', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/search', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/job-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/apprenticeship-tracker', priority: 0.8, changeFrequency: 'weekly' as const },
  ]
  
  // Medium priority pages
  const mediumPriorityPages = [
    { path: '/cover-letter', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/career-guidance', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/our-story', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/our-services', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/events', priority: 0.6, changeFrequency: 'weekly' as const },
  ]
  
  // Lower priority but still important
  const lowPriorityPages = [
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  ]
  
  const allPages = [...highPriorityPages, ...mediumPriorityPages, ...lowPriorityPages]
  
  return allPages.map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}


