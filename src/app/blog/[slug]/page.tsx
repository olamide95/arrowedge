import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Clock, ArrowLeft, Tag } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import ReadingProgress from '@/components/blog/ReadingProgress';
import ShareButtons from '@/components/blog/ShareButtons';
import TableOfContents from '@/components/blog/TableOfContents';
import PostCard from '@/components/blog/PostCard';
import Monogram from '@/components/ui/Monogram';
import Newsletter from '@/components/site/Newsletter';
import CtaBand from '@/components/home/CtaBand';
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from '@/lib/posts';
import { postMetadata, articleLd, breadcrumbLd, SITE } from '@/lib/seo';
import { formatDate, tableOfContents } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 600;

/** Pre-render what exists at build; anything newer is rendered on demand. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts(50);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }
  return postMetadata(post);
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const toc = tableOfContents(post.content);
  const url = `${SITE.url}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleLd(post),
            breadcrumbLd([
              { name: 'Insights', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]),
        }}
      />

      <header className="relative overflow-hidden bg-ink grain">
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-[110px]" />
        <div className="container-ae relative py-16 sm:py-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[0.84rem] text-ink-400 transition-colors hover:text-gold-300">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All insights
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gold-500/15 px-3.5 py-1.5 text-[0.72rem] font-medium text-gold-300">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.76rem] text-ink-400">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              {post.readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-[2.2rem] leading-[1.1] tracking-[-0.025em] text-white sm:text-[2.9rem] lg:text-[3.2rem]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-ink-300">{post.excerpt}</p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-ink-700 pt-7">
            {post.author.avatar ? (
              <Image src={post.author.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <Monogram name={post.author.name} className="h-12 w-12 rounded-full text-base" />
            )}
            <div className="flex-1">
              <p className="text-[0.92rem] font-medium text-white">{post.author.name}</p>
              <p className="text-[0.78rem] text-ink-400">
                {post.author.role}
                <span className="mx-2 text-ink-600" aria-hidden>·</span>
                <time dateTime={post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined}>
                  {formatDate(post.publishedAt)}
                </time>
              </p>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/45 to-transparent" />
      </header>

      {post.coverImage && (
        <div className="container-ae -mt-px">
          <figure className="relative -mb-16 mt-10 overflow-hidden rounded-2xl shadow-liftLg sm:-mb-20">
            <Image
              src={post.coverImage} alt={post.coverAlt || post.title}
              width={1600} height={900} priority
              sizes="(max-width: 1280px) 94vw, 78rem"
              className="h-full w-full object-cover"
            />
          </figure>
        </div>
      )}

      <Section className={post.coverImage ? '!pt-28 sm:!pt-32' : ''}>
        <div className="container-ae grid gap-12 lg:grid-cols-12 lg:gap-14">
          {toc.length >= 3 && (
            <aside className="hidden lg:col-span-3 lg:block">
              <TableOfContents items={toc} />
            </aside>
          )}

          <div className={toc.length >= 3 ? 'lg:col-span-9' : 'lg:col-span-8 lg:col-start-3'}>
            <div className="prose prose-aeprose max-w-none prose-headings:scroll-mt-28 prose-img:rounded-xl prose-lg">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                  // Internal links route through next/link; external ones get
                  // the security attributes they need.
                  a: ({ href, children, ...rest }) => {
                    const h = href ?? '#';
                    if (h.startsWith('/')) return <Link href={h}>{children}</Link>;
                    return <a href={h} target="_blank" rel="noopener noreferrer nofollow" {...rest}>{children}</a>;
                  },
                  img: ({ src, alt }) =>
                    typeof src === 'string' ? (
                      <Image
                        src={src} alt={alt ?? ''} width={1400} height={850}
                        sizes="(max-width: 1024px) 94vw, 48rem"
                        className="h-auto w-full rounded-xl"
                      />
                    ) : null,
                }}
              >
                {post.content}
              </Markdown>
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-8">
                <Tag className="h-4 w-4 text-ink-400" strokeWidth={1.6} aria-hidden />
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full bg-ink-50 px-3 py-1.5 text-[0.76rem] text-ink-500">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-ink-100 pt-8">
              <ShareButtons url={url} title={post.title} />
              <Link href="/contact#book" className="btn btn-outline btn-md">
                Discuss this with us
              </Link>
            </div>

            <aside className="mt-12 rounded-2xl bg-ink p-8 grain sm:p-10">
              <h2 className="font-display text-[1.4rem] text-white">Keep up with the changes</h2>
              <p className="mt-3 max-w-md leading-relaxed text-ink-300">
                Tax deadlines, regulatory shifts and what they mean in practice — a few
                times a year, nothing more.
              </p>
              <div className="mt-6 max-w-md"><Newsletter tone="ink" /></div>
            </aside>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="cream">
          <div className="container-ae">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Keep reading</span>
            </div>
            <h2 className="mt-5 text-[1.9rem] leading-snug">Related insights</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => <PostCard key={p.id} post={p} delay={i * 80} />)}
            </div>
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
