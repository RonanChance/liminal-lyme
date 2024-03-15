import OpenAI from "openai";
import { O as OPENAI_KEY } from "../../../../../chunks/private.js";
async function GET() {
  const openai = new OpenAI({ apiKey: OPENAI_KEY });
  try {
    const thread = await openai.beta.threads.create();
    return Response.json({ thread });
  } catch (error) {
    return Response.json({ error });
  }
}
export {
  GET
};
