import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/market',
          '/solusi',
          '/solusi/*',
          '/pencarian',
          '/pencarian/*',
          '/about',
          '/contact',
          '/login',
          '/register',
        ],
        disallow: ['/api/', '/dashboard', '/dashboard/*', '/checkout', '/checkout/*', '/transaksi'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
