import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    const { userId, username } = await request.json();
    try {
        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
        await pb.collection("users").update(userId, { username });
        return new Response(JSON.stringify({success: true}))
    } catch (e) {
        console.log('Username update failed', e);
        return new Response(JSON.stringify({success: false}))
    }
};