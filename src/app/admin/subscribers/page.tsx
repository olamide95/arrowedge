'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { Loader2, Download, Trash2, Users } from 'lucide-react';
import { db } from '@/lib/firebase/client';
import { formatDate } from '@/lib/utils';

export default function SubscribersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, 'subscribers'), orderBy('createdAt', 'desc')));
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    })();
  }, []);

  /** CSV export so the list can be taken into whatever sends the mail. */
  function exportCsv() {
    const header = 'email,subscribed_on\n';
    const body = rows
      .filter((r) => r.active !== false)
      // Quote and escape: an address with a comma would otherwise split the row.
      .map((r) => `"${String(r.email).replace(/"/g, '""')}","${formatDate(r.createdAt)}"`)
      .join('\n');

    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arrow-edge-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function remove(id: string) {
    if (!confirm('Remove this subscriber?')) return;
    await deleteDoc(doc(db, 'subscribers', id));
    setRows((r) => r.filter((x) => x.id !== id));
  }

  if (loading) {
    return <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-500" aria-hidden /></div>;
  }

  const active = rows.filter((r) => r.active !== false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.9rem] text-ink-500">
          <span className="font-medium text-ink">{active.length}</span> active
          {rows.length !== active.length && <span className="text-ink-400"> · {rows.length - active.length} unsubscribed</span>}
        </p>
        {active.length > 0 && (
          <button type="button" onClick={exportCsv} className="btn btn-outline btn-md">
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="card grid place-items-center py-24 text-center">
          <Users className="h-10 w-10 text-ink-300" strokeWidth={1.3} aria-hidden />
          <p className="mt-4 font-display text-xl text-ink">Nobody has subscribed yet</p>
          <p className="mt-2 max-w-sm text-[0.9rem] text-ink-500">
            The signup form sits in the footer and at the foot of every article.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-ink-100">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{r.email}</p>
                  <p className="mt-0.5 text-[0.78rem] text-ink-400">
                    Joined {formatDate(r.createdAt)}
                    {r.active === false && <span className="ml-2 text-red-500">· unsubscribed</span>}
                  </p>
                </div>
                <button
                  type="button" onClick={() => remove(r.id)} aria-label={`Remove ${r.email}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
