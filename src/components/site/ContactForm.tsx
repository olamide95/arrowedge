'use client';

import { useState } from 'react';
import { Loader2, Check, AlertCircle, Send } from 'lucide-react';

export default function ContactForm() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Message could not be sent');
      setState('done');
      form.reset();
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-gold-200 bg-gold-50 p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-ink">
          <Check className="h-7 w-7" strokeWidth={2.2} aria-hidden />
        </span>
        <h3 className="mt-6 text-[1.4rem]">Message received</h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink-600">
          Someone will respond within one business day. If it is urgent, call the office
          on +234 803 598 9359 and ask for the duty partner.
        </p>
        <button type="button" onClick={() => setState('idle')} className="btn btn-outline btn-md mt-7">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot: invisible to people, irresistible to bots. A filled value
          is rejected server-side. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Full name <span className="text-gold-600">*</span></label>
          <input id="name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email <span className="text-gold-600">*</span></label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@company.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="label">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder="+234 …" />
        </div>
        <div>
          <label htmlFor="subject" className="label">Subject</label>
          <input id="subject" name="subject" className="field" placeholder="What is this about?" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">Message <span className="text-gold-600">*</span></label>
        <textarea
          id="message" name="message" required rows={6}
          className="field field-area"
          placeholder="Tell us what you are dealing with. The more context, the more useful our first reply will be."
        />
      </div>

      {state === 'error' && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <button type="submit" disabled={state === 'busy'} className="btn btn-gold btn-lg w-full group">
        {state === 'busy' ? (
          <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…</>
        ) : (
          <>Send message <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></>
        )}
      </button>

      <p className="text-center text-[0.76rem] text-ink-400">
        Your details stay with us. We do not share or sell them, ever.
      </p>
    </form>
  );
}
