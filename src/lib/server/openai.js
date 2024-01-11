import { OPENAI_KEY } from '$env/static/private'
import { OPENAI_ID } from '$env/static/private'
import { json } from '@sveltejs/kit'
import OpenAI from "openai";

export const createChatCompletion = async () => {
    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    
}


 // try {
    //     const response = await openai.beta.assistants.list({
    //         order: "desc",
    //         limit: 10,
    //     })

    //     const assistants = response.data;
    //     console.log(assistants);
    // }
    // catch (error) {
    //     console.log(error);
    // }

    // const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //       {"role": "system", "content": "From your knowledgebase, what are some unique treatments people are trying?"}
    //     ],
    //     assistantId: OPENAI_ID,
    //     stream: true,
    //   });
    
    //   for await (const chunk of completion) {
    //     console.log(chunk.choices[0].delta.content);
    //   }

// assistant = client.beta.assistants.retrieve("{your_assistant_id}")



// export const createChatCompletion = async () => {

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${OPENAI_KEY}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{
//                 role: 'user',
//                 content: 'In a sentence, describe lyme disease' 
//             }]
//         })
//     })

//     if (!response.ok) {
//         console.log(response)
//         throw new Error('Failed to fetch from OpenAI API')
//     }

//     const json = await response.json()
//     console.log(response)
//     console.log(json.choices[0].message.content)
// }