import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ request, locals }) => {
    console.log(request.headers.get('cookie'))
    const pb_auth_cookie = request.headers.get('cookie') ?? null;
    locals.pb.authStore.loadFromCookie(pb_auth_cookie);

    if (!locals.pb.authStore.isValid){
        console.log("INVALID authstore in +page.server.js chat")
        throw redirect(302, "/auth")
    } else {
        console.log("no issues in +page.server.js chat")
    }
};