import OpenAI from 'openai'
// import { NextRequest } from 'next/server'
import { OPENAI_KEY } from '$env/static/private'

export async function POST({request}) {
    console.log("CREATING A MESSAGE")
    const {message, threadId } = await request.json();
    console.log("in server, ", message, threadId);

    if (!threadId || !message) {
        return Response.json({error: 'No thread ID or no Message'}, {status: 400});
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });
    try {
        const threadMessage = await openai.beta.threads.messages.create(threadId, {
            role: 'user',
            content: message
        })

        console.log(threadMessage);

        return Response.json(threadMessage);

    } catch (error) {
        console.log(error);
        return Response.json({error: error});
    }
}