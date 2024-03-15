import OpenAI from "openai";
import { O as OPENAI_KEY } from "../../../../../chunks/private.js";
async function GET({ url }) {
  const threadId = url.searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const response = await openai.beta.threads.messages.list(threadId);
    return Response.json({ messages: response.data });
  } catch (e) {
    return Response.json({ error: e });
  }
}
export {
  GET
};
