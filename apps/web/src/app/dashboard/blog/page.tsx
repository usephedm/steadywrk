'use client';

import { AnimatedTitle } from '@/components/ui/animated-title';
import { TiltCard } from '@/components/ui/tilt-card';
import { BLOG_POSTS } from '@/lib/data';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function BlogPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <AnimatedTitle
          text="Blog"
          className="text-4xl sm:text-5xl font-bold tracking-tighter text-white"
        />
        <motion.p
          className="text-white/40 text-sm tracking-[0.2em] uppercase font-mono mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Thoughts & updates
        </motion.p>
        <motion.div
          className="w-20 h-px mt-6"
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.5), transparent)',
          }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {BLOG_POSTS.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease }}
          >
            <TiltCard
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden hover:border-amber-500/15 transition-colors"
              tiltAmount={2}
            >
              <button
                type="button"
                onClick={() => setExpanded(expanded === post.slug ? null : post.slug)}
                className="w-full text-left p-6 flex items-start justify-between gap-4"
                data-interactive
              >
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-white group-hover:text-amber-500/90 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-1.5 text-white/30 text-xs font-mono">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <p className="text-white/35 text-sm leading-relaxed">{post.excerpt}</p>
                </div>
                <motion.div
                  animate={{ rotate: expanded === post.slug ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5 text-white/30 shrink-0 mt-1" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expanded === post.slug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="border-t border-white/[0.06] pt-4">
                        {post.content.split('\n\n').map((paragraph, pi) => (
                          <motion.p
                            key={pi}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: pi * 0.08 }}
                            className="text-white/45 text-sm leading-relaxed mb-3 last:mb-0"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                        <Link
                          href={`/dashboard/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-amber-500/70 text-xs font-mono tracking-wider uppercase hover:text-amber-500 transition-colors mt-4"
                          data-interactive
                        >
                          Read full article
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
          </motion.article>
        ))}
      </div>

      {/* Article Schema for each blog post — rich results */}
      {BLOG_POSTS.map((post) => (
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
                name: 'SteadyWrk',
                url: 'https://steadywrk.app',
              },
              publisher: {
                '@type': 'Organization',
                name: 'SteadyWrk',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://steadywrk.app/logo.webp',
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://steadywrk.app/dashboard/blog/${post.slug}`,
              },
            }),
          }}
        />
      ))}
    </div>
  );
}
