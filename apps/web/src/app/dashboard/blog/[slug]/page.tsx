import { BLOG_POSTS } from '@/lib/data';
import { ArrowLeft, Calendar } from 'lucide-react';
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
  if (!post) return { title: 'Post Not Found | SteadyWrk' };

  return {
    title: `${post.title} | SteadyWrk Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split('\n\n');

  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/dashboard/blog"
        className="inline-flex items-center gap-2 text-white/30 hover:text-amber-500/60 transition-colors text-xs font-mono tracking-wider uppercase mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-white/30 text-sm font-mono">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{post.date}</time>
        </div>
        <div
          className="w-20 h-px mt-6"
          style={{
            background: 'linear-gradient(90deg, rgba(245,158,11,0.5), transparent)',
          }}
        />
      </header>

      {/* Content */}
      <div className="space-y-5">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-white/50 text-base leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/[0.06]">
        <Link
          href="/dashboard/blog"
          className="inline-flex items-center gap-2 text-amber-500/70 text-sm font-mono tracking-wider uppercase hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All posts
        </Link>
      </footer>

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
              name: 'SteadyWrk',
            },
            publisher: {
              '@type': 'Organization',
              name: 'SteadyWrk',
              url: 'https://steadywrk.app',
            },
          }),
        }}
      />
    </article>
  );
}
