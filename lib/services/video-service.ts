// lib/services/video-service.ts
import { TwitterClient } from '../infrastructure/twitter-client';
import { TweetVideo, ServiceResult, VideoVariant } from '../core/types';

export class VideoService {
  
  /**
   * URL'den ID'yi ayıklar.
   * Örn: https://x.com/username/status/123456 -> 123456
   */
  private static extractTweetId(url: string): string | null {
    const regex = /(?:twitter|x)\.com\/(?:[^/]+)\/status\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Ana Use Case: Video Bilgilerini Getir
   */
  public static async getVideoInfo(url: string): Promise<ServiceResult<TweetVideo>> {
    try {
      const tweetId = this.extractTweetId(url);
      
      if (!tweetId) {
        return { success: false, error: 'Geçersiz Twitter/X linki.' };
      }

      // Altyapı katmanından veriyi çek
      const rawData = await TwitterClient.getTweetDetails(tweetId);

      // Veriyi işle ve temizle (Parsing)
      const result = rawData?.data?.tweetResult?.result;
      
      if (!result) {
        return { success: false, error: 'Tweet bulunamadı.' };
      }

      // Eski tweetlerde 'legacy', yenilerde farklı alanlar olabilir, güvenli erişim:
      const legacy = result.legacy || result.tweet?.legacy;
      const user = result.core?.user_results?.result?.legacy || result.tweet?.core?.user_results?.result?.legacy;

      // Medya kontrolü
      const media = legacy?.extended_entities?.media?.[0];
      if (!media || (media.type !== 'video' && media.type !== 'animated_gif')) {
        return { success: false, error: 'Bu gönderide video bulunamadı.' };
      }

      // Video varyantlarını filtrele (sadece .mp4 olanları al, m3u8 istemiyoruz)
      const variants: VideoVariant[] = media.video_info.variants
        .filter((v: any) => v.content_type === 'video/mp4')
        .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0)); // En yüksek kalite en üstte

      const cleanData: TweetVideo = {
        id: tweetId,
        text: legacy.full_text,
        createdAt: legacy.created_at,
        user: {
          name: user.name,
          screen_name: user.screen_name,
          avatar_url: user.profile_image_url_https,
        },
        media: {
          thumbnail_url: media.media_url_https,
          variants: variants,
        },
      };

      return { success: true, data: cleanData };

    } catch (error: any) {
      console.error('Service Error:', error);
      return { success: false, error: error.message || 'Bir hata oluştu.' };
    }
  }
}