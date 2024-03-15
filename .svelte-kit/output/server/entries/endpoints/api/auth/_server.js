import { r as redirect } from "../../../../chunks/index.js";
import { S as SECRET_EMAIL, a as SECRET_PASSWORD } from "../../../../chunks/private.js";
import PocketBase from "pocketbase";
async function POST({ request, cookies }) {
  const { email, token } = await request.json();
  if (!email) {
    return Response.json({ error: "No login info" }, { status: 400 });
  }
  let pb = new PocketBase("https://pb.openrxn.com");
  await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
  try {
    const filterQuery = 'email="' + email + '"';
    const record = await pb.collection("user_data").getFirstListItem(filterQuery);
    if (record) {
    }
  } catch (error) {
    const data = {
      "email": email,
      "searches_remaining": 100
    };
    await pb.collection("user_data").create(data);
  }
  cookies.set("pb_auth", JSON.stringify({ token }), { path: "/", httpOnly: true, secure: false });
  cookies.set("email", email, { path: "/", httpOnly: false, secure: false });
  throw redirect(303, "/home");
}
export {
  POST
};
