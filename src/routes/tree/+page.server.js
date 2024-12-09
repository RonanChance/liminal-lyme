import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('https://pb.liminallyme.com/');
    await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);

    const fetchData = async () => {
        const perPage = 500;  // set this to the max number PocketBase allows per page
        let page = 1;
        let allRecords = [];
        let records;

        // fetch pages in a loop until no more records are returned
        do {
            records = await pb.collection('tree').getList(page, perPage, { skipTotal: true, sort: 'name' });
            allRecords = allRecords.concat(records.items);
            page++;
        } while (records.items.length === perPage);

        const recentRecords = await pb.collection('tree').getList(1, 20, { sort: '-created' });

        return { 
            records: allRecords,
            recentRecords: recentRecords.items
        };
    };

    return {
        fetchPromise: fetchData()
    };

}