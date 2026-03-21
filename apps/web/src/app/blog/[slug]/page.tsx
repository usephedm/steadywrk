import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { BLOG_POSTS } from '@/lib/data';
import { ArrowLeft, Calendar, Clock, Link2, Share2 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found | STEADYWRK' };

  return {
    title: `${post.title} | STEADYWRK Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://steadywrk.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PublicBlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split('\n\n');
  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-dvh bg-[#FAFAF8] pt-16">
        <article className="max-w-3xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#6B6B66] hover:text-[#E58A0F] transition-colors text-sm mb-8 min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <span className="inline-block px-2.5 py-1 rounded-full bg-[#FFF4E6] text-[#E58A0F] text-xs font-medium mb-4">
              {post.category}
            </span>
            <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl font-extrabold text-[#23211D] tracking-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6B66]">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{post.date}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
            <div
              className="w-20 h-px mt-6"
              style={{
                background: 'linear-gradient(90deg, #E58A0F, transparent)',
              }}
            />
          </header>

          {/* Content */}
          <div className="space-y-5 mb-12">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-[#23211D] text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-12 p-4 rounded-lg bg-[#F5F5F3]">
            <span className="text-sm text-[#6B6B66]">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://steadywrk.app/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#6B6B66] hover:text-[#E58A0F] hover:bg-white transition-all"
              aria-label="Share on X"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://steadywrk.app/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#6B6B66] hover:text-[#E58A0F] hover:bg-white transition-all"
              aria-label="Share on LinkedIn"
            >
              <Link2 className="h-4 w-4" />
            </a>
          </div>

          {/* CTA */}
          <div className="rounded-xl border border-[#E58A0F]/20 bg-[#FFF4E6] p-8 text-center mb-12">
            <h3 className="font-[var(--font-display)] text-xl font-bold text-[#23211D] mb-2">
              Ready to build something real?
            </h3>
            <p className="text-[#6B6B66] text-sm mb-4">
              Join STEADYWRK and start shipping from day one.
            </p>
            <Link
              href="/apply/operations-dispatcher"
              className="inline-flex items-center gap-2 bg-[#E58A0F] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-[180ms] hover:bg-[#CC7408] min-h-[44px]"
            >
              Apply Now
            </Link>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="font-[var(--font-display)] text-lg font-bold text-[#23211D] mb-4">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group rounded-xl border border-[rgba(0,0,0,0.06)] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-[180ms] ease-out hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  >
                    <h4 className="text-sm font-bold text-[#23211D] group-hover:text-[#E58A0F] transition-colors line-clamp-2 mb-1">
                      {related.title}
                    </h4>
                    <span className="text-xs text-[#B0B0AB]">{related.date}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to blog */}
          <div className="mt-10 pt-8 border-t border-[#E5E5E2]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#E58A0F] text-sm font-medium hover:underline min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
          </div>
        </article>
      </main>
      <Footer />

      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'STEADYWRK',
            },
            publisher: {
              '@type': 'Organization',
              name: 'STEADYWRK',
              url: 'https://steadywrk.app',
            },
          }),
        }}
      />
    </>
  );
}
