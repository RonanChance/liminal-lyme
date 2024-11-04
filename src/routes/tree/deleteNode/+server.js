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
    const { nodeId } = await request.json();
    // check with server to ensure the node is allowed to be deleted
    await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
    const record = await pb.collection('tree').getOne(nodeId);
    if (record.verified === false) {
        try {
            await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
            await pb.collection('tree').delete(nodeId);
            try {
                let message = '';
                if (record.name) message += `Removed: ${record.name}\n`;
                if (record.link_text) message += `Text: ${record.link_text}\n`;
                if (record.link) message += `Link: ${record.link}`;
                console.log(message);
                await sendTelegramMessage(message);
            } catch (e) {
                console.log("Telegram failed", e);
            }
            return new Response(JSON.stringify({success: true}))
        } catch (e) {
            return new Response(JSON.stringify({success: false}))
        }
    }
    return new Response(JSON.stringify({success: false}))
};