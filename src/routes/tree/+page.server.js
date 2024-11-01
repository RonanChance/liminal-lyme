import PocketBase from 'pocketbase';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('https://pb.liminallyme.com/');
    await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
    const perPage = 500;  // set this to the max number PocketBase allows per page
    let page = 1;
    let allRecords = [];
    let records;

    // Fetch pages in a loop until no more records are returned
    do {
        records = await pb.collection('tree').getList(page, perPage, { skipTotal: true, sort: 'name' });
        allRecords = allRecords.concat(records.items);
        page++;
    } while (records.items.length === perPage);

    return { records: allRecords };
}