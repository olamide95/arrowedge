import 'server-only';
import { adminDb } from './firebase/admin';
import type { Post } from '@/types';

const COLLECTION = 'posts';

/**
 * Firestore documents come back with Timestamps and loose shapes. Everything
 * crossing into a React component goes through here first so a page never has
 * to defend against a half-written document.
 */
function toPost(id: string, d: FirebaseFirestore.DocumentData): Post {
  const ms = (v: any): number | null =>
    v == null ? null : typeof v === 'number' ? v : v?.toMillis?.() ?? null;

  return {
    id,
    slug: d.slug ?? id,
    title: d.title ?? 'Untitled',
    excerpt: d.excerpt ?? '',
    content: d.content ?? '',
    coverImage: d.coverImage ?? null,
    coverAlt: d.coverAlt ?? d.title ?? '',
    category: d.category ?? 'Insights',
    tags: Array.isArray(d.tags) ? d.tags : [],
    author: {
      name: d.author?.name ?? 'Arrow-Edge',
      role: d.author?.role ?? 'Professional Services',
      avatar: d.author?.avatar ?? null,
    },
    status: d.status === 'published' ? 'published' : 'draft',
    featured: !!d.featured,
    publishedAt: ms(d.publishedAt),
    updatedAt: ms(d.updatedAt) ?? Date.now(),
    createdAt: ms(d.createdAt) ?? Date.now(),
    readingMinutes: d.readingMinutes ?? 1,
    seo: {
      title: d.seo?.title ?? d.title ?? '',
      description: d.seo?.description ?? d.excerpt ?? '',
      keywords: Array.isArray(d.seo?.keywords) ? d.seo.keywords : [],
      noIndex: !!d.seo?.noIndex,
    },
  };
}

/**
 * Firestore is unreachable during a cold build on a fresh project, and a
 * missing composite index throws at query time. Neither should take the whole
 * site down — the blog degrades to empty and the rest of the pages render.
 */
async function safeQuery<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await run();
  } catch (err) {
    console.error(`[posts] ${label} failed:`, (err as Error).message);
    return fallback;
  }
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  return safeQuery(async () => {
    let q = adminDb.collection(COLLECTION)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc');
    if (limit) q = q.limit(limit);
    const snap = await q.get();
    return snap.docs.map((doc) => toPost(doc.id, doc.data()));
  }, [], 'getPublishedPosts');
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return safeQuery(async () => {
    const snap = await adminDb.collection(COLLECTION)
      .where('slug', '==', slug).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const post = toPost(doc.id, doc.data());
    // A draft must not be reachable by guessing its URL.
    return post.status === 'published' ? post : null;
  }, null, `getPostBySlug(${slug})`);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  return safeQuery(async () => {
    const snap = await adminDb.collection(COLLECTION)
      .where('status', '==', 'published')
      .where('category', '==', category)
      .orderBy('publishedAt', 'desc')
      .get();
    return snap.docs.map((doc) => toPost(doc.id, doc.data()));
  }, [], `getPostsByCategory(${category})`);
}

export async function getFeaturedPost(): Promise<Post | null> {
  const featured = await safeQuery(async () => {
    const snap = await adminDb.collection(COLLECTION)
      .where('status', '==', 'published')
      .where('featured', '==', true)
      .orderBy('publishedAt', 'desc').limit(1).get();
    return snap.empty ? null : toPost(snap.docs[0].id, snap.docs[0].data());
  }, null, 'getFeaturedPost');

  // Nothing flagged? The newest post leads instead of an empty hero.
  if (featured) return featured;
  const [latest] = await getPublishedPosts(1);
  return latest ?? null;
}

/**
 * Posts sharing a category, then topped up with recent ones. Readers who
 * finish an article should always have somewhere to go next.
 */
export async function getRelatedPosts(post: Post, count = 3): Promise<Post[]> {
  const sameCategory = (await getPostsByCategory(post.category))
    .filter((p) => p.id !== post.id);
  if (sameCategory.length >= count) return sameCategory.slice(0, count);

  const recent = (await getPublishedPosts(count + 4))
    .filter((p) => p.id !== post.id && !sameCategory.some((s) => s.id === p.id));
  return [...sameCategory, ...recent].slice(0, count);
}

export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
