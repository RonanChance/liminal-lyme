import OpenAI from 'openai'
import { OPENAI_KEY } from '$env/static/private'

export async function GET({url}) {
    const threadId = url.searchParams.get('threadId');

    if (!threadId) {
        return Response.json({ error: 'No thread id provided' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    try {
        const response = await openai.beta.threads.messages.list(threadId);
        console.log(response);

        return Response.json({ messages: response.data });
        
    } catch (e) {
        console.log(e);
        return Response.json({ error: e });
    }
}