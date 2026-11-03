import type { MetadataRoute } from 'next';
import { generateProgrammaticUrls } from './lib/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';
  const now = new Date();

  // Core static navigation pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
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

  // Programmatic Category & Keyword Pages (Targetting hundreds/thousands of indexed combinations)
  const programmaticItems = generateProgrammaticUrls();
  const categoryPages: MetadataRoute.Sitemap = programmaticItems.map((item) => ({
    url: `${baseUrl}/kategori/${item.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: item.priority,
  }));

  return [...staticPages, ...categoryPages];
}

