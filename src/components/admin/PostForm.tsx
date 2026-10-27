'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection, doc, getDocs, query, serverTimestamp, setDoc, where, deleteDoc,
} from 'firebase/firestore';
import {
  Save, Send, Trash2, Loader2, AlertCircle, Check, ExternalLink, ChevronDown,
} from 'lucide-react';
import { db } from '@/lib/firebase/client';
import MarkdownEditor from './MarkdownEditor';
import ImageUpload from './ImageUpload';
import { slugify, readingMinutes, excerptFrom } from '@/lib/utils';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Tax', 'Audit', 'Advisory', 'Debt Recovery', 'Risk', 'Regulation', 'Insights'];

const EMPTY: Omit<Post, 'id'> = {
  slug: '', title: '', excerpt: '', content: '',
  coverImage: null, coverAlt: '', category: 'Insights', tags: [],
  author: { name: '', role: '', avatar: null },
  status: 'draft', featured: false,
  publishedAt: null, updatedAt: Date.now(), createdAt: Date.now(), readingMinutes: 1,
  seo: { title: '', description: '', keywords: [], noIndex: false },
};

export default function PostForm({ existing }: { existing?: Post }) {
  const router = useRouter();
  const [post, setPost] = useState<Omit<Post, 'id'>>(existing ?? EMPTY);
  const [id] = useState(() => existing?.id ?? doc(collection(db, 'posts')).id);
  const [busy, setBusy] = useState<'save' | 'publish' | 'delete' | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  // The slug stops tracking the title once the article is live, so published
  // URLs never shift under inbound links.
  const slugLocked = useRef(!!existing?.publishedAt);

  const set = <K extends keyof typeof post>(k: K, v: (typeof post)[K]) => {
    setPost((p) => ({ ...p, [k]: v }));
    setSaved(false);
  };

  useEffect(() => {
    if (slugLocked.current || !post.title) return;
    setPost((p) => ({ ...p, slug: slugify(p.title) }));
  }, [post.title]);

  const words = useMemo(() => post.content.trim().split(/\s+/).filter(Boolean).length, [post.content]);

  /** Rejects a slug already taken by a different document. */
  async function slugTaken(slug: string) {
    const snap = await getDocs(query(collection(db, 'posts'), where('slug', '==', slug)));
    return snap.docs.some((d) => d.id !== id);
  }

  async function persist(status: 'draft' | 'published') {
    setError('');

    if (!post.title.trim()) { setError('The article needs a title.'); return; }
    if (status === 'published') {
      if (!post.content.trim()) { setError('There is nothing to publish — the body is empty.'); return; }
      if (!post.author.name.trim()) { setError('Add an author before publishing.'); return; }
    }

    const slug = slugify(post.slug || post.title);
    if (!slug) { setError('That title does not produce a usable URL. Set the slug by hand.'); return; }

    setBusy(status === 'published' ? 'publish' : 'save');
    try {
      if (await slugTaken(slug)) {
        setError(`The URL “${slug}” is already used by another article.`);
        setBusy(null);
        return;
      }

      const now = Date.now();
      const payload = {
        ...post,
        slug,
        // Fall back to a generated summary rather than publishing a card with
        // no description — which would also leave the meta description empty.
        excerpt: post.excerpt.trim() || excerptFrom(post.content),
        coverAlt: post.coverAlt.trim() || post.title,
        readingMinutes: readingMinutes(post.content),
        status,
        // Set once, on first publish, so re-editing never resets the date.
        publishedAt: status === 'published' ? (post.publishedAt ?? now) : post.publishedAt,
        createdAt: post.createdAt ?? now,
        updatedAt: now,
        seo: {
          ...post.seo,
          title: post.seo.title.trim() || post.title,
          description: post.seo.description.trim() || post.excerpt.trim() || excerptFrom(post.content, 155),
        },
      };

      await setDoc(doc(db, 'posts', id), payload, { merge: true });
      setPost(payload);
      if (status === 'published') slugLocked.current = true;
      setSaved(true);
      setBusy(null);

      if (!existing) router.replace(`/admin/posts/${id}`);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  }

  async function remove() {
    if (!existing) return;
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setBusy('delete');
    try {
      await deleteDoc(doc(db, 'posts', id));
      router.replace('/admin/posts');
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-5 xl:col-span-8">
        <div className="card p-6 sm:p-7">
          <label htmlFor="title" className="label">Title</label>
          <input
            id="title" value={post.title} onChange={(e) => set('title', e.target.value)}
            placeholder="What is this article about?"
            className="w-full border-0 p-0 font-display text-[1.6rem] text-ink placeholder:text-ink-300 focus:outline-none"
          />

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
            <span className="text-[0.78rem] text-ink-400">arrow-edge.org.ng/blog/</span>
            <input
              value={post.slug}
              onChange={(e) => { slugLocked.current = true; set('slug', slugify(e.target.value)); }}
              placeholder="url-slug"
              className="min-w-0 flex-1 border-0 p-0 text-[0.84rem] text-gold-700 placeholder:text-ink-300 focus:outline-none"
            />
            {slugLocked.current && post.publishedAt && (
              <span className="rounded-full bg-ink-50 px-2.5 py-1 text-[0.68rem] text-ink-400">
                locked — changing this breaks existing links
              </span>
            )}
          </div>
        </div>

        <MarkdownEditor value={post.content} onChange={(v) => set('content', v)} />

        <div className="card p-6 sm:p-7">
          <button
            type="button" onClick={() => setSeoOpen((v) => !v)}
            aria-expanded={seoOpen}
            className="flex w-full items-center justify-between gap-4"
          >
            <span className="text-left">
              <span className="block font-display text-[1.1rem] text-ink">Search appearance</span>
              <span className="mt-0.5 block text-[0.8rem] text-ink-400">
                How this looks on Google. Left blank, we derive it from the title and excerpt.
              </span>
            </span>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-ink-400 transition-transform', seoOpen && 'rotate-180')} aria-hidden />
          </button>

          {seoOpen && (
            <div className="mt-6 space-y-5 border-t border-ink-100 pt-6">
              {/* A live SERP preview — the quickest way to see a title being
                  truncated before Google does it for you. */}
              <div className="rounded-xl bg-ink-50 p-5">
                <p className="text-[0.7rem] uppercase tracking-wider text-ink-400">Preview</p>
                <p className="mt-3 truncate text-[1.05rem] text-[#1a0dab]">
                  {post.seo.title || post.title || 'Article title'}
                </p>
                <p className="mt-0.5 text-[0.8rem] text-[#006621]">
                  arrow-edge.org.ng › blog › {post.slug || 'url-slug'}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.84rem] text-ink-500">
                  {post.seo.description || post.excerpt || excerptFrom(post.content, 155) || 'A short description of the article.'}
                </p>
              </div>

              <div>
                <label htmlFor="seo-title" className="label">
                  SEO title
                  <span className={cn('ml-2 font-normal', (post.seo.title || post.title).length > 60 ? 'text-amber-600' : 'text-ink-400')}>
                    {(post.seo.title || post.title).length}/60
                  </span>
                </label>
                <input
                  id="seo-title" value={post.seo.title}
                  onChange={(e) => set('seo', { ...post.seo, title: e.target.value })}
                  placeholder={post.title || 'Defaults to the article title'}
                  className="field"
                />
              </div>

              <div>
                <label htmlFor="seo-desc" className="label">
                  Meta description
                  <span className={cn('ml-2 font-normal', post.seo.description.length > 160 ? 'text-amber-600' : 'text-ink-400')}>
                    {post.seo.description.length}/160
                  </span>
                </label>
                <textarea
                  id="seo-desc" rows={3} value={post.seo.description}
                  onChange={(e) => set('seo', { ...post.seo, description: e.target.value })}
                  placeholder="Defaults to the excerpt"
                  className="field field-area"
                />
              </div>

              <div>
                <label htmlFor="seo-kw" className="label">Keywords (comma separated)</label>
                <input
                  id="seo-kw" value={post.seo.keywords.join(', ')}
                  onChange={(e) => set('seo', {
                    ...post.seo,
                    keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                  })}
                  placeholder="company income tax, FIRS, tax clearance"
                  className="field"
                />
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox" checked={post.seo.noIndex}
                  onChange={(e) => set('seo', { ...post.seo, noIndex: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-ink-300 text-gold-500 focus:ring-gold-500"
                />
                <span>
                  <span className="block text-[0.88rem] font-medium text-ink">Hide from search engines</span>
                  <span className="mt-0.5 block text-[0.78rem] text-ink-400">
                    Published and readable by anyone with the link, but excluded from Google and the sitemap.
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-5 xl:col-span-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <span className={
              post.status === 'published'
                ? 'rounded-full bg-green-50 px-3 py-1 text-[0.74rem] font-medium text-green-700'
                : 'rounded-full bg-ink-100 px-3 py-1 text-[0.74rem] font-medium text-ink-500'
            }>
              {post.status === 'published' ? 'Published' : 'Draft'}
            </span>
            {saved && (
              <span className="flex items-center gap-1.5 text-[0.78rem] text-green-700">
                <Check className="h-3.5 w-3.5" aria-hidden /> Saved
              </span>
            )}
          </div>

          <p className="mt-4 text-[0.78rem] text-ink-400">
            {words} words · about {readingMinutes(post.content)} min to read
          </p>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {error}
            </p>
          )}

          <div className="mt-5 space-y-2.5">
            <button type="button" onClick={() => persist('published')} disabled={!!busy} className="btn btn-gold btn-md w-full">
              {busy === 'publish'
                ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Publishing…</>
                : <><Send className="h-4 w-4" aria-hidden /> {post.status === 'published' ? 'Update' : 'Publish'}</>}
            </button>
            <button type="button" onClick={() => persist('draft')} disabled={!!busy} className="btn btn-outline btn-md w-full">
              {busy === 'save'
                ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…</>
                : <><Save className="h-4 w-4" aria-hidden /> Save draft</>}
            </button>
            {post.status === 'published' && post.slug && (
              <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost btn-md w-full">
                <ExternalLink className="h-4 w-4" aria-hidden /> View live
              </a>
            )}
            {existing && (
              <button type="button" onClick={remove} disabled={!!busy} className="btn btn-ghost btn-md w-full text-red-600 hover:bg-red-50">
                {busy === 'delete'
                  ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  : <><Trash2 className="h-4 w-4" aria-hidden /> Delete</>}
              </button>
            )}
          </div>
        </div>

        <div className="card space-y-5 p-6">
          <ImageUpload
            value={post.coverImage}
            onChange={(url) => set('coverImage', url)}
          />
          {post.coverImage && (
            <div>
              <label htmlFor="alt" className="label">
                Image description
                <span className="ml-1 font-normal text-ink-400">(for screen readers and SEO)</span>
              </label>
              <input
                id="alt" value={post.coverAlt} onChange={(e) => set('coverAlt', e.target.value)}
                placeholder={post.title || 'Describe the image'} className="field"
              />
            </div>
          )}
        </div>

        <div className="card space-y-5 p-6">
          <div>
            <label htmlFor="category" className="label">Category</label>
            <select id="category" value={post.category} onChange={(e) => set('category', e.target.value)} className="field">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="label">Tags (comma separated)</label>
            <input
              id="tags" value={post.tags.join(', ')}
              onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
              placeholder="VAT, compliance, FIRS" className="field"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="label">
              Excerpt
              <span className="ml-1 font-normal text-ink-400">(shown on cards)</span>
            </label>
            <textarea
              id="excerpt" rows={3} value={post.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              placeholder="Left blank, we take the opening of the article."
              className="field field-area"
            />
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox" checked={post.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-ink-300 text-gold-500 focus:ring-gold-500"
            />
            <span>
              <span className="block text-[0.88rem] font-medium text-ink">Feature this article</span>
              <span className="mt-0.5 block text-[0.78rem] text-ink-400">
                Leads the Insights page. The most recent featured article wins.
              </span>
            </span>
          </label>
        </div>

        <div className="card space-y-5 p-6">
          <p className="font-display text-[1.05rem] text-ink">Author</p>
          <div>
            <label htmlFor="a-name" className="label">Name</label>
            <input
              id="a-name" value={post.author.name}
              onChange={(e) => set('author', { ...post.author, name: e.target.value })}
              placeholder="Gideon Olajide Oloniyo" className="field"
            />
          </div>
          <div>
            <label htmlFor="a-role" className="label">Role</label>
            <input
              id="a-role" value={post.author.role}
              onChange={(e) => set('author', { ...post.author, role: e.target.value })}
              placeholder="Principal Partner" className="field"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
