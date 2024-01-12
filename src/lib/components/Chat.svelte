<script>
    import { Input, Label, Button } from 'flowbite-svelte';
    import { SearchOutline, ArrowUpSolid } from 'flowbite-svelte-icons';

    export let username;
    let dynamic_user_input = 'Say hi to me!';
    let user_search = '';
    let setSending = false;

    let threadId = null;
    let threadMessage = null;
    let allMessages = null;
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
            threadId = await getThread();
        }

        threadMessage = await createMessage(threadId);

        runResult = await createRun(threadId);
        console.log('runResult id:', runResult.run.id);
        runId = runResult.run.id;

        checkAndRetrieveData();
        intervalId = setInterval(checkAndRetrieveData, 5000);

        // retrievedRunStatus = retrieveRun(threadId, runId);
        // console.log('POLLING :', retrievedRunStatus);
        // allMessages = viewThread(threadId);
        // console.log('allMessages:', allMessages);
        
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
        }
    }

    const sendMessage = async () => {
        if (!thread) {
            return;
        }
        setSending = true;
    }


    function handleKeyDown(event) {
        if (event.key === "Enter") {
            submitSearch();
            dynamic_user_input = '';
        }
    }
</script>

<h1> Hi, <span class="highlighted-word" style="font-weight:700">{username}</span>!</h1>
<h2>Let's get you chatting.</h2>

<div class="chatcontainer">
{#if allMessages}
    {#each allMessages.messages as message}
        <p>{message.content[0].text.value}</p>
    {/each}
{/if}
</div>

<div class="inputcontainer">
    <Input id="search" bind:value={dynamic_user_input} on:keydown={handleKeyDown} placeholder="Search" autocomplete="off" data-lpignore="true" size="lg">
        <Button slot="right" on:click={() => {submitSearch(); dynamic_user_input = '';}} size="sm" type="submit" style="background-color:#43bbde; padding-left:8px; padding-right:10px;"><ArrowUpSolid /></Button>
    </Input>
</div>

<style>
    .chatcontainer {
        margin: auto;
        width: 90%;
        overflow-y: scroll;
        padding: 5px;
    }
    .inputcontainer {
        margin: auto;
        width: 90%;
    }

    h1 {
        padding-top: 2rem;
    }
</style>