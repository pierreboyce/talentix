import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://talentix.co.uk'
  const now = new Date()
  const paths = [
    '/',
    '/our-story',
    '/our-services',
    '/privacy',
    '/terms',
    '/contact',
    '/cv-reviewer',
    '/cover-letter',
    '/job-tracker',
    '/apprenticeship-tracker',
    '/interview-prep',
    '/video-interview',
    '/search',
  ]
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '/' ? 1 : 0.7,
  }))
}


