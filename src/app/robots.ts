import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://metathesi.gr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/matches/',
        '/profile/',
        '/settings/',
        '/api/',
        '/admin/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
