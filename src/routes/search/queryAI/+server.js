import OpenAI from "openai";
import PocketBase from 'pocketbase';
import { OPENAI_API_KEY } from '$env/static/private';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");

export const POST = async ({ request }) => {
    let { AISelectedItem, AISelectedIllness, AIOptionalText, queryNum, recordId, maxRequests, userId } = await request.json();
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const model = 'gpt-3.5-turbo-1106';
    let response;
    let record;
    let prompt;

    try {

        await pb.admins.authWithPassword(PB_EMAIL, PB_PASSWORD);

        // create a new entry to store the data
        if (queryNum === 0){
            recordId = await createDatabaseEntry(userId, AISelectedItem, AISelectedIllness, AIOptionalText);
        }

        // get model instructions from database, assign variables
        record = await pb.collection('prompts').getOne('4t9b4kh2vy8umjs', {fields: `instructions,count,${queryNum}`});
        const messages = [{ role: "system", content: record.instructions }];
        maxRequests = record.count;
        record = record[queryNum.toString()];
        prompt = record.prompt;

        // replace placeholders
        prompt = prompt.replaceAll('${AISelectedItem}', AISelectedItem);
        prompt = prompt.replaceAll('${AISelectedIllness}', AISelectedIllness);
        prompt = prompt.replaceAll('${AIOptionalText}', AIOptionalText);

        messages.push({ role: "user", content: prompt});

        response = await openai.chat.completions.create({ 
            model: model,
            messages,
            temperature: record.temperature, 
            max_tokens: record.max_tokens
        });

        await pushDataToServer(recordId, record.title, response.choices[0]?.message?.content);
        
        return new Response(JSON.stringify({ success: true, title: record.title, result: response.choices[0]?.message?.content || "No result", recordId: recordId, maxRequests: maxRequests }));
    
    } catch (e) {
        console.log('Query failed', e);
        return new Response(JSON.stringify({success: false}))
    }
};

async function createDatabaseEntry(userId, AISelectedItem, AISelectedIllness, AIOptionalText) {
    const newEntry = await pb.collection("reports").create({
        'userid': userId,
        'treatment': AISelectedItem,
        'illness': AISelectedIllness,
        'optional': AIOptionalText,
    });
    return newEntry.id;
}

async function pushDataToServer(recordId, title, content) {
    try {
        const record = await pb.collection("reports").getOne(recordId);
        let order = record.order || "";
        order += (order ? "," : "") + title;
        
        const data = { 
            [title.replace(/\s+/g, '_').toLowerCase()]: content,
            "order": order
        };
        await pb.collection("reports").update(recordId, data);

        console.log("Data successfully pushed to server");
    } catch (error) {
        console.error("Failed to push data to server", error);
    }
}