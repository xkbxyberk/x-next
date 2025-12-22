import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basit In-Memory Store (Edge Runtime'da her instance için ayrı çalışır)
// Dağıtık bir saldırıda %100 koruma sağlamaz ama "dumb bot"ları bedavaya engeller.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const LIMIT = 10; // 1 Dakikada maksimum istek
const WINDOW = 60 * 1000; // 1 Dakika

export function middleware(request: NextRequest) {
  // Sadece server action'ları veya API route'ları koru
  if (request.nextUrl.pathname.startsWith('/api') || request.method === 'POST') {
    
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    // Zaman penceresi dolduysa sıfırla
    if (now - record.lastReset > WINDOW) {
      record.count = 0;
      record.lastReset = now;
    }

    // Limit kontrolü
    if (record.count >= LIMIT) {
      return new NextResponse(
        JSON.stringify({ error: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    record.count++;
    rateLimitMap.set(ip, record);
    
    // Memory Leak önlemi: Map çok şişerse temizle
    if (rateLimitMap.size > 10000) rateLimitMap.clear();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};