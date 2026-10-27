import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a minute and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Returns 200 deliberately: telling a scraper it was caught invites a retry
  // with the field removed.
  if (body.company_website) return NextResponse.json({ ok: true });

  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim().toLowerCase();
  const message = (body.message ?? '').trim();

  if (name.length < 2)          return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!EMAIL.test(email))       return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (message.length < 10)      return NextResponse.json({ error: 'Please tell us a little more.' }, { status: 400 });
  if (message.length > 5000)    return NextResponse.json({ error: 'That message is too long.' }, { status: 400 });

  try {
    await adminDb.collection('messages').add({
      name: name.slice(0, 120),
      email,
      phone: (body.phone ?? '').trim().slice(0, 40),
      subject: (body.subject ?? 'General enquiry').trim().slice(0, 200),
      message,
      createdAt: Date.now(),
      read: false,
      // Kept for abuse investigation only; never surfaced in the UI.
      meta: { ip, userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? '' },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] write failed:', (err as Error).message);
    return NextResponse.json(
      { error: 'We could not send that just now. Please call the office on +234 803 598 9359.' },
      { status: 500 },
    );
  }
}
