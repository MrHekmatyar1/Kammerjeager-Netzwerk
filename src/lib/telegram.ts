export async function sendTelegramMessage(chatId: string, message: string) {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!TELEGRAM_BOT_TOKEN) {
        console.warn('No Telegram Bot Token provided. Skipping message.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
                link_preview_options: { is_disabled: true },
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('[Telegram API Error]:', errorText);
            return false;
        }

        return true;
    } catch (e) {
        console.error('[Telegram Error]:', e);
        return false;
    }
}
