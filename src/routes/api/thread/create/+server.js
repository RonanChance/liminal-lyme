import OpenAI from "openai";
import { OPENAI_KEY } from '$env/static/private'

export async function GET() {
    console.log("CREATING A THREAD")
    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    
    try {
        const thread = await openai.beta.threads.create()

        console.log(thread);

        return Response.json({ thread: thread });
    } catch (error) {
        console.log(error);
        return Response.json({error: error});
    }
}