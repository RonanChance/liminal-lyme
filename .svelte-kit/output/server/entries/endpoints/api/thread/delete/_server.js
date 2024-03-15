import OpenAI from "openai";
import { O as OPENAI_KEY } from "../../../../../chunks/private.js";
async function GET(req) {
  const searchParams = req.searchParams;
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread Id provided" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const thread = await openai.beta.threads.del(threadId);
    return Response.json({ thread });
  } catch (e) {
    return Response.json({ error: e });
  }
}
export {
  GET
};
