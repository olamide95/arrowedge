'use client';

import { useState } from 'react';
import { Loader2, Check, AlertCircle } from 'lucide-react';

export default function Newsletter({ tone = 'ink' }: { tone?: 'ink' | 'light' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not subscribe');
      setState('done');
      setMessage(data.message ?? 'You are on the list.');
      setEmail('');
    } catch (err) {
      setState('error');
      setMessage((err as Error).message);
    }
  }

  const dark = tone === 'ink';

  if (state === 'done') {
    return (
      <p className={`flex items-center gap-2 text-[0.9rem] ${dark ? 'text-gold-300' : 'text-gold-700'}`}>
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden /> {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
          placeholder="you@company.com"
          autoComplete="email"
          className={
            dark
              ? 'h-12 w-full rounded-xl border border-ink-600 bg-ink-800 px-4 text-[0.9rem] text-white placeholder:text-ink-500 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-500/15'
              : 'field'
          }
        />
        <button type="submit" disabled={state === 'busy'} className="btn btn-gold btn-md shrink-0 px-5">
          {state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Join'}
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 flex items-center gap-1.5 text-[0.8rem] text-red-400">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden /> {message}
        </p>
      )}
      <p className={`mt-2.5 text-[0.74rem] ${dark ? 'text-ink-500' : 'text-ink-400'}`}>
        Tax and audit notes, a few times a year. No selling, and you can leave whenever.
      </p>
    </form>
  );
}
