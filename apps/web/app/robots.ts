import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ice-tembox.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/katalog',
          '/solusi',
          '/solusi/*',
          '/market',
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
