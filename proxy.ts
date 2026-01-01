import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Tüm desteklenen diller (40 Dil)
const locales = [
  'en', 'tr', 'ar', 'bg', 'bn', 'br', 'cs', 'da', 'de', 'el',
  'es', 'fa', 'fi', 'fr', 'he', 'hi', 'hr', 'hu', 'id', 'it',
  'ja', 'km', 'ko', 'ms', 'ne', 'nl', 'no', 'pl', 'pt', 'ro',
  'ru', 'sr', 'sv', 'sw', 'th', 'tl', 'uk', 'ur', 'vi', 'zh'
];

const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Statik dosyaları, resimleri ve API yollarını yoksay
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/private') ||
    pathname.match(/\.(png|jpg|jpeg|gif|ico|svg|avif|webp|css|js|txt|xml|json)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Halihazırda bir dil parametresi var mı? (/en/..., /tr/...)
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. Dil yoksa tespit et ve yönlendir
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Mevcut url'i koruyarak yeni locale ekle
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next).*)'],
};