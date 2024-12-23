import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';
const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => { 
    let { userId } = await request.json();
    try {
        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);

        const records = await pb.collection('reports').getFullList({
            filter: `userid.id="${userId}"`,
            fields: `id,treatment,illness`,
            sort: '-created'
        });

        return new Response(JSON.stringify({success: true, records}))

    } catch (e) {
        console.log('Error fetching search history', e);
        return new Response(JSON.stringify({success: false}));
    }
}