'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { PenSquare, Search, Loader2, FileText } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { formatDate, cn } from '@/lib/utils';

export default function PostsListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, 'posts'), orderBy('updatedAt', 'desc')));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts.filter((p) => {
      const statusOk =
        filter === 'all' ||
        (filter === 'published' ? p.status === 'published' : p.status !== 'published');
      if (!statusOk) return false;
      if (!needle) return true;
      return (
        (p.title ?? '').toLowerCase().includes(needle) ||
        (p.category ?? '').toLowerCase().includes(needle)
      );
    });
  }, [posts, q, filter]);

  const counts = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status !== 'published').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f} type="button" onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-4 py-2 text-[0.84rem] capitalize transition-colors',
                filter === f ? 'bg-ink text-white' : 'border border-ink-200 bg-white text-ink-500 hover:border-gold-300',
              )}
            >
              {f} <span className="ml-1 text-[0.74rem] opacity-70">{counts[f]}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
            <label htmlFor="q" className="sr-only">Search articles</label>
            <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field pl-11" />
          </div>
          <Link href="/admin/posts/new" className="btn btn-gold btn-md shrink-0">
            <PenSquare className="h-4 w-4" aria-hidden /> New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-500" aria-hidden /></div>
      ) : visible.length === 0 ? (
        <div className="card grid place-items-center py-24 text-center">
          <FileText className="h-10 w-10 text-ink-300" strokeWidth={1.3} aria-hidden />
          <p className="mt-4 font-display text-xl text-ink">
            {posts.length === 0 ? 'No articles yet' : 'Nothing matches that'}
          </p>
          <p className="mt-2 max-w-sm text-[0.9rem] text-ink-500">
            {posts.length === 0
              ? 'Your first piece on tax or audit would be a good place to start.'
              : 'Try a different search term or switch the filter.'}
          </p>
          {posts.length === 0 && (
            <Link href="/admin/posts/new" className="btn btn-gold btn-md mt-6">Write an article</Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-ink-100">
            {visible.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/posts/${p.id}`} className="flex items-center gap-4 p-5 transition-colors hover:bg-ink-50">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{p.title || 'Untitled'}</p>
                    <p className="mt-1 truncate text-[0.8rem] text-ink-400">
                      {p.category ?? 'Uncategorised'}
                      <span className="mx-2" aria-hidden>·</span>
                      {p.status === 'published' && p.publishedAt
                        ? `published ${formatDate(p.publishedAt)}`
                        : `updated ${formatDate(p.updatedAt)}`}
                      {p.featured && <span className="ml-2 text-gold-600">· featured</span>}
                    </p>
                  </div>
                  <span className={
                    p.status === 'published'
                      ? 'shrink-0 rounded-full bg-green-50 px-3 py-1 text-[0.72rem] font-medium text-green-700'
                      : 'shrink-0 rounded-full bg-ink-100 px-3 py-1 text-[0.72rem] font-medium text-ink-500'
                  }>
                    {p.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
