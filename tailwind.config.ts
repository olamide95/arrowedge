import type { Config } from 'tailwindcss';

/**
 * Palette is built from the logo's own gold, sampled at #A88A28 — the single
 * dominant colour across 108k of its pixels. Every tint and shade below is
 * derived from it rather than picked by eye, so the site and the mark stay in
 * the same family wherever they sit next to each other.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#FBF9F1',
          100: '#F4EEDA',
          200: '#E8DBAF',
          300: '#D9C27C',
          400: '#C5A54B',
          500: '#A88A28', // the logo
          600: '#8E7421',
          700: '#6E5A1A',
          800: '#4D3F12',
          900: '#2C240A',
        },
        ink: {
          DEFAULT: '#12110D',
          800: '#1C1A14',
          700: '#2A2720',
          600: '#413D33',
          500: '#5E594C',
          400: '#8A8476',
          300: '#B8B2A3',
          200: '#DED9CC',
          100: '#F1EEE6',
          50:  '#FAF9F5',
        },
      },
      fontFamily: {
        // Playfair carries the same high thick/thin contrast as the wordmark.
        display: ['var(--font-display)', 'Georgia', 'serif'],
        // Cinzel is Trajan-derived — the same lineage as "ARROW-EDGE" itself.
        mark: ['var(--font-mark)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '78rem' },
      // Tailwind's default opacity scale jumps 10 → 20 → 25, which is too
      // coarse for the faint gold washes and glass panels this design leans
      // on. These fill the gaps so `/12` and `/85` resolve as written rather
      // than needing bracket syntax at every call site.
      opacity: {
        8: '0.08', 12: '0.12', 15: '0.15', 35: '0.35',
        45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85', 92: '0.92',
      },
      spacing: { 13: '3.25rem', 15: '3.75rem', 18: '4.5rem', 22: '5.5rem' },
      boxShadow: {
        lift: '0 1px 2px rgba(18,17,13,.04), 0 12px 32px -12px rgba(18,17,13,.18)',
        liftLg: '0 2px 4px rgba(18,17,13,.05), 0 32px 64px -24px rgba(18,17,13,.28)',
        gold: '0 18px 40px -18px rgba(168,138,40,.55)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(103deg,#8E7421 0%,#A88A28 28%,#D9C27C 52%,#A88A28 74%,#8E7421 100%)',
      },
      keyframes: {
        rise:   { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
        draw:   { '0%': { strokeDashoffset: '1' }, '100%': { strokeDashoffset: '0' } },
        shimmer:{ '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        float:  { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.22,.8,.3,1) both',
        shimmer: 'shimmer 2.4s linear infinite',
        float: 'float 7s ease-in-out infinite',
      },
      typography: (theme: any) => ({
        aeprose: {
          css: {
            '--tw-prose-body': theme('colors.ink.600'),
            '--tw-prose-headings': theme('colors.ink.DEFAULT'),
            '--tw-prose-links': theme('colors.gold.600'),
            '--tw-prose-bold': theme('colors.ink.DEFAULT'),
            '--tw-prose-quotes': theme('colors.ink.700'),
            '--tw-prose-quote-borders': theme('colors.gold.500'),
            '--tw-prose-bullets': theme('colors.gold.400'),
            '--tw-prose-counters': theme('colors.gold.600'),
            '--tw-prose-th-borders': theme('colors.ink.200'),
            '--tw-prose-td-borders': theme('colors.ink.100'),
            h2: { fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' },
            h3: { fontFamily: 'var(--font-display)' },
            a: { textUnderlineOffset: '3px' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
