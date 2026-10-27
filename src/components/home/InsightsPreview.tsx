import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHead } from '@/components/ui/Section';
import PostCard from '@/components/blog/PostCard';
import { getPublishedPosts } from '@/lib/posts';

export default async function InsightsPreview() {
  const posts = await getPublishedPosts(3);

  // Nothing published yet? Say so plainly rather than rendering an empty grid
  // or inventing filler articles.
  if (!posts.length) {
    return (
      <Section>
        <div className="container-ae">
          <SectionHead
            eyebrow="Insights"
            title={<>Research and <span className="text-gradient-gold">commentary</span></>}
            lead="Our writing on tax, audit and regulatory change in Nigeria is in preparation. Join the brief and the first pieces will reach you directly."
          />
          <div data-reveal className="mt-10 text-center">
            <Link href="/contact" className="btn btn-outline btn-lg">Subscribe to the brief</Link>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="container-ae">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div data-reveal className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="rule-gold" />
              <span className="eyebrow">Insights</span>
            </div>
            <h2 className="mt-5 text-[2rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem]">
              Research and <span className="text-gradient-gold">commentary</span>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-500">
              What is changing in Nigerian tax, audit and regulation — and what it
              means for the way you run your business.
            </p>
          </div>

          <Link href="/blog" data-reveal className="group inline-flex items-center gap-2 text-[0.92rem] font-medium text-gold-700">
            All insights
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <PostCard key={p.id} post={p} delay={i * 80} />
          ))}
        </div>
      </div>
    </Section>
  );
}
