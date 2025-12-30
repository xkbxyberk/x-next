'use server';

import { sendTelegramNotification } from '@/lib/utils/telegram';

type NotifyParams = {
    tweetId: string;
    authorName: string;
    format?: string;
};

export async function sendDownloadNotification({ tweetId, authorName, format = 'video' }: NotifyParams) {
    try {
        const message = `🚀 <b>ACTUAL DOWNLOAD STARTED!</b>\n\nTweet ID: ${tweetId}\nAuthor: ${authorName}\nType: ${format}`;
        await sendTelegramNotification(message);
        return { success: true };
    } catch (error) {
        console.error('Download notification failed:', error);
        // Bildirim hatası kullanıcıya yansımasın
        return { success: false };
    }
}
