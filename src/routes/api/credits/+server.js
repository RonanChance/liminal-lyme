import { SECRET_EMAIL, SECRET_PASSWORD } from '$env/static/private'
import PocketBase from 'pocketbase';

export async function POST({request}) {
    let pb = new PocketBase('https://pb.openrxn.com');
    const authData = await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);

    const { email, subtract } = await request.json();

    let credits;
    try {
        const filterQuery = 'email=\"' + email + "\"";
        const record = await pb.collection('user_data').getFirstListItem(filterQuery);
        if (record) {
            if (subtract) {
                let results = await pb.collection('user_data').update(record.id, { credits_remaining: record.credits_remaining - 1 });
                credits = record.credits_remaining - 1;
            } else {
                credits = record.credits_remaining;
            }
        }
    } catch (error) {
        // failed to get credits, so just give the user some
        // this should not happen, but prioritize getting access to the user
        const data = {
            "email": email,
            "credits_remaining": 50,
        };
        const record = await pb.collection('user_data').create(data);
        return Response.json({credits_remaining: 50});
    }

    return Response.json({credits_remaining: credits })
}