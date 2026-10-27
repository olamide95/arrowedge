'use client';

import { useEffect, useState } from 'react';
import {
  collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { Loader2, Mail, Trash2, Check, Phone, Building2, Calendar, Inbox } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { formatDate, cn } from '@/lib/utils';

type Kind = 'messages' | 'bookings';

/**
 * Shared viewer for the two inbound collections. They differ in their fields
 * but not in what you do with them — read, mark handled, delete — so one
 * component serves both rather than two near-identical screens drifting apart.
 */
export default function InboxList({ kind }: { kind: Kind }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  const load = async () => {
    const snap = await getDocs(query(collection(db, kind), orderBy('createdAt', 'desc')));
    setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [kind]);

  async function markHandled(id: string, current: boolean) {
    const patch = kind === 'messages'
      ? { read: !current }
      : { status: current ? 'new' : 'contacted' };
    await updateDoc(doc(db, kind, id), patch);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  async function remove(id: string) {
    if (!confirm('Delete this permanently?')) return;
    await deleteDoc(doc(db, kind, id));
    setRows((r) => r.filter((x) => x.id !== id));
  }

  const isHandled = (row: any) =>
    kind === 'messages' ? !!row.read : row.status !== 'new';

  if (loading) {
    return <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-500" aria-hidden /></div>;
  }

  if (rows.length === 0) {
    return (
      <div className="card grid place-items-center py-24 text-center">
        <Inbox className="h-10 w-10 text-ink-300" strokeWidth={1.3} aria-hidden />
        <p className="mt-4 font-display text-xl text-ink">
          {kind === 'messages' ? 'No messages yet' : 'No bookings yet'}
        </p>
        <p className="mt-2 max-w-sm text-[0.9rem] text-ink-500">
          Anything submitted through the website will appear here.
        </p>
      </div>
    );
  }

  const pending = rows.filter((r) => !isHandled(r)).length;

  return (
    <div className="space-y-4">
      <p className="text-[0.88rem] text-ink-500">
        {rows.length} total
        {pending > 0 && <span className="ml-2 rounded-full bg-gold-50 px-2.5 py-1 text-[0.76rem] font-medium text-gold-700">{pending} awaiting response</span>}
      </p>

      <div className="card divide-y divide-ink-100 overflow-hidden">
        {rows.map((row) => {
          const handled = isHandled(row);
          const expanded = open === row.id;

          return (
            <article key={row.id} className={cn('transition-colors', !handled && 'bg-gold-50/40')}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : row.id)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-4 p-5 text-left"
              >
                <span className={cn(
                  'mt-1 h-2 w-2 shrink-0 rounded-full',
                  handled ? 'bg-ink-200' : 'bg-gold-500',
                )} aria-hidden />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-medium text-ink">{row.name}</span>
                    <span className="text-[0.8rem] text-ink-400">{row.email}</span>
                  </span>
                  <span className="mt-1 block truncate text-[0.86rem] text-ink-500">
                    {kind === 'messages'
                      ? (row.subject || row.message)
                      : `${row.service}${row.company ? ` · ${row.company}` : ''}`}
                  </span>
                </span>

                <time className="shrink-0 text-[0.76rem] text-ink-400">
                  {formatDate(row.createdAt, { day: 'numeric', month: 'short' })}
                </time>
              </button>

              {expanded && (
                <div className="border-t border-ink-100 bg-white px-5 py-6 sm:px-14">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Email</dt>
                      <dd className="mt-1"><a href={`mailto:${row.email}`} className="text-gold-700 hover:underline">{row.email}</a></dd>
                    </div>
                    {row.phone && (
                      <div>
                        <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Phone</dt>
                        <dd className="mt-1 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-ink-400" aria-hidden />
                          <a href={`tel:${row.phone}`} className="text-gold-700 hover:underline">{row.phone}</a>
                        </dd>
                      </div>
                    )}
                    {row.company && (
                      <div>
                        <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Organisation</dt>
                        <dd className="mt-1 flex items-center gap-1.5 text-ink-600">
                          <Building2 className="h-3.5 w-3.5 text-ink-400" aria-hidden /> {row.company}
                        </dd>
                      </div>
                    )}
                    {row.service && (
                      <div>
                        <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Service</dt>
                        <dd className="mt-1 text-ink-600">{row.service}</dd>
                      </div>
                    )}
                    {row.preferredDate && (
                      <div>
                        <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Preferred date</dt>
                        <dd className="mt-1 flex items-center gap-1.5 text-ink-600">
                          <Calendar className="h-3.5 w-3.5 text-ink-400" aria-hidden /> {row.preferredDate}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[0.72rem] uppercase tracking-wider text-ink-400">Received</dt>
                      <dd className="mt-1 text-ink-600">{formatDate(row.createdAt)}</dd>
                    </div>
                  </dl>

                  {(row.message || row.notes) && (
                    <div className="mt-6 rounded-xl bg-ink-50 p-5">
                      <p className="text-[0.72rem] uppercase tracking-wider text-ink-400">
                        {kind === 'messages' ? 'Message' : 'Notes'}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink-600">
                        {row.message || row.notes}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={`mailto:${row.email}`} className="btn btn-gold btn-sm">
                      <Mail className="h-3.5 w-3.5" aria-hidden /> Reply
                    </a>
                    <button type="button" onClick={() => markHandled(row.id, handled)} className="btn btn-outline btn-sm">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      {handled ? 'Mark as pending' : 'Mark as handled'}
                    </button>
                    <button type="button" onClick={() => remove(row.id)} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
