import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ request, locals, cookies }) => {
    console.log(request.headers.get('cookie'))
    locals.pb.authStore.clear();
    cookies.set('pb_auth', JSON.stringify({ token: '' }), {path: '/', httpOnly: true, secure: false});
    cookies.set('email', '', {path: '/', httpOnly: false, secure: false});
    console.log("LOGGING OUT")
    throw redirect(302, "/")
};