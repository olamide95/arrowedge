'use client';

import { useState } from 'react';
import { Link2, Check, Linkedin, Twitter, MessageCircle } from 'lucide-react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = { u: encodeURIComponent(url), t: encodeURIComponent(title) };

  const links = [
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc.u}`, Icon: Linkedin },
    { label: 'Share on X',        href: `https://twitter.com/intent/tweet?url=${enc.u}&text=${enc.t}`,  Icon: Twitter },
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${enc.t}%20${enc.u}`,                       Icon: MessageCircle },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some embedded browsers; the share links still work.
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[0.76rem] uppercase tracking-[0.18em] text-ink-400">Share</span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 text-ink-500 transition-all hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
        >
          <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        </a>
      ))}
      <button
        type="button" onClick={copy} aria-label="Copy link to this article"
        className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 text-ink-500 transition-all hover:border-gold-500 hover:bg-gold-50 hover:text-gold-700"
      >
        {copied
          ? <Check className="h-4 w-4 text-gold-700" strokeWidth={2} aria-hidden />
          : <Link2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Link copied' : ''}</span>
    </div>
  );
}
