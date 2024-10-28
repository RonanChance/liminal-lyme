import PocketBase from 'pocketbase';
/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('https://pb.liminallyme.com/');
    const records = await pb.collection('tree').getFullList();
	return { records };
}