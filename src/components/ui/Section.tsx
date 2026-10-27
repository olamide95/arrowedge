import { cn } from '@/lib/utils';

export function Section({
  children, className, id, tone = 'light',
}: {
  children: React.ReactNode; className?: string; id?: string;
  tone?: 'light' | 'cream' | 'ink';
}) {
  const tones = {
    light: 'bg-white',
    cream: 'bg-ink-50',
    ink: 'bg-ink text-ink-200 grain',
  };
  return (
    <section id={id} className={cn('py-20 sm:py-28 lg:py-32', tones[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, align = 'center', tone = 'light',
}: {
  eyebrow?: string; title: React.ReactNode; lead?: string;
  align?: 'center' | 'left'; tone?: 'light' | 'ink';
}) {
  return (
    <div
      data-reveal
      className={cn('max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}
    >
      {eyebrow && (
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="rule-gold" />
          <span className="eyebrow">{eyebrow}</span>
          {align === 'center' && <span className="rule-gold" />}
        </div>
      )}
      <h2
        className={cn(
          'mt-5 text-[2rem] leading-[1.12] tracking-[-0.02em] sm:text-[2.6rem] lg:text-[3rem]',
          tone === 'ink' && 'text-white',
        )}
      >
        {title}
      </h2>
      {lead && (
        <p className={cn('mt-5 text-[1.05rem] leading-relaxed', tone === 'ink' ? 'text-ink-300' : 'text-ink-500')}>
          {lead}
        </p>
      )}
    </div>
  );
}
