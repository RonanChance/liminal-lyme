<script>
    import { onDestroy, onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition'
    import { getCookie } from '../../lib/components/constants';
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import { MessagesSolid, ClockSolid } from 'flowbite-svelte-icons';
    import Chat from '../../lib/components/Chat.svelte'
    import Anecdote from '../../lib/components/Anecdote.svelte';
    import Connect from '../../lib/components/Connect.svelte';
    import Search from '../../lib/components/Search.svelte';
    import Chronology from '../../lib/components/Chronology.svelte';

    import { page } from '$app/stores'
    const path = $page.url.searchParams.get('path')

    /** @type {import('./$types').LayoutData} */
    export let data;

    let currentTab = 'searchTab';
    if (path === 'searchTab') {
        currentTab = 'searchTab';
    }
    else if (path === 'chatTab') {
        currentTab = 'chatTab';
    } 
    else if (path === 'anecdoteTab') {
        currentTab = 'anecdoteTab';
    } 
    else if (path === 'chronologyTab') {
        currentTab = 'chronologyTab'
    }

    // Declare email outside of the if (browser) block
    let email;
    let animate = false;

    onMount(() => {
        animate = true;
        if (browser) {
            email = getCookie('email');
            // console.log(email);
            // console.log(path)
        }
    });

    console.log(currentTab)

</script>

<div class="entirepage">
    <TopBanner />

    <div class="buttongroup">
        <ButtonGroup class="buttons">
            <Button class="bg-slate-200" style="color: {currentTab === 'searchTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'searchTab'}}>
            <svg class="w-5 h-5 me-2" height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="{currentTab === 'searchTab' ? '#43bbde' : 'gray'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:{currentTab === 'searchTab' ? '#43bbde' : 'gray'};} </style> <g> <path class="st0" d="M172.625,102.4c-42.674,0-77.392,34.739-77.392,77.438c0,5.932,4.806,10.74,10.733,10.74 c5.928,0,10.733-4.808,10.733-10.74c0-30.856,25.088-55.959,55.926-55.959c5.928,0,10.733-4.808,10.733-10.74 C183.358,107.208,178.553,102.4,172.625,102.4z"></path> <path class="st0" d="M361.657,301.511c19.402-30.436,30.645-66.546,30.645-105.244C392.302,88.036,304.318,0,196.151,0 c-38.676,0-74.765,11.25-105.182,30.663C66.734,46.123,46.11,66.759,30.659,91.008C11.257,121.444,0,157.568,0,196.267 c0,108.217,87.998,196.266,196.151,196.266c38.676,0,74.779-11.264,105.197-30.677C325.582,346.396,346.206,325.76,361.657,301.511 z M259.758,320.242c-19.075,9.842-40.708,15.403-63.607,15.403c-76.797,0-139.296-62.535-139.296-139.378 c0-22.912,5.558-44.558,15.394-63.644c13.318-25.856,34.483-47.019,60.323-60.331c19.075-9.842,40.694-15.403,63.578-15.403 c76.812,0,139.296,62.521,139.296,139.378c0,22.898-5.558,44.53-15.394,63.616C306.749,285.739,285.598,306.916,259.758,320.242z"></path> <path class="st0" d="M499.516,439.154L386.275,326.13c-16.119,23.552-36.771,44.202-60.309,60.345l113.241,113.024 c8.329,8.334,19.246,12.501,30.148,12.501c10.916,0,21.833-4.167,30.162-12.501C516.161,482.83,516.161,455.822,499.516,439.154z"></path> </g> </g></svg>
            <p>Search</p>
            </Button>

            <!-- <Button class="bg-slate-200" style="color: {currentTab === 'chronologyTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'chronologyTab'}}>
                <ClockSolid class="w-5 h-5 me-2" />
                <p>Chronology</p>
            </Button> -->

            <Button class="bg-slate-200" style="color: {currentTab === 'chatTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'chatTab'}}>
            <MessagesSolid class="w-5 h-5 me-2" />
            <p>Chat</p>
            </Button>
            <!-- <Button class="bg-slate-200" style="color: {currentTab === 'anecdoteTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'anecdoteTab'}}>
            <PenSolid class="w-5 h-5 me-2" />
            <p>Insight</p>
            </Button> -->
            <!-- <Button class="bg-slate-200" style="color: {currentTab === 'connectTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'connectTab'}}>
            <UserGroupSolid class="w-5 h-5 me-2" />
            <p>Connect</p>
            </Button> -->
        </ButtonGroup>
    </div>

    {#if animate}
        <div class="divbg" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
            {#if currentTab === 'chatTab'}
                <Chat />
            {:else if currentTab === 'anecdoteTab'}
                <Anecdote {email}/>
            {:else if currentTab === 'connectTab'}
                <Connect {email}/>
            {:else if currentTab === 'chronologyTab'}
                <Chronology />
            {:else if currentTab === 'searchTab'}
                <Search />
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
        
        margin-top: 1rem;
        flex: 1;
        margin-bottom: 1rem;
    }

    .buttongroup {
        margin-top: 1rem;
        display: flex;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .divbg {
            margin-left: 0rem;
            margin-right: 0rem;
            margin-bottom: 0rem;
        }
    }

</style>