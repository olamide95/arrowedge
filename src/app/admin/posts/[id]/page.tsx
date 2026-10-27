'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import PostForm from '@/components/admin/PostForm';
import type { Post } from '@/types';

export default function EditPostPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id ?? '');
  const [post, setPost] = useState<Post | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    if (!id) return;
    (async () => {
      const snap = await getDoc(doc(db, 'posts', id));
      if (!snap.exists()) { setState('missing'); return; }
      const d = snap.data();
      setPost({
        id: snap.id,
        slug: d.slug ?? '', title: d.title ?? '', excerpt: d.excerpt ?? '',
        content: d.content ?? '', coverImage: d.coverImage ?? null,
        coverAlt: d.coverAlt ?? '', category: d.category ?? 'Insights',
        tags: d.tags ?? [],
        author: { name: d.author?.name ?? '', role: d.author?.role ?? '', avatar: d.author?.avatar ?? null },
        status: d.status === 'published' ? 'published' : 'draft',
        featured: !!d.featured,
        publishedAt: d.publishedAt ?? null,
        updatedAt: d.updatedAt ?? Date.now(),
        createdAt: d.createdAt ?? Date.now(),
        readingMinutes: d.readingMinutes ?? 1,
        seo: {
          title: d.seo?.title ?? '', description: d.seo?.description ?? '',
          keywords: d.seo?.keywords ?? [], noIndex: !!d.seo?.noIndex,
        },
      });
      setState('ready');
    })();
  }, [id]);

  if (state === 'loading') {
    return <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-500" aria-hidden /></div>;
  }

  if (state === 'missing') {
    return (
      <div className="card grid place-items-center py-24 text-center">
        <p className="font-display text-xl text-ink">That article no longer exists.</p>
        <p className="mt-2 text-[0.9rem] text-ink-500">It may have been deleted from another session.</p>
        <Link href="/admin/posts" className="btn btn-outline btn-md mt-6">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to articles
        </Link>
      </div>
    );
  }

  return <PostForm existing={post!} />;
}
