import { BLOG_POSTS, PROGRAMS, ROLES } from '@/lib/data';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://steadywrk.app';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/culture`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const rolePages: MetadataRoute.Sitemap = ROLES.map((role) => ({
    url: `${baseUrl}/careers/${role.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const programPages: MetadataRoute.Sitemap = PROGRAMS.map((program) => ({
    url: `${baseUrl}/programs/${program.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const applyPages: MetadataRoute.Sitemap = ROLES.map((role) => ({
    url: `${baseUrl}/apply/${role.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS
    .filter((post) => post.content !== 'Coming soon.')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  return [...staticPages, ...rolePages, ...programPages, ...applyPages, ...blogPages];
}
