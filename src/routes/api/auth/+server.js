import { redirect } from "@sveltejs/kit";
import { SECRET_EMAIL, SECRET_PASSWORD } from '$env/static/private';
import PocketBase from 'pocketbase';

export async function POST({request, cookies }) {
    // // console.log("Authenticating + Redirecting Soon")
    const { email, token } = await request.json();
    console.log("in server:", email);

    if (!email) {
        return Response.json({error: 'No login info'}, {status: 400});
    }

    let pb = new PocketBase('https://pb.openrxn.com');
    const authData = await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
    console.log(authData);
    console.log("GOING TO CHECK CREDITS")

    try {
        const filterQuery = 'email=\"' + email + "\"";
        const record = await pb.collection('user_data').getFirstListItem(filterQuery);
        if (record) {
            console.log("Record with the specified email exists");
        }
    } catch (error) {
        console.log("FAILED TO GET RECORD")
        const data = {
            "email": email,
            "credits_remaining": 200,
        };
        const record = await pb.collection('user_data').create(data);
    }

    console.log("SETTING COOKIES")
    // console.log("TOKEN:", token)
    cookies.set('pb_auth', JSON.stringify({ token: token }), {path: '/', httpOnly: true, secure: false});
    cookies.set('email', email, {path: '/', httpOnly: false, secure: false});

    throw redirect(303, '/home');
}