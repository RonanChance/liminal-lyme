import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD, TELEGRAM_BOT_TOKEN, TELEGRAM_USER_ID } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_USER_ID,
            text: message,
        }),
    });
    return response.json();
}

export const POST = async ({ request }) => {
    const { record } = await request.json();
    try {
        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
        const result = await pb.collection('tree').create(record);
        try {
            let message = '';
            if (result.username) message += `User: ${result.username}\n`;
            if (result.name) message += `Added: ${result.name}\n`;
            if (result.link_text) message += `LinkText: ${result.link_text}\n`;
            if (result.link) message += `Link: ${result.link}`;
            await sendTelegramMessage(message);
        } catch (e) {
            console.log("Telegram failed", e);
        }
        return new Response(JSON.stringify({success: true, record: result}))
    } catch (e) {
        return new Response(JSON.stringify({success: false}))
    }
};