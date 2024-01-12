<script>
    import { Input, Spinner, Textarea, Label, Button } from 'flowbite-svelte';
    import { SearchOutline, ArrowUpSolid } from 'flowbite-svelte-icons';
    import { onMount } from 'svelte';
    
    let dynamic_user_input = 'Say hi to me!';
    let user_search = '';
    let loading_response = false;

    let threadId = null;
    let threadMessage = null;
    let allMessages = null;
    let firstMessage = [
            {
                "id": "msg_FR8UQHZaaKVupu9LLMYzlv3i",
                "object": "thread.message",
                "created_at": 0,
                "thread_id": null,
                "role": "assistant",
                "content": [
                    {
                        "type": "text",
                        "text": {
                            "value": "I have access to 3.5k+ documented tickborne illness experiences. How can I help you?",
                            "annotations": []
                        }
                    }
                ],
                "file_ids": [],
                "assistant_id": null,
                "run_id": null,
                "metadata": {}
            },
        ];

    onMount(async () => {
        if (threadId === null) {
            threadId = await getThread();
            allMessages = [...firstMessage];
        }
    });

    let scrollToDiv = HTMLDivElement;
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
        allMessages = [...await viewThread(threadId), ...firstMessage];
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
        return data.messages
    }
    
    async function checkAndRetrieveData() {
        retrievedRunStatus = await retrieveRun(threadId, runId);
        
        if (retrievedRunStatus === 'completed') {
            clearInterval(intervalId); 
            console.log('Run status is: complete');
            allMessages = [...await viewThread(threadId), ...firstMessage];
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
    {#each allMessages.reverse() as message}
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