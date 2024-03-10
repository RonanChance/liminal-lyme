import OpenAI from "openai";
import { OPENAI_KEY } from '$env/static/private'

export async function GET(req) {
    
    // console.log("DELETING A THREAD")
    const searchParams = req.searchParams;
    const threadId = searchParams.get("threadId");

    if (!threadId){
        return Response.json({ error: "No thread Id provided" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    
    try {
        const thread = await openai.beta.threads.del(threadId);
    
        // console.log(thread);
    
        return Response.json({ thread: thread });
      } catch (e) {
        // console.log(e);
        return Response.json({ error: e });
      }
}