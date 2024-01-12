<script>
    import { Input, Spinner, Textarea, Label, Button } from 'flowbite-svelte';
    import { SearchOutline, ArrowUpSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    
    let dynamic_user_input = 'Say hi to me!';
    let user_search = '';
    let loading_response = false;

    let threadId = null;
    let threadMessage = null;
    let allMessages = {
        "messages": [
            {
                "id": "msg_FR8UQHZaaKVupu9LLMYzlv3i",
                "object": "thread.message",
                "created_at": 0,
                "thread_id": "thread_Onh9cuVkXlIr4OuThr2x0kKs",
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": {
                            "value": "I have access to 3.5k+ documented tickborne experiences. How can I help you?",
                            "annotations": []
                        }
                    }
                ],
                "file_ids": [],
                "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
                "run_id": "run_xNKnXAsd7ZX1BC7cnHAxm97C",
                "metadata": {}
            },
        ]
    };

    onMount(async () => {
        if (threadId === null) {
            threadId = await getThread();
        }
    });

    let scrollToDiv = HTMLDivElement;
//     let allMessages = {
//     "messages": [
//         {
//             "id": "msg_bUmSEPgGEPn5EEFuNJqQGhWw",
//             "object": "thread.message",
//             "created_at": 1705085210,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "user",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Tell me a fact about Lyme disease",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": null,
//             "run_id": null,
//             "metadata": {}
//         },
//         {
//             "id": "msg_rI7Yj3KcMHqOSCLQ5ebafeoY",
//             "object": "thread.message",
//             "created_at": 1705085226,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Lyme disease can cause psychiatric symptoms such as anxiety, depression, and depersonalization. It's important to recognize that these symptoms can be part of the disease and seek appropriate medical attention for diagnosis and treatment【2†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_lwEEPI9OkB0XEEClrzjHg4hC",
//             "metadata": {}
//         },
//         {
//             "id": "msg_7qSbAllganJ2OaUuT4cDk1un",
//             "object": "thread.message",
//             "created_at": 1705085255,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "user",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "tell me 3 creative treatments people are trying",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": null,
//             "run_id": null,
//             "metadata": {}
//         },
//         {
//             "id": "msg_pbXBqUJzN1LJvX4xkDd1SImi",
//             "object": "thread.message",
//             "created_at": 1705085261,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three creative treatments people are trying for Lyme disease:\n\n1. High-dose vitamin C, preferably liposomal or even IV infusion.\n2. Homeopathy, such as the use of DesBio.\n3. Disulfiram (Antabuse) treatment, which has been used successfully by a doctor named Horowitz, although it can be very harsh. Additionally, there is an expensive permanent treatment called SOT (supportive oligonucleotide therapy) that turns off the pathogen's reproductive gene so it stops multiplying in the system and eventually is gone. However, the downside is that only one pathogen can be targeted at a time, and for some, the immune system does not deal with the coinfections even when Lyme is gone【27†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_1Q3rDQChduMrD1mngLkNEReU",
//             "metadata": {}
//         },
//         {
//             "id": "msg_rVrSM83LF0OeZGIj2REknqM4",
//             "object": "thread.message",
//             "created_at": 1705085304,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "user",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "list a few antibiotics that are less common but show potential for lyme disease",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": null,
//             "run_id": null,
//             "metadata": {}
//         },
//         {
//             "id": "msg_4ZM2ACn5ZnTgaOJOa5x3pB06",
//             "object": "thread.message",
//             "created_at": 1705085310,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Two less common antibiotics showing potential for Lyme disease are Dapsone and Allinia. Dapsone was prescribed due to a specific genetic Lyme marker, and the individual saw much improvement with it. Allinia is a new antibiotic that many Lyme patients are reportedly having good success with. However, the use of Allinia may depend on whether insurance covers it【32†source】【33†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_crbBzltX7PlrwLtyY2lkKAnd",
//             "metadata": {}
//         },
//         {
//             "id": "msg_8IzXvwoazUldIOdvwSCRFy6a",
//             "object": "thread.message",
//             "created_at": 1705085366,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "user",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "list 3 uncommon supplements that people have reported work well for them",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": null,
//             "run_id": null,
//             "metadata": {}
//         },
//         {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085373,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085374,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085375,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085376,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085377,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085378,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
// {
//             "id": "msg_fvpeCFW8q2hDnDEaOGPCnYGM",
//             "object": "thread.message",
//             "created_at": 1705085378,
//             "thread_id": "thread_atVWErIdwOvH4DwEYtNvTzJC",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Here are three uncommon supplements that people have reported work well for them in the context of Lyme disease:\n\n1. Zinc, Vitamin C, Vitamin D, Vitamin K, Quercitin, NAC (N-acetyl cysteine), and glutathione, which have been recommended by individuals as helpful supplements【38†source】.\n2. Nystatin for yeast prevention, and a recommendation for a bunch of supplements, along with a note on being deficient in Vitamin D and Omega 3【40†source】.",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_3oq6l94GqSGYitU45hCEsOcY",
//             "metadata": {}
//         },
//     ]
// };

// let allMessages = {
//     "messages": [
//         {
//             "id": "msg_FR8UQHZaaKVupu9LLMYzlv3i",
//             "object": "thread.message",
//             "created_at": 1705040773,
//             "thread_id": "thread_Onh9cuVkXlIr4OuThr2x0kKs",
//             "role": "assistant",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Hello! How can I assist you today?",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": "asst_3cIA9dtY4q7IqFa4OdNN21kd",
//             "run_id": "run_xNKnXAsd7ZX1BC7cnHAxm97C",
//             "metadata": {}
//         },
//         {
//             "id": "msg_Q7EA6G9rRJEXcFkFUBQpDrlH",
//             "object": "thread.message",
//             "created_at": 1705040771,
//             "thread_id": "thread_Onh9cuVkXlIr4OuThr2x0kKs",
//             "role": "user",
//             "content": [
//                 {
//                     "type": "text",
//                     "text": {
//                         "value": "Say hi to me!",
//                         "annotations": []
//                     }
//                 }
//             ],
//             "file_ids": [],
//             "assistant_id": null,
//             "run_id": null,
//             "metadata": {}
//         }
//     ]
// };
    let runId = null;
    let runResult = null;
    let retrievedRunStatus = null;
    let intervalId;

    async function submitSearch() {
        if (dynamic_user_input === '') {
            return;
        }
        
        user_search = dynamic_user_input;
        console.log(user_search);

        if (threadId === null) {
            console.log("Still had to get thread after search")
            threadId = await getThread();
        }

        threadMessage = await createMessage(threadId);
        allMessages = await viewThread(threadId);
        loading_response = true;

        runResult = await createRun(threadId);
        console.log('runResult id:', runResult.run.id);
        runId = runResult.run.id;

        checkAndRetrieveData();
        intervalId = setInterval(checkAndRetrieveData, 5000);
        
    }

    async function getThread() {
        const url = 'api/thread/create';
        const requestOptions = {
            method: 'GET'
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log("threadID:", data.thread.id);
        return data.thread.id
    }

    async function createMessage(threadId) {
        const url = 'api/message/create';
        console.log('passing: ', user_search, threadId);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ message: user_search, threadId: threadId })
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('Created message:', data.message);
        return data
    }

    async function createRun(threadId) {
        const url = 'api/run/create?threadId=' + threadId;
        console.log('passing run: ', threadId);
        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('Created run:', data.id);
        return data
    }

    async function retrieveRun(threadId, runId) {
        console.log('Retrieving run with Id:', runId);
        const url = 'api/run/retrieve?threadId=' + threadId + '&runId=' + runId;
        console.log('checking run: ', runId);
        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('Retrieved run:', data.run.status);
        return data.run.status
    }

    async function viewThread(threadId) {
        const url = 'api/message/list?threadId=' + threadId;
        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('Viewing thread:', data);
        return data
    }
    
    async function checkAndRetrieveData() {
        retrievedRunStatus = await retrieveRun(threadId, runId);
        
        if (retrievedRunStatus === 'completed') {
            clearInterval(intervalId); 
            console.log('Run status is: complete');
            allMessages = await viewThread(threadId);
            console.log('all MESSAGES:', allMessages);
            
            loading_response = false;
            scrollToBottom();
        }
        if (retrievedRunStatus === 'failed' || retrievedRunStatus === 'cancelled' || retrievedRunStatus === 'timed_out' || retrievedRunStatus === 'interrupted') {
            clearInterval(intervalId); 
            console.log('Run failed');
            loading_response = false;
            scrollToBottom();
        }
    }

    function scrollToBottom() {
        setTimeout(
            function () {
                scrollToDiv.scrollIntoView({ behavior: 'smooth' , block: 'end', inline: 'nearest' })
            }, 100);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            submitSearch();
            dynamic_user_input = '';
        }
    }
</script>

<div class="chatcontainer">
{#if allMessages}
    {#each allMessages.messages.reverse() as message}
        {#if message.role === 'user'}
            <div class="message chatright">
                <p><span class="username">You<br /></span>
                <p>{message.content[0].text.value}</p>
            </div>
        {:else if message.role === 'assistant'}
            <div class="message chatleft">
                <p><span class="assistantname">ChatRXN <br /></span> {message.content[0].text.value}</p>
            </div>
        {/if}
    {/each}
{/if}
{#if loading_response}
    <div class="message chatleft">
        <p><Spinner color="gray" /></p>
    </div>
{/if}

<div bind:this={scrollToDiv}></div>
</div>

<div class="searchbarcontainer">
    <textarea class="inputtextbox" bind:value={dynamic_user_input} on:keydown={handleKeyDown} placeholder="Search" autocomplete="off" data-lpignore="true" rows="1" style="resize: none;" size="lg"></textarea>
    <Button slot="right" on:click={() => {submitSearch(); dynamic_user_input = '';}} size="sm" type="submit" style="background-color: {dynamic_user_input.length >= 1 ? '#43bbde' : '#c4c4c4'}; padding-left:13px; padding-right:14px;">
        <ArrowUpSolid />
    </Button>
</div>

<div class="medicaldisclaimer">
    <p style="text-align: center; margin-top: 3%; font-style: italic;"> This is a research project, not medical advice.  </p>
</div>

<style>
    .message {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 10px;
        width: fit-content;
    }

    .medicaldisclaimer {
        margin-bottom: 20px;
    }

    p {
        font-size: 16px;
    }

    .assistantname {
        font-size: 16px;
        color: #43bbde;
        font-weight: bold;
    }

    .username {
        font-size: 16px;
        color: #0e2743;
        font-weight: bold;
    }

    .chatleft {
        align-self: flex-start;
        background-color: #0e2743;
    }

    .chatright {
        align-self: flex-end;
        background-color: #43bbde;
    }

    .chatcontainer {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin: 0 auto;
        padding: 12px;
        max-height: 70vh; 
        overflow-y: auto;
        
    }
    
    /* Webkit (Chrome, Safari) scrollbar styling */
    .chatcontainer::-webkit-scrollbar {
        width: 5px; /* Set scrollbar width */
    }

    .chatcontainer::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.4); /* Set thumb color */
    }

    .chatcontainer::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5); /* Set thumb color on hover */
    }

    .chatcontainer::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1); /* Set track color */
    }

    .inputtextbox {
        width: 100%;
        border-radius: 10px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 50px;
        font-size: 18px;
        border: 1px solid #c4c4c4;
        resize: none;
    }

    .searchbarcontainer {
        display: flex;
        flex-direction: row;
        margin: auto auto 0 auto;
        width: 90%;
    }
</style>