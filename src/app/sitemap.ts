import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/posts';
import { SERVICES } from '@/lib/data/services';
import { SITE } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const statik: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`,         lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE.url}/about`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE.url}/team`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${SITE.url}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE.url}/contact`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.8 },
    { url: `${SITE.url}/privacy`,  lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE.url}/terms`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  const services: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE.url}/services/${s.slug}`,
    lastModified: now, changeFrequency: 'monthly', priority: 0.8,
  }));

  // Posts carry their real modification date, which is what tells a crawler
  // an article is worth revisiting.
  const posts = await getPublishedPosts();
  const articles: MetadataRoute.Sitemap = posts
    .filter((p) => !p.seo.noIndex)
    .map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...statik, ...services, ...articles];
}
