import OpenAI from "openai";
import { O as OPENAI_KEY } from "../../../../../chunks/private.js";
async function POST({ request }) {
  const { message, threadId, roleType } = await request.json();
  if (!threadId || !message) {
    return Response.json({ error: "No thread ID or no Message" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const threadMessages = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });
    return Response.json(threadMessages);
  } catch (error) {
    return Response.json({ error });
  }
}
export {
  POST
};
