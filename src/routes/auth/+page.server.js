import { redirect } from "@sveltejs/kit";
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://openrxndatabase.hop.sh");

export const actions = {
    default: async ({ request, cookies, locals, url }) => {
        const form = await request.formData();
        const token = form.get('token');
        console.log(token);
        if (!token || typeof token !== 'string') {
            throw redirect(303, '/auth');
        }
        cookies.set('pb_auth', JSON.stringify({ token: token }));
        console.log('redirecting to chat')
        throw redirect(303, '/chat');
    }
};

// export const actions = {
//     auth: async ({ request, locals, url }) => {
        
//         const provider = url.searchParams.get('provider');
//         console.log(provider);

//         if (provider) {
//             const {data, error: err } = await locals.pb.authWithOAuth2({ provider: provider});
//             if (err) {
//                 console.log(err);
//                 return fail(400, {message: "Something went wrong."})
//             }
//         }

//         console.log(pb.authStore.isValid)
//         console.log(pb.authStore.token)

//         console.log("----")
//         console.log(locals.pb.authStore.isValid)

//         throw redirect(303, data.url);


        // const formData = await request.formData()
        // const email = formData.get("email")
        // const password = formData.get("password")
        
        // try {
        //     await locals.pb.collection('users').authWithPassword(email, password)
        // } catch {
        //     console.log('Error logging in')
        //     throw redirect(303, '/')
        // }

        // console.log("redirecting to dashboard")
        // throw redirect(303, "/dashboard");

//     }
// }

