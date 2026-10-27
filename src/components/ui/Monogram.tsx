import { cn } from '@/lib/utils';

/**
 * Initials in the brand gold, used where a team member has no portrait.
 *
 * Chosen over a generic silhouette or stock headshot: an honest monogram
 * reads as deliberate, while a stock face on a professional-services team
 * page reads as a firm padding its bench.
 */
export default function Monogram({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '').join('');

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink text-gold-300',
        className,
      )}
      aria-hidden
    >
      <span className="font-mark text-3xl tracking-[0.1em] sm:text-4xl">{initials}</span>
    </div>
  );
}
