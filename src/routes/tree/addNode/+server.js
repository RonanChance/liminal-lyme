import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    const { record } = await request.json();
    try {
        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
        const result = await pb.collection('tree').create(record);
        return new Response(JSON.stringify({success: true, record: result}))
    } catch (e) {
        return new Response(JSON.stringify({success: false}))
    }
};