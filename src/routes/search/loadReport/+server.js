import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    let { id } = await request.json();
    try {
        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
        const record = await pb.collection('reports').getOne(id);
        
        let orderList = record.order.split(",");
        let results = orderList.map(item => {
            let formattedItem = item.replace(/\s+/g, '_').toLowerCase();
            return {
              'title': item,
              'expanded': false,
              'result': record[formattedItem]
            };
        });

        return new Response(JSON.stringify({ success: true, results: results, 'AISelectedItem': record.treatment, 'AISelectedIllness': record.illness, 'AIOptionalText': record.optional }));
    } catch (e) {
        console.log('Record request failed', e);
        return new Response(JSON.stringify({success: false}))
    }
};