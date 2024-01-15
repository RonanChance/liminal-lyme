import { redirect } from "@sveltejs/kit";

export async function POST({request, cookies }) {
    console.log("Authenticating + Redirecting Soon")
    const { email, token } = await request.json();
    console.log("in server:", email);

    if (!email) {
        return Response.json({error: 'No login info'}, {status: 400});
    }
    
    console.log("SETTING COOKIES")
    console.log("TOKEN:", token)
    cookies.set('pb_auth', JSON.stringify({ token: token }), {path: '/', httpOnly: true, secure: false});
    cookies.set('email', email, {path: '/', httpOnly: false, secure: false});

    throw redirect(303, '/chat');
}