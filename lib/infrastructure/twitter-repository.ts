import { unstable_cache } from 'next/cache';
import { TweetVideoEntity, VideoVariantEntity } from '@/lib/core/schemas';
import { sendTelegramNotification } from '@/lib/utils/telegram';

import { getRandomHeaders } from '@/lib/utils/headers';

// Token hesaplama
const getToken = (id: string) => {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0)+/g, '');
};

const fetchTweetDataInternal = async (tweetId: string): Promise<TweetVideoEntity | null> => {
  const token = getToken(tweetId);
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`;

  // Header rotasyonu uygulanıyor (Server Camouflage)
  const headers = getRandomHeaders();
  console.log(`🔍 [TwitterFetch] İstek gönderiliyor: ${tweetId} (UA: ${headers['User-Agent'].substring(0, 30)}...)`);

  try {
    const response = await fetch(url, {
      headers: headers,
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`❌ [TwitterFetch] API Hatası: ${response.status}`);

      // WATCHDOG: Kritik Hata Bildirimi (403 veya 429)
      if (response.status === 403 || response.status === 429) {
        sendTelegramNotification(`🚨 <b>CRITICAL ALERT</b>\n\nStatus: ${response.status}\nTweet ID: ${tweetId}`);
      }

      return null;
    }

    const data = await response.json();
    if (!data) return null;

    // --- AKILLI PARSING (Smart Parsing V2) ---
    // Root ve Legacy ayırımı
    const root = data.tweet || data;
    const legacy = root.legacy || root;

    // 1. MEDYA BULUCU FONKSİYON (Helper)
    // Karmaşık yapılar içinde videoyu arar
    const findVideoInObject = (obj: any): any => {
      // Olası medya dizilerini birleştir
      const candidates = [
        ...(obj?.extended_entities?.media || []),
        ...(obj?.entities?.media || []),
        ...(obj?.mediaDetails || []) // Bazı yeni formatlarda bu isimle gelir
      ];

      // Video veya GIF ara.
      // KRİTİK GÜNCELLEME: Sadece type'a bakma, 'video_info' var mı diye de bak.
      return candidates.find((m: any) =>
        m.type === 'video' ||
        m.type === 'animated_gif' ||
        !!m.video_info // Type 'photo' olsa bile video_info varsa videodur.
      );
    };

    // 2. VİDEOYU ARA
    let videoMedia = findVideoInObject(legacy) || findVideoInObject(root);
    let targetTweet = root; // Hangi tweet'ten veri aldığımızı bilelim (Yazar bilgisi için)

    // Eğer ana tweette video yoksa, ALINTILANMIŞ (Quoted) tweet'e bak
    if (!videoMedia && (root.quoted_status || root.quoted_status_result)) {
      console.log('🔄 [TwitterFetch] Ana tweette video yok, alıntılanan tweet kontrol ediliyor...');
      const quoted = root.quoted_status || root.quoted_status_result?.result;
      if (quoted) {
        const quotedLegacy = quoted.legacy || quoted;
        videoMedia = findVideoInObject(quotedLegacy) || findVideoInObject(quoted);
        if (videoMedia) {
          targetTweet = quotedLegacy; // Yazar bilgisini alıntılanan kişiden alacağız
        }
      }
    }

    if (!videoMedia) {
      console.error('⚠️ [TwitterFetch] Video objesi hiçbir yerde bulunamadı.');
      // Debug için ham medyanın ilk elemanını görelim
      const debugMedia = legacy.extended_entities?.media || [];
      if (debugMedia.length > 0) {
        console.log('Mevcut Medya (Video İçermiyor):', JSON.stringify(debugMedia[0]).substring(0, 150));
      }
      return null;
    }

    // Helper to guess resolution from bitrate with granular ranges and "Plus" tiers
    const getQualityLabel = (bitrate: number): string => {
      if (bitrate === 0) return 'GIF';

      // 1080p & 1080p+
      if (bitrate >= 4000000) return '1080p+';
      if (bitrate >= 2000000) return '1080p';

      // 720p & 720p+
      if (bitrate >= 1800000) return '720p+';
      if (bitrate >= 1200000) return '720p';

      // 540p & 480p
      if (bitrate >= 900000) return '540p';
      if (bitrate >= 600000) return '480p';

      // 360p
      if (bitrate >= 350000) return '360p';

      // 240p (Low data)
      return '240p';
    };

    const isAnimatedGif = videoMedia.type === 'animated_gif';

    // 3. VARYANTLARI AYIKLA
    const variants: VideoVariantEntity[] = (videoMedia.video_info?.variants || [])
      .filter((v: any) =>
        (v.content_type === 'video/mp4' || v.content_type === 'application/x-mpegURL') &&
        (v.bitrate > 0 || isAnimatedGif) // Bitrate 0 olanları sadece GIF ise kabul et
      )
      .map((v: any) => ({
        bitrate: v.bitrate || 0,
        contentType: v.content_type,
        url: v.url,
        quality: getQualityLabel(v.bitrate || 0)
      }))
      .sort((a: VideoVariantEntity, b: VideoVariantEntity) => b.bitrate - a.bitrate);

    console.log(`✅ [TwitterFetch] Başarılı! ${variants.length} varyant bulundu.`);

    // 4. METADATA ÇIKARIMI
    // Hedef tweet (quoted veya original) üzerinden bilgileri al
    const userObj =
      targetTweet.user ||
      targetTweet.core?.user_results?.result?.legacy ||
      legacy.user || // Fallback olarak ana tweet sahibini al
      {};

    const authorName = userObj.name || 'X Kullanıcısı';
    const authorScreenName = userObj.screen_name || 'unknown';
    const authorAvatar = userObj.profile_image_url_https || '';

    const text = targetTweet.full_text || targetTweet.text || legacy.full_text || '';
    const createdAt = targetTweet.created_at || legacy.created_at || new Date().toISOString();

    // WATCHDOG: Başarılı İndirme Bildirimi BURADAN KALDIRILDI (Refactor)
    // Artık sadece kullanıcı indirme butonuna bastığında notify-download.ts üzerinden gidecek.

    return {
      id: root.id_str || tweetId,
      text: text,
      createdAt: createdAt,
      author: {
        name: authorName,
        screenName: authorScreenName,
        avatarUrl: authorAvatar,
      },
      media: {
        thumbnailUrl: videoMedia.media_url_https,
        variants,
      },
      statistics: {
        likes: root.favorite_count || legacy.favorite_count || 0,
        views: root.views?.count || 0
      }
    };

  } catch (err) {
    console.error('🔥 [TwitterFetch] Kritik Hata:', err);
    return null;
  }
};

// CACHING
export const getTweetCached = unstable_cache(
  async (tweetId: string) => fetchTweetDataInternal(tweetId),
  ['tweet-data-v4'], // Cache key: v4 (Temiz sayfa)
  {
    revalidate: 3600,
    tags: ['tweets']
  }
);