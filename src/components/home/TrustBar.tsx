import { ENGAGEMENTS } from '@/lib/data/clients';

export default function TrustBar() {
  // Doubled so the marquee can loop without a visible seam.
  const row = [...ENGAGEMENTS, ...ENGAGEMENTS];

  return (
    <section aria-label="Selected clients" className="border-b border-ink-100 bg-white py-10">
      <p className="container-ae text-center font-mark text-[0.68rem] uppercase tracking-[0.28em] text-ink-400">
        Trusted by federal institutions, state authorities and private enterprise
      </p>

      {/* Edges fade rather than cut, so names do not appear to be chopped off */}
      <div
        className="group relative mt-7 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)',
        }}
      >
        <ul
          className="flex w-max items-center gap-12 motion-safe:animate-[marquee_46s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]"
          style={{ ['--tw-enter' as any]: '' }}
        >
          {row.map((c, i) => (
            <li
              key={`${c.name}-${i}`}
              aria-hidden={i >= ENGAGEMENTS.length}
              className="whitespace-nowrap font-display text-[1.05rem] text-ink-400 transition-colors hover:text-gold-600"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
