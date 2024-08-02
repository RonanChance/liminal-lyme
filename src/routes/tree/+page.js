import PocketBase from 'pocketbase';
/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('https://data.liminallyme.com/');
    const record = await pb.collection('treatments').getOne('tioht06i7hl8dfp');
	return record;
}