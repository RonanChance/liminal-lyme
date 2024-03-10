import OpenAI from 'openai'
import { OPENAI_KEY } from '$env/static/private'

export async function GET ({url}) {
    const threadId = url.searchParams.get('threadId');
    const runId = url.searchParams.get('runId');

    if (!threadId){
        return Response.json({ error: 'No thread id provided' }, { status: 400 });
    }
    if (!runId){
        return Response.json({ error: 'No run id provided' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    try {
        const run = await openai.beta.threads.runs.retrieve(threadId, runId);

        // console.log(run);

        return Response.json({ run: run });
    } catch (error) {
        // console.log(error);
        return Response.json({error: error});
    }

}