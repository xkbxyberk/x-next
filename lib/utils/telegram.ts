export const sendTelegramNotification = async (message: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('⚠️ Telegram Watchdog: Token veya Chat ID eksik, bildirim gönderilemedi.');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    // Fire-and-forget: await kullanmıyoruz veya sonucu beklemiyoruz,
    // ancak promise rejection'ı yakalamak için catch ekliyoruz.
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML', // İsteğe bağlı, HTML formatı için
      }),
    }).catch((err) => {
      console.error('⚠️ Telegram Watchdog Hatası (Fetch):', err);
    });
  } catch (error) {
    // Senkron hataları yakala (nadiren olur ama güvenli olsun)
    console.error('⚠️ Telegram Watchdog Hatası:', error);
  }
};
