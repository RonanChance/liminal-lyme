import { r as redirect } from "../../../chunks/index.js";
const load = async ({ request, locals, cookies }) => {
  locals.pb.authStore.clear();
  cookies.set("pb_auth", JSON.stringify({ token: "" }), { path: "/", httpOnly: true, secure: false });
  cookies.set("email", "", { path: "/", httpOnly: false, secure: false });
  throw redirect(302, "/auth");
};
export {
  load
};
