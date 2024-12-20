import OpenAI from "openai";
import PocketBase from 'pocketbase';
import { OPENAI_API_KEY } from '$env/static/private';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    let { AISelectedItem, AISelectedIllness, AIOptionalText, queryNum, recordId } = await request.json();
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const model = 'gpt-3.5-turbo-1106';
    let response = '';

    try {

        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);
        const messages = [{ role: "system", content: "You are to act as a functional medicine doctor/expert." }];

        if (queryNum === 1) {
            messages.push({ role: "user", content: `Query 1: Explain or hypothesize how ${AISelectedItem} may benefit ${AISelectedIllness} in a concise and high-level way. Intended audience: average person.`});
            recordId = await createDatabaseEntry(AISelectedItem, AISelectedIllness, AIOptionalText);
            response = await openai.chat.completions.create({ model: model, messages, temperature: 0.7, max_tokens: 300 });
        } else if (queryNum === 2) {
            messages.push({ role: "user", content: `Query 2: Explain or hypothesize how ${AISelectedItem} may benefit ${AISelectedIllness} in a detailed way. Intended audience: medical professional.` });
            response = await openai.chat.completions.create({ model: model, messages, temperature: 0.7, max_tokens: 500 });
        }

        await pushDataToServer(recordId, queryNum, response.choices[0]?.message?.content);
        
        return new Response(JSON.stringify({ success: true, result: response.choices[0]?.message?.content || "No result", recordId: recordId}));
    
    } catch (e) {
        console.log('Query failed', e);
        return new Response(JSON.stringify({success: false}))
    }
};

async function createDatabaseEntry(AISelectedItem, AISelectedIllness, AIOptionalText) {
    const newEntry = await pb.collection("reports").create({
        'treatment': AISelectedItem,
        'illness': AISelectedIllness,
        'optional': AIOptionalText,
    });
    return newEntry.id;
}

async function pushDataToServer(recordId, queryNum, content) {
    try {
        const data = { [queryNum]: content };
        await pb.collection("reports").update(recordId, data);
        console.log("Data successfully pushed to server");
    } catch (error) {
        console.error("Failed to push data to server", error);
    }
}