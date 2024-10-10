import PocketBase from 'pocketbase';
/** @type {import('./$types').PageLoad} */
export async function load() {
    const pb = new PocketBase('https://pb.liminallyme.com/');
    const record = await pb.collection('treatments').getOne('amwn40redqqvogo');
	return record;
}