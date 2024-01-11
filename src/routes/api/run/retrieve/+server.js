import OpenAI from 'openai'
import { OPENAI_KEY } from '$env/static/private'

export async function GET (req) {
    const searchParams = req.nextUrl.searchParams;
    const threadId = searchParams.get('threadId');
    const runId = searchParams.get('runId');

    if (!threadId){
        return Response.json({ error: 'No thread id provided' }, { status: 400 });
    }
    if (!assistantId){
        return Response.json({ error: 'No assistant id provided' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    try {
        const run = await openai.beta.threads.run.retrieve(threadId, runId);

        console.log(run);

        return Response.json({ run: run });
    } catch (error) {
        console.log(error);
        return Response.json({error: error});
    }

}