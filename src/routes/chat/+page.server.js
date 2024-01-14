import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
    if (!locals.email){
        console.log("locals email", locals.email)
        throw redirect(302, "/auth")
    } else {
        console.log("locals email", locals.email)
    }
};