import PocketBase from "pocketbase";
import "./index.js";
const handle = async ({ event, resolve, cookies }) => {
  event.locals.pb = new PocketBase("https://pb.openrxn.com");
  const response = await resolve(event);
  return response;
};
export {
  handle
};
