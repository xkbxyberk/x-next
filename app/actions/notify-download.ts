'use server';

import { headers } from 'next/headers';
import { sendTelegramNotification } from '@/lib/utils/telegram';
import { rateLimit } from '@/lib/utils/rate-limit';
import { getClientIp } from '@/lib/utils/request-ip';

type NotifyParams = {
    tweetId: string;
    authorName: string;
    format?: string;
};

// This action is a public, unauthenticated endpoint. Everything below treats
// its arguments as untrusted.
const NOTIFY_LIMIT = 30;            // max notifications per IP per window
const NOTIFY_WINDOW_MS = 60_000;    // 1 minute
const MAX_AUTHOR_LEN = 100;
const ALLOWED_FORMATS = new Set(['video', 'audio', 'gif']);

// Escape the characters Telegram's HTML parse_mode treats as markup, so a
// crafted authorName cannot inject tags/links into the alert channel or break
// the message (which would silently drop legitimate alerts). Unicode/emoji are
// preserved.
const escapeHtml = (s: string): string =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function sendDownloadNotification({ tweetId, authorName, format = 'video' }: NotifyParams) {
    try {
        // 1. Rate limit per client IP (best-effort abuse/flood protection).
        const ip = getClientIp(await headers());
        if (!rateLimit(`notify:${ip}`, NOTIFY_LIMIT, NOTIFY_WINDOW_MS).allowed) {
            return { success: false };
        }

        // 2. Validate & sanitize untrusted input.
        const safeTweetId = String(tweetId ?? '');
        if (!/^\d{1,25}$/.test(safeTweetId)) {
            return { success: false };
        }
        const safeFormat = ALLOWED_FORMATS.has(format) ? format : 'video';
        const safeAuthor =
            escapeHtml(String(authorName ?? '').slice(0, MAX_AUTHOR_LEN)) || 'unknown';

        // safeTweetId is digits-only and safeFormat is allowlisted, so both are
        // safe to interpolate directly; safeAuthor is HTML-escaped above.
        const message = `🚀 <b>ACTUAL DOWNLOAD STARTED!</b>\n\nTweet ID: ${safeTweetId}\nAuthor: ${safeAuthor}\nType: ${safeFormat}`;
        await sendTelegramNotification(message);
        return { success: true };
    } catch (error) {
        console.error('Download notification failed:', error);
        // Bildirim hatası kullanıcıya yansımasın
        return { success: false };
    }
}
