import PocketBase from 'pocketbase';

export const handle = async ({ event, resolve, cookies }) => {
    event.locals.pb = new PocketBase('https://pb.liminallyme.com');
    const response = await resolve(event);
    return response;
};