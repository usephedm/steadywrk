'use client';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { BLOG_CATEGORIES, getPublicBlogPosts } from '@/lib/data';
import type { BlogCategory } from '@/lib/data';
import { Calendar, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const getPublishedPosts = getPublicBlogPosts;

export default function PublicBlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return getPublishedPosts().filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featured = getPublishedPosts().find((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured || activeCategory !== 'All');

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-dvh bg-[#FAFAF8] pt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl font-extrabold text-[#23211D] tracking-tight">
              Blog
            </h1>
            <p className="text-[#6B6B66] mt-3 text-base max-w-xl mx-auto">
              Insights on AI careers, the Jordan tech ecosystem, and building the future of work.
            </p>
          </div>

          {/* Search + Category filters */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="relative max-w-md mx-auto w-full">
              <label htmlFor="blog-search" className="sr-only">
                Search articles
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
              <input
                id="blog-search"
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg border border-[#E5E5E2] bg-white text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border min-h-[36px] ${
                    activeCategory === cat
                      ? 'bg-[#E58A0F] border-[#E58A0F] text-white'
                      : 'bg-white border-[#E5E5E2] text-[#6B6B66] hover:border-[#E58A0F]/30 hover:text-[#E58A0F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured post */}
          {featured && activeCategory === 'All' && !searchQuery && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-8"
            >
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#E58A0F] bg-[#FFF4E6] px-2 py-0.5 rounded-full mb-3">
                Featured
              </span>
              <h2 className="font-[var(--font-display)] text-2xl font-bold text-[#23211D] group-hover:text-[#E58A0F] transition-colors mb-2">
                {featured.title}
              </h2>
              <p className="text-[#6B6B66] text-sm leading-relaxed mb-4">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-[#B0B0AB]">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {featured.readTime}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#F5F5F3] text-[#6B6B66] text-[10px] font-medium">
                  {featured.category}
                </span>
              </div>
            </Link>
          )}

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeCategory === 'All' && !searchQuery ? regular : filtered).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
              >
                <span className="inline-block px-2 py-0.5 rounded-full bg-[#F5F5F3] text-[#6B6B66] text-[10px] font-medium mb-3">
                  {post.category}
                </span>
                <h3 className="font-[var(--font-display)] text-base font-bold text-[#23211D] group-hover:text-[#E58A0F] transition-colors mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#6B6B66] text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#B0B0AB]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#B0B0AB] text-sm">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Article Schema for each blog post */}
      {getPublishedPosts().map((post) => (
        <script
          key={`schema-${post.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                '@type': 'Organization',
                name: 'STEADYWRK',
                url: 'https://steadywrk.app',
              },
              publisher: {
                '@type': 'Organization',
                name: 'STEADYWRK',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://steadywrk.app/logo.webp',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://steadywrk.app/blog/${post.slug}`,
              },
            }),
          }}
        />
      ))}
    </>
  );
}
