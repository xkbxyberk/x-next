// Best-effort client IP extraction from proxy headers.
//
// The app sits behind a reverse proxy (Hetzner). Ensure that proxy sets a
// trustworthy `X-Forwarded-For` (client IP as the left-most entry) or
// `X-Real-IP`; otherwise these headers can be spoofed by the client. We take
// the left-most XFF hop, falling back to X-Real-IP, then to a shared
// 'unknown' bucket (which fails safe toward rate-limiting).
export function getClientIp(h: Headers): string {
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }

  const real = h.get('x-real-ip');
  if (real) return real.trim();

  return 'unknown';
}
