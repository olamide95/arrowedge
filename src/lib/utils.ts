export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** URL-safe slug. Collapses punctuation rather than stripping it blindly. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Minutes to read, from the markdown body with syntax stripped out. */
export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~\-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

/**
 * Accepts whatever a date actually arrives as. Server components get
 * milliseconds (normalised in `lib/posts.ts`), but the admin screens read
 * Firestore through the web SDK and get a `Timestamp` object — and a document
 * written with `serverTimestamp()` reads back as `null` for a moment before
 * the server's value lands. All three have to render without throwing.
 */
type DateLike =
  | number
  | string
  | Date
  | { toDate: () => Date }
  | { seconds: number }
  | null
  | undefined;

function toDate(value: DateLike): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') return new Date(value);
  // Firestore Timestamp, either hydrated by the SDK or as a plain object
  // after passing through serialisation.
  if (typeof (value as any).toDate === 'function') {
    try { return (value as any).toDate(); } catch { return null; }
  }
  if (typeof (value as any).seconds === 'number') {
    return new Date((value as any).seconds * 1000);
  }
  return null;
}

export function formatDate(value: DateLike, opts?: Intl.DateTimeFormatOptions) {
  const date = toDate(value);
  // An unparseable value renders as nothing rather than taking the page down.
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric', ...opts,
  }).format(date);
}

/** Pulls `## headings` out of markdown for the article table of contents. */
export function tableOfContents(markdown: string) {
  const out: { id: string; text: string; level: 2 | 3 }[] = [];
  const lines = markdown.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (line.trimStart().startsWith('```')) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    out.push({ id: slugify(m[2]), text: m[2], level: m[1].length as 2 | 3 });
  }
  return out;
}

export function excerptFrom(markdown: string, max = 180) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, plain.lastIndexOf(' ', max)) + '…';
}