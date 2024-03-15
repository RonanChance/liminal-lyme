import OpenAI from "openai";
import { O as OPENAI_KEY } from "../../../../../chunks/private.js";
async function GET({ url }) {
  const threadId = url.searchParams.get("threadId");
  const runId = url.searchParams.get("runId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  if (!runId) {
    return Response.json({ error: "No run id provided" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return Response.json({ run });
  } catch (error) {
    return Response.json({ error });
  }
}
export {
  GET
};
