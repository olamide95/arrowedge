'use client';

import { useState } from 'react';
import { Loader2, Check, AlertCircle, CalendarCheck } from 'lucide-react';
import { SERVICES } from '@/lib/data/services';

export default function BookingForm() {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  // Today, so the date field cannot be set in the past.
  const today = new Date().toISOString().split('T')[0];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'busy') return;
    setState('busy');

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Booking could not be submitted');
      setState('done');
      form.reset();
    } catch (err) {
      setError((err as Error).message);
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl bg-ink p-10 text-center grain">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500 text-ink">
          <CalendarCheck className="h-7 w-7" strokeWidth={1.8} aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-[1.4rem] text-white">Request received</h3>
        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-ink-300">
          We will confirm a time by email within one business day. Nothing is committed
          until you have agreed the slot.
        </p>
        <button type="button" onClick={() => setState('idle')} className="btn btn-outline btn-md mt-7 border-ink-600 bg-transparent text-ink-200 hover:bg-white hover:text-ink">
          Book another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="booking_fax">Leave this field empty</label>
        <input id="booking_fax" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-name" className="label">Full name <span className="text-gold-600">*</span></label>
          <input id="b-name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="b-company" className="label">Organisation</label>
          <input id="b-company" name="company" autoComplete="organization" className="field" placeholder="Company or institution" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-email" className="label">Email <span className="text-gold-600">*</span></label>
          <input id="b-email" name="email" type="email" required autoComplete="email" className="field" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="b-phone" className="label">Phone</label>
          <input id="b-phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder="+234 …" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-service" className="label">Service <span className="text-gold-600">*</span></label>
          <select id="b-service" name="service" required defaultValue="" className="field">
            <option value="" disabled>Select a service</option>
            {SERVICES.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
            <option value="Not sure yet">Not sure yet — advise me</option>
          </select>
        </div>
        <div>
          <label htmlFor="b-date" className="label">Preferred date</label>
          <input id="b-date" name="preferredDate" type="date" min={today} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="b-notes" className="label">Anything we should know beforehand?</label>
        <textarea
          id="b-notes" name="notes" rows={4} className="field field-area"
          placeholder="Deadlines, correspondence already received, or the question you most want answered."
        />
      </div>

      {state === 'error' && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-[0.88rem] text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden /> {error}
        </p>
      )}

      <button type="submit" disabled={state === 'busy'} className="btn btn-gold btn-lg w-full">
        {state === 'busy'
          ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Submitting…</>
          : <><CalendarCheck className="h-4 w-4" aria-hidden /> Request a consultation</>}
      </button>

      <p className="text-center text-[0.76rem] text-ink-400">
        A first conversation is free and commits you to nothing.
      </p>
    </form>
  );
}
