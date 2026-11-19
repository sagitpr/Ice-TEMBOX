import type { MetadataRoute } from 'next';
import { generateProgrammaticUrls } from './lib/seo-data';

export const POPULAR_SOLUTIONS = [
  'kapal-nelayan-tradisional',
  'cold-storage-perikanan',
  'transportasi-rantai-dingin',
  'koperasi-pelelangan-ikan',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';
  const now = new Date();

  // Solution Category Pages
  const solutionPages: MetadataRoute.Sitemap = POPULAR_SOLUTIONS.map((slug) => ({
    url: `${baseUrl}/solusi/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // High-value programmatic SEO search pages for "ikan", "box", etc.
  const searchPages: MetadataRoute.Sitemap = generateProgrammaticUrls().slice(0, 30).map((item) => ({
    url: `${baseUrl}/pencarian/${item.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: item.priority,
  }));

  // Core Static Navigation Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/market`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/solusi`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...solutionPages,
    ...searchPages,
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return staticPages;
}
