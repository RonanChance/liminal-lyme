import OpenAI from 'openai'
import { OPENAI_KEY } from '$env/static/private'
import { OPENAI_ID } from '$env/static/private'

export async function GET ({url}) {
    const threadId = url.searchParams.get('threadId');
    const assistantId = OPENAI_ID;

    if (!threadId){
        return Response.json({ error: 'No thread id provided' }, { status: 400 });
    }
    if (!assistantId){
        return Response.json({ error: 'No assistant id provided' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    try {
        const run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: OPENAI_ID
        });

        // console.log({run: run});

        return Response.json({ run: run });
    } catch (error) {
        // console.log(error);
        return Response.json({error: error});
    }

}