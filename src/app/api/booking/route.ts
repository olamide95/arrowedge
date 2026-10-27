import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`booking:${ip}`, 4, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  if (body.company_website) return NextResponse.json({ ok: true }); // honeypot

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const service = (body.service ?? '').trim();

  if (name.length < 2)     return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!EMAIL.test(email))  return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!service)            return NextResponse.json({ error: 'Please choose a service.' }, { status: 400 });

  try {
    await adminDb.collection('bookings').add({
      name: name.slice(0, 120),
      email,
      phone: (body.phone ?? '').trim().slice(0, 40),
      company: (body.company ?? '').trim().slice(0, 200),
      service: service.slice(0, 120),
      preferredDate: (body.preferredDate ?? '').slice(0, 20),
      notes: (body.notes ?? '').trim().slice(0, 3000),
      status: 'new',
      createdAt: Date.now(),
      meta: { ip },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[booking] write failed:', (err as Error).message);
    return NextResponse.json(
      { error: 'We could not submit that just now. Please call +234 803 598 9359.' },
      { status: 500 },
    );
  }
}
