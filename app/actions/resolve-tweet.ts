'use server'

import { TweetUrlSchema, ServiceResponse, TweetVideoEntity } from '@/lib/core/schemas';
import { getTweetCached } from '@/lib/infrastructure/twitter-repository';

export async function resolveTweetAction(rawUrl: string): Promise<ServiceResponse<TweetVideoEntity>> {
  try {
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