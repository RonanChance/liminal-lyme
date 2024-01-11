<script>
    import { Input, Label, Button } from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';

    export let username;
    let dynamic_user_input = 'test';
    let user_search = '';
    let setSending = false;

    async function submitSearch() {
        if (dynamic_user_input === '') {
            return;
        }
        
        user_search = dynamic_user_input;
        console.log(user_search);

        let threadId = await getThread();
        let threadMessage = await createMessage(threadId);

        console.log(threadMessage)
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
        return data
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

<div class="inputcontainer">
    <Input id="search" bind:value={dynamic_user_input} on:keydown={handleKeyDown} placeholder="Search" autocomplete="off" data-lpignore="true" size="lg">
        <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
        <Button slot="right" on:click={() => {submitSearch(); dynamic_user_input = '';}} size="sm" type="submit">Search</Button>
    </Input>
</div>

<style>
    .inputcontainer {
        margin: auto;
        width: 65%;
    }

    h1 {
        padding-top: 2rem;
    }
</style>