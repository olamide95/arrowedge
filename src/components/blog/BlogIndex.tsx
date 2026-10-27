'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import PostCard from './PostCard';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Search and category filtering run in the browser over a list the server
 * already rendered. That keeps every post in the initial HTML — so the page
 * is fully indexable — while the filtering itself stays instant.
 */
export default function BlogIndex({
  posts, categories,
}: { posts: Post[]; categories: { name: string; count: number }[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inCategory = category === 'All' || p.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [posts, query, category]);

  const tabs = [{ name: 'All', count: posts.length }, ...categories];

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
          {tabs.map((c) => (
            <button
              key={c.name}
              type="button"
              role="tab"
              aria-selected={category === c.name}
              onClick={() => setCategory(c.name)}
              className={cn(
                'rounded-full px-4 py-2 text-[0.85rem] transition-all duration-300',
                category === c.name
                  ? 'bg-ink text-white shadow-lift'
                  : 'border border-ink-200 bg-white text-ink-500 hover:border-gold-300 hover:text-gold-700',
              )}
            >
              {c.name}
              <span className={cn('ml-1.5 text-[0.72rem]', category === c.name ? 'text-gold-400' : 'text-ink-300')}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" strokeWidth={1.8} aria-hidden />
          <label htmlFor="blog-search" className="sr-only">Search insights</label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search insights…"
            className="field pl-11 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-100 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-[0.84rem] text-ink-400" aria-live="polite">
        {results.length} {results.length === 1 ? 'article' : 'articles'}
        {category !== 'All' && <> in <span className="text-gold-700">{category}</span></>}
        {query && <> matching “{query}”</>}
      </p>

      {results.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => <PostCard key={p.id} post={p} delay={Math.min(i, 6) * 70} />)}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-ink-200 py-20 text-center">
          <p className="font-display text-xl text-ink">Nothing matches that yet.</p>
          <p className="mx-auto mt-3 max-w-sm text-[0.92rem] text-ink-500">
            Try a broader term, or clear the filters to see everything we have published.
          </p>
          <button
            type="button"
            onClick={() => { setQuery(''); setCategory('All'); }}
            className="btn btn-outline btn-md mt-7"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
