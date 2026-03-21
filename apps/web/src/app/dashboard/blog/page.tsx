'use client';

import { BLOG_CATEGORIES, BLOG_POSTS } from '@/lib/data';
import type { BlogCategory } from '@/lib/data';
import { Calendar, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function DashboardBlogPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featured = BLOG_POSTS.find((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured || activeCategory !== 'All');

  return (
    <div className="min-h-dvh bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight">
            Blog
          </h1>
          <p className="text-[#6B6B66] mt-2 text-sm">
            Thoughts on AI careers, the Jordan tech ecosystem, and building STEADYWRK.
          </p>
        </div>

        {/* Search + Category filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0AB]" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-lg border border-[#E5E5E2] bg-white text-sm text-[#23211D] placeholder:text-[#B0B0AB] focus:outline-none focus:border-[#E58A0F] focus:ring-2 focus:ring-[#E58A0F]/10 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
            href={`/dashboard/blog/${featured.slug}`}
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
              href={`/dashboard/blog/${post.slug}`}
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
    </div>
  );
}
