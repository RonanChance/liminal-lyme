import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ event, locals }) => {
    // TODO: improve this check
    if (event.locals.email.length <= 3){
        console.log("locals email", locals.email)
        throw redirect(302, "/auth")
    } else {
        console.log("locals email", locals.email)
    }
};