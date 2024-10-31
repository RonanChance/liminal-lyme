import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    const { nodeId } = await request.json();
    // fact check with server to guarantee
    // that the node is allowed to be deleted
    const record = await pb.collection('tree').getOne(nodeId);
    if (record.verified === false) {
        try {
            await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
            await pb.collection('tree').delete(nodeId);
            return new Response(JSON.stringify({success: true}))
        } catch (e) {
            return new Response(JSON.stringify({success: false}))
        }
    }
    return new Response(JSON.stringify({success: false}))
};

// Convenient way to mass verify items in database
// import PocketBase from 'pocketbase';
// import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

// const pb = new PocketBase("https://pb.liminallyme.com");

// export const POST = async ({ request }) => {
//     try {
//         // Authenticate
//         await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);

//         let page = 1;
//         const perPage = 50; // Adjust based on your preference
//         let records;

//         // Loop through pages to fetch and update all records
//         do {
//             // Fetch records from the 'tree' collection
//             records = await pb.collection('tree').getList(page, perPage, { skipTotal: true });
//             const updates = records.items.map(record => ({
//                 id: record.id,
//                 verified: true // Set verified to true
//             }));

//             // Update records in bulk
//             for (const update of updates) {
//                 await pb.collection('tree').update(update.id, { verified: update.verified });
//             }

//             page++;
//         } while (records.items.length === perPage);

//         return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
//     } catch (e) {
//         console.error("Error updating records:", e);
//         return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//     }
// };