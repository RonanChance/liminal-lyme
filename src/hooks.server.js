import PocketBase from 'pocketbase';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

export const handle = async ({ event, resolve, cookies }) => {
    event.locals.pb = new PocketBase('https://pb.openrxn.com');

    const response = await resolve(event);
    return response;
  };