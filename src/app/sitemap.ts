import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://metathesi.gr';

  // Οι βασικές δημόσιες σελίδες της πλατφόρμας
  const routes = [
    '',
    '/stats',
    '/faq',
    '/contact',
    '/terms',
    '/privacy',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
