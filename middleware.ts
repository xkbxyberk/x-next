import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// --- Rate Limit Logic ---
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 10;
const WINDOW = 60 * 1000;

function checkRateLimit(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api') || request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > WINDOW) {
      record.count = 0;
      record.lastReset = now;
    }

    if (record.count >= LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    record.count++;
    rateLimitMap.set(ip, record);
    if (rateLimitMap.size > 10000) rateLimitMap.clear();
  }
  return null;
}

// --- i18n Logic ---
const locales = ['en', 'tr'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  // 1. Run Rate Limiter
  const rateLimitResponse = checkRateLimit(request);
  if (rateLimitResponse) return rateLimitResponse;

  // 2. Run i18n Middleware
  const { pathname } = request.nextUrl;

  // Skip internal paths and API (API handled by rate limit, usually doesn't need localization redirect unless specifed)
  // Also skip images, etc matches in config but good to be safe
  if (pathname.startsWith('/api')) return NextResponse.next();

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  // Create redirect response
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Combined matcher: API for rate limit + pages for i18n
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};