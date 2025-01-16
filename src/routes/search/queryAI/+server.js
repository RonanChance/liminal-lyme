import OpenAI from "openai";
import PocketBase from 'pocketbase';
import { OPENAI_API_KEY } from '$env/static/private';
import { PB_EMAIL, PB_PASSWORD } from '$env/static/private';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_USER_ID  } from '$env/static/private';

const pb = new PocketBase("https://pb.liminallyme.com");
const PB_DATA = new PocketBase("https://data.liminallyme.com");

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_USER_ID,
            text: message,
        }),
    });
    return response.json();
}

async function calculateRedditFilterQuery(AISelectedItem, AISelectedIllness) {
    try {
        let filterQuery1 = `(medications?~'${AISelectedItem}') && (conditions?~'${AISelectedIllness}')`;
        let filterQuery2 = `(supplements?~'${AISelectedItem}') && (conditions?~'${AISelectedIllness}')`;
        console.log(filterQuery1, filterQuery2)
        const response1 = await PB_DATA.collection('posts').getList(1, 1, { filter: filterQuery1 });
        const response2 = await PB_DATA.collection('posts').getList(1, 1, { filter: filterQuery2 });
        console.log(response1, response2);
        let total1 = response1.totalItems || 0;
        let total2 = response2.totalItems || 0;
        console.log(total1, total2);

        if (total1 > total2) {
            return filterQuery1;
        } else if (total2 > total1) {
            return filterQuery2;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching count:', error);
    }
}

export const POST = async ({ request }) => {
    let { AISelectedItem, AISelectedIllness, AIOptionalText, queryNum, recordId, maxRequests, userId } = await request.json();
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const model = 'gpt-3.5-turbo-1106';
    let response;
    let record;
    let prompt;
    let allPosts;

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

        if (record.title === "Reddit Summary") {
            let filterQuery = await calculateRedditFilterQuery(AISelectedItem, AISelectedIllness);

            console.log(filterQuery);
            if (filterQuery) {
                // we should proceed with the existing labeled posts
                const fetched_posts = await PB_DATA.collection('posts').getList(1, 10, { sort: '-score', filter: filterQuery });
                let result_list = fetched_posts.items;

                console.log(result_list.length);

                if (!result_list || result_list.length === 0) {
                    return; // Return early if no posts are found
                }

                // Combine all posts into a single string
                allPosts = result_list.map(element => {let cleanBody = element.body.replace(/<\/?[^>]+(>|$)/g, ""); return cleanBody.split(/\s+/).slice(0, 125).join(" ");}).join(" "); // Join with space, max 75 words
                console.log(allPosts);
            } else {
                // TODO: scan through them all on our own, but for now skipping this
            }
        }

        if (record.title === "Your Questions" && AIOptionalText.length <= 5) {
            await pushDataToServer(recordId, record.title, null);
            return new Response(JSON.stringify({ success: true, title: record.title, result: null, recordId: recordId, maxRequests: maxRequests }));
        }
        
        // replace placeholders
        prompt = prompt.replaceAll('${AISelectedItem}', AISelectedItem);
        prompt = prompt.replaceAll('${AISelectedIllness}', AISelectedIllness);
        prompt = prompt.replaceAll('${AIOptionalText}', AIOptionalText);
        prompt = prompt.replaceAll('${AIRedditPosts}', allPosts);

        messages.push({ role: "user", content: prompt });
        
        response = await openai.chat.completions.create({ 
            model: model,
            messages,
            temperature: record.temperature, 
            max_tokens: record.max_tokens
        });

        await pushDataToServer(recordId, record.title, response?.choices?.[0]?.message?.content || null);
        return new Response(JSON.stringify({ success: true, title: record.title, result: response?.choices?.[0]?.message?.content || null, recordId: recordId, maxRequests: maxRequests }));
    
    } catch (e) {
        console.log('Query failed', e);
        return new Response(JSON.stringify({success: false}))
    }
};

async function createDatabaseEntry(userId, AISelectedItem, AISelectedIllness, AIOptionalText) {
    const newEntry = await pb.collection("reports").create({
        'userid': userId || 'mx6msaz4il8031y',
        'treatment': AISelectedItem,
        'illness': AISelectedIllness,
        'optional': AIOptionalText,
    });

    try {
        sendTelegramMessage(`Generating: ${AISelectedItem} for ${AISelectedIllness}`);
    } catch (e) {}

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