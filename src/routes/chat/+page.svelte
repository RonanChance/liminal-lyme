<script>
    import { onDestroy, onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition'
    import { getCookie } from '../../lib/components/constants';
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import { MessagesSolid, PenSolid, UserGroupSolid} from 'flowbite-svelte-icons';
    import Chat from '../../lib/components/Chat.svelte'
    import Anecdote from '../../lib/components/Anecdote.svelte';
    import Connect from '../../lib/components/Connect.svelte';

    // Declare email outside of the if (browser) block
    let email;
    let animate = false;

    let currentTab = 'chatTab';

    onMount(() => {
        animate = true;
        console.log("I'm being reached!")
        if (browser) {
            email = getCookie('email');
            console.log(email);
        }
    });

</script>

<div class="entirepage">
    <TopBanner />

    <div class="buttongroup">
        <ButtonGroup>
            <Button class="bg-slate-200" style="color: {currentTab === 'chatTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'chatTab'}}>
            <MessagesSolid class="w-5 h-5 me-2" />
            <p>Chat</p>
            </Button>
            <Button class="bg-slate-200" style="color: {currentTab === 'anecdoteTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'anecdoteTab'}}>
            <PenSolid class="w-5 h-5 me-2" />
            <p>Insight</p>
            </Button>
            <Button class="bg-slate-200" style="color: {currentTab === 'connectTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'connectTab'}}>
            <UserGroupSolid class="w-5 h-5 me-2" />
            <p>Connect</p>
            </Button>
        </ButtonGroup>
    </div>

    <!-- <h1> Hi, <span class="highlighted-word" style="font-weight:700">{email}</span>!</h1>
    <h2>Let's get you chatting.</h2> -->

    {#if animate}
        <div class="divbg" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
            {#if currentTab === 'chatTab'}
                <Chat />
            {:else if currentTab === 'anecdoteTab'}
                <Anecdote {email}/>
            {:else if currentTab === 'connectTab'}
                <Connect {email}/>
            {/if}
            <!-- <div class="paddingbottom"></div> -->
        </div>
    {/if}
</div>


<style>

    p {
        color: #202142;
        font-size: 12pt;
        font-weight: bold;
    }

    .entirepage {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    
    .divbg {
        display: flex;
        flex-direction: column;
        
        margin-top: 20px;
        flex: 1;
        margin-bottom: 20px;
    }

    .buttongroup {
        display: flex;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .divbg {
            margin-left: 0px;
            margin-right: 0px;
            margin-bottom: 0px;
            border-radius: 20px;
        }
    }

</style>