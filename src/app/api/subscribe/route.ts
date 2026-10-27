import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const limit = rateLimit(`subscribe:${clientIp(req)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many attempts. Try again shortly.' }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  const email = (body.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    // The email is the document id, so re-subscribing updates rather than
    // duplicating — and the same address can never appear twice on the list.
    const ref = adminDb.collection('subscribers').doc(email);
    const existing = await ref.get();

    if (existing.exists && existing.data()?.active) {
      return NextResponse.json({ ok: true, message: 'You are already on the list.' });
    }

    await ref.set(
      { email, active: true, createdAt: existing.data()?.createdAt ?? Date.now(), updatedAt: Date.now() },
      { merge: true },
    );
    return NextResponse.json({ ok: true, message: 'You are on the list.' });
  } catch (err) {
    console.error('[subscribe] write failed:', (err as Error).message);
    return NextResponse.json({ error: 'Could not subscribe just now. Please try later.' }, { status: 500 });
  }
}
