import { TweetVideoEntity, VideoVariantEntity } from '@/lib/core/schemas';

// Token hesaplama (Server tarafı ile aynı mantık)
const getToken = (id: string) => {
    return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0)+/g, '');
};

export const fetchTweetClientSide = async (tweetId: string): Promise<TweetVideoEntity | null> => {
    const token = getToken(tweetId);
    const url = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&lang=en&token=${token}`;

    console.log(`🌐 [ClientFetch] Tarayıcıdan deneniyor: ${tweetId}`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.warn(`⚠️ [ClientFetch] İstek başarısız oldu: ${response.status} (Muhtemelen CORS veya Adblocker)`);
            return null;
        }

        const data = await response.json();
        if (!data) return null;

        // --- PARSING MANTIĞI (Repo ile birebir aynı olmalı) ---
        // Root ve Legacy ayırımı
        const root = data.tweet || data;
        const legacy = root.legacy || root;

        // Medya bulucu
        const findVideoInObject = (obj: any): any => {
            const candidates = [
                ...(obj?.extended_entities?.media || []),
                ...(obj?.entities?.media || []),
                ...(obj?.mediaDetails || [])
            ];

            return candidates.find((m: any) =>
                m.type === 'video' ||
                m.type === 'animated_gif' ||
                !!m.video_info
            );
        };

        // Videoyu ara
        let videoMedia = findVideoInObject(legacy) || findVideoInObject(root);
        let targetTweet = root;

        // Alıntılanmış (Quoted) tweet kontrolü
        if (!videoMedia && (root.quoted_status || root.quoted_status_result)) {
            const quoted = root.quoted_status || root.quoted_status_result?.result;
            if (quoted) {
                const quotedLegacy = quoted.legacy || quoted;
                videoMedia = findVideoInObject(quotedLegacy) || findVideoInObject(quoted);
                if (videoMedia) {
                    targetTweet = quotedLegacy;
                }
            }
        }

        if (!videoMedia) {
            console.warn('⚠️ [ClientFetch] Client tarafında video bulunamadı, sunucuya devrediliyor.');
            return null;
        }

        // Varyantları ayıkla
        const variants: VideoVariantEntity[] = (videoMedia.video_info?.variants || [])
            .filter((v: any) =>
                v.content_type === 'video/mp4' ||
                v.content_type === 'application/x-mpegURL'
            )
            .map((v: any) => ({
                bitrate: v.bitrate || 0,
                contentType: v.content_type,
                url: v.url,
                quality: v.bitrate ? `${Math.round(v.bitrate / 1000)}k` : 'Gif'
            }))
            .sort((a: VideoVariantEntity, b: VideoVariantEntity) => b.bitrate - a.bitrate);

        // Metadata
        const userObj =
            targetTweet.user ||
            targetTweet.core?.user_results?.result?.legacy ||
            legacy.user ||
            {};

        const text = targetTweet.full_text || targetTweet.text || legacy.full_text || '';
        const createdAt = targetTweet.created_at || legacy.created_at || new Date().toISOString();

        console.log(`✅ [ClientFetch] Başarılı! (Local IP kullanıldı)`);

        return {
            id: root.id_str || tweetId,
            text: text,
            createdAt: createdAt,
            author: {
                name: userObj.name || 'X Kullanıcısı',
                screenName: userObj.screen_name || 'unknown',
                avatarUrl: userObj.profile_image_url_https || '',
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
        console.warn('⚠️ [ClientFetch] Hata oluştu (Fallback tetiklenecek):', err);
        return null;
    }
};
