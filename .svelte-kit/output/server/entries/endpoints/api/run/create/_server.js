import OpenAI from "openai";
import { O as OPENAI_KEY, b as OPENAI_ID } from "../../../../../chunks/private.js";
async function GET({ url }) {
  const threadId = url.searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: OPENAI_ID
    });
    return Response.json({ run });
  } catch (error) {
    return Response.json({ error });
  }
}
export {
  GET
};
