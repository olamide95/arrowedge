import 'server-only';

/**
 * Per-IP throttle for the public form endpoints.
 *
 * In-memory, so it resets on deploy and is per-instance rather than global.
 * That is acceptable here: the job is to stop a single bot hammering the
 * forms, not to enforce a precise quota. If abuse becomes a real problem,
 * move the counter to Firestore or a dedicated service.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - bucket.count };
}

/** Best-effort client IP from the proxy headers Firebase/Cloud Run set. */
export function clientIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}
