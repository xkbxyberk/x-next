import 'server-only';

// In-memory, fixed-window rate limiter.
// The app runs on a single persistent Node.js process (Hetzner), so a
// process-wide Map is a valid store — no external dependency (Redis) needed.
// Stored on globalThis so it survives dev HMR reloads and stays a single
// instance across the module graph.
//
// NOTE: this is per-process. If you ever scale to multiple Node instances
// behind a load balancer, move this to a shared store.

type Bucket = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  __rateLimitStore?: Map<string, Bucket>;
  __rateLimitLastSweep?: number;
};

const store: Map<string, Bucket> =
  globalForRateLimit.__rateLimitStore ??
  (globalForRateLimit.__rateLimitStore = new Map());

const SWEEP_INTERVAL_MS = 60_000;

// Opportunistically drop expired buckets so the map can't grow unbounded
// as distinct client IPs accumulate. Runs at most once per interval.
function sweep(now: number): void {
  if (now - (globalForRateLimit.__rateLimitLastSweep ?? 0) < SWEEP_INTERVAL_MS) return;
  globalForRateLimit.__rateLimitLastSweep = now;
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

/**
 * Fixed-window rate limit check. Counts one request against `key`.
 *
 * @param key      Unique client key, e.g. `notify:<ip>`.
 * @param limit    Max allowed requests per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterMs: 0 };
}
