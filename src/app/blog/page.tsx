import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import { Section } from '@/components/ui/Section';
import BlogIndex from '@/components/blog/BlogIndex';
import Newsletter from '@/components/site/Newsletter';
import { getPublishedPosts, getFeaturedPost, getAllCategories } from '@/lib/posts';
import { pageMetadata, breadcrumbLd, SITE } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = pageMetadata({
  title: 'Insights & Research',
  description:
    'Commentary and research on Nigerian tax, audit, regulation and business ' +
    'finance from the professionals at Arrow-Edge.',
  path: '/blog',
  keywords: ['Nigerian tax updates', 'FIRS guidance', 'audit insights Nigeria', 'business finance Nigeria'],
});

// Short window: a published post should surface quickly, without every
// visitor triggering a database read.
export const revalidate = 60;

export default async function BlogPage() {
  const [posts, featured, categories] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getAllCategories(),
  ]);

  // The lead article is shown in its own slot, so keep it out of the grid.
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE.url}/blog#blog`,
    name: 'Arrow-Edge Insights',
    description: 'Research and commentary on Nigerian tax, audit and regulation.',
    url: `${SITE.url}/blog`,
    publisher: { '@id': `${SITE.url}/#organization` },
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined,
      author: { '@type': 'Person', name: p.author.name },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbLd([{ name: 'Insights', path: '/blog' }]), blogLd]),
        }}
      />

      <PageHero
        eyebrow="Insights"
        title={<>Research, and what it <span className="text-gradient-gold">means for you</span></>}
        lead="Plain-English commentary on Nigerian tax, audit and regulatory change — written by the people who deal with it daily."
        trail={[{ name: 'Insights', path: '/blog' }]}
      />

      {featured && (
        <Section className="!pb-0">
          <div className="container-ae">
            <article data-reveal className="group grid overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift lg:grid-cols-2">
              <Link href={`/blog/${featured.slug}`} className="relative aspect-[16/10] overflow-hidden bg-ink-100 lg:aspect-auto lg:min-h-[23rem]">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage} alt={featured.coverAlt || featured.title} fill priority
                    sizes="(max-width: 1024px) 94vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-800 to-ink">
                    <svg viewBox="0 0 120 120" className="h-28 w-28 opacity-40" fill="none" aria-hidden>
                      <g stroke="#A88A28" strokeLinecap="round" fill="none">
                        <ellipse cx="60" cy="62" rx="44" ry="50" strokeWidth="8" transform="rotate(-24 60 62)" />
                        <ellipse cx="60" cy="62" rx="24" ry="29" strokeWidth="5" transform="rotate(-24 60 62)" opacity=".7" />
                      </g>
                    </svg>
                  </span>
                )}
              </Link>

              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gold-50 px-3 py-1 text-[0.7rem] font-medium text-gold-700">
                    {featured.category}
                  </span>
                  <span className="text-[0.74rem] text-ink-400">Featured</span>
                </div>
                <h2 className="mt-5 text-[1.8rem] leading-snug sm:text-[2.2rem]">
                  <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-gold-700">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-ink-500">{featured.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.78rem] text-ink-400">
                  <span>{featured.author.name}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={featured.publishedAt ? new Date(featured.publishedAt).toISOString() : undefined}>
                    {formatDate(featured.publishedAt)}
                  </time>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" strokeWidth={1.8} aria-hidden />
                    {featured.readingMinutes} min
                  </span>
                </div>
                <Link href={`/blog/${featured.slug}`} className="btn btn-primary btn-md group mt-8 self-start">
                  Read the article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </article>
          </div>
        </Section>
      )}

      <Section>
        <div className="container-ae">
          {posts.length > 0 ? (
            <BlogIndex posts={rest} categories={categories} />
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-200 py-24 text-center">
              <h2 className="font-display text-2xl">The first articles are on their way.</h2>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-500">
                We are preparing our opening pieces on tax compliance and audit readiness
                for Nigerian businesses. Join the brief and they will reach you first.
              </p>
              <div className="mx-auto mt-8 max-w-sm"><Newsletter tone="light" /></div>
            </div>
          )}
        </div>
      </Section>

      {posts.length > 0 && (
        <Section tone="ink" className="!py-16">
          <div className="container-ae grid items-center gap-8 lg:grid-cols-2">
            <div data-reveal>
              <h2 className="font-display text-[1.7rem] leading-snug text-white sm:text-[2rem]">
                The Arrow-Edge Brief
              </h2>
              <p className="mt-3 leading-relaxed text-ink-300">
                Deadlines, regulatory change and what it means in practice. A few times a year.
              </p>
            </div>
            <div data-reveal data-reveal-delay="100"><Newsletter tone="ink" /></div>
          </div>
        </Section>
      )}
    </>
  );
}
