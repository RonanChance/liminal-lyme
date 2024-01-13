import { redirect } from "@sveltejs/kit";
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://openrxndatabase.hop.sh");

export const actions = {
    default: async ({ request, cookies, locals, url }) => {
        const form = await request.formData();
        const token = form.get('token');
        const email = form.get('email');

        console.log(token);
        console.log(email);
        
        if (!token || typeof token !== 'string') {
            throw redirect(303, '/auth');
        }

        cookies.set('pb_auth', JSON.stringify({ token: token }), {path: '/'});
        cookies.set('email', email, {path: '/', httpOnly: false, secure: false});
        
        console.log('redirecting to chat')
        throw redirect(303, '/chat');
    }
};