'use server'

import { headers } from 'next/headers';
import { TweetUrlSchema, ServiceResponse, TweetVideoEntity } from '@/lib/core/schemas';
import { getTweetCached } from '@/lib/infrastructure/twitter-repository';
import { rateLimit } from '@/lib/utils/rate-limit';
import { getClientIp } from '@/lib/utils/request-ip';

// Public, unauthenticated endpoint that triggers an outbound upstream fetch.
// Cap distinct-request throughput per IP so it can't be abused as an open
// proxy / cost sink, and so upstream rate-limit (403/429) amplification is
// bounded.
const RESOLVE_LIMIT = 20;           // max analyses per IP per window
const RESOLVE_WINDOW_MS = 60_000;   // 1 minute

export async function resolveTweetAction(rawUrl: string): Promise<ServiceResponse<TweetVideoEntity>> {
  try {
    // 0. Rate limit per client IP (before any work, so invalid spam is capped too).
    const ip = getClientIp(await headers());
    if (!rateLimit(`resolve:${ip}`, RESOLVE_LIMIT, RESOLVE_WINDOW_MS).allowed) {
      return { success: false, error: "Çok fazla istek gönderildi. Lütfen biraz bekleyip tekrar deneyin." };
    }

    // 1. Input Validasyonu (Zod)
    const validationResult = TweetUrlSchema.safeParse(rawUrl);
    if (!validationResult.success) {
      return { success: false, error: "Geçersiz link formatı." };
    }

    // 2. ID Extraction
    const url = validationResult.data;
    const tweetIdMatch = url.match(/(?:status\/)(\d+)/);
    const tweetId = tweetIdMatch ? tweetIdMatch[1] : null;

    if (!tweetId) {
      return { success: false, error: "Tweet ID'si bulunamadı." };
    }

    // 3. Veri Çekme (Cache Strategy Devrede)
    // Cache miss durumunda API'ye gider, Cache hit durumunda direkt döner.
    const data = await getTweetCached(tweetId);

    if (!data) {
      return { success: false, error: "Video bulunamadı veya tweet silinmiş." };
    }

    // 4. Cache Bilgisi ekleyerek dön (Debug için faydalı olabilir)
    return { success: true, data, fromCache: true };

  } catch (error) {
    console.error('Resolve Error:', error);
    return { success: false, error: "Sistemde geçici bir hata oluştu." };
  }
}