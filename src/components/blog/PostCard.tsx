import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { Post } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PostCard({
  post, delay = 0, featured = false,
}: { post: Post; delay?: number; featured?: boolean }) {
  return (
    <article
      data-reveal data-reveal-delay={delay}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift transition-all duration-500 hover:-translate-y-1 hover:border-gold-200 hover:shadow-liftLg"
    >
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            sizes={featured ? '(max-width: 1024px) 92vw, 60vw' : '(max-width: 768px) 92vw, 32vw'}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // No cover? A branded arc panel rather than a grey box.
          <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-800 to-ink">
            <svg viewBox="0 0 120 120" className="h-24 w-24 opacity-40" fill="none" aria-hidden>
              <g stroke="#A88A28" strokeLinecap="round" fill="none">
                <ellipse cx="60" cy="62" rx="44" ry="50" strokeWidth="8" transform="rotate(-24 60 62)" />
                <ellipse cx="60" cy="62" rx="24" ry="29" strokeWidth="5" transform="rotate(-24 60 62)" opacity=".7" />
              </g>
            </svg>
          </span>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[0.7rem] font-medium tracking-wide text-ink backdrop-blur">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-[0.73rem] text-ink-400">
          <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={1.8} aria-hidden />
            {post.readingMinutes} min read
          </span>
        </div>

        <h3 className={featured ? 'mt-3 text-[1.7rem] leading-snug' : 'mt-3 text-[1.2rem] leading-snug'}>
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gold-700">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-500 line-clamp-3">
          {post.excerpt}
        </p>

        <p className="mt-5 border-t border-ink-100 pt-4 text-[0.78rem] text-ink-400">
          {post.author.name}
          <span className="text-ink-300"> · {post.author.role}</span>
        </p>
      </div>
    </article>
  );
}
