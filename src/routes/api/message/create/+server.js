import OpenAI from 'openai'
// import { NextRequest } from 'next/server'
import { OPENAI_KEY } from '$env/static/private'

export async function POST({request}) {
    // console.log("CREATING A MESSAGE")
    const { message, threadId, roleType } = await request.json();
    // console.log("in server:", message, threadId);

    if (!threadId || !message) {
        return Response.json({error: 'No thread ID or no Message'}, {status: 400});
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    try {
        const threadMessages = await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        });

        // console.log(threadMessages);

        return Response.json(threadMessages);

    } catch (error) {
        // console.log(error);
        return Response.json({error: error});
    }
}