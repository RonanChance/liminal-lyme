<script>
    import { onDestroy, onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition'
    import { getCookie } from '../../lib/components/constants';
    import { ButtonGroup, Button } from 'flowbite-svelte';
    import { MessagesSolid, ClockSolid, UserGroupSolid, MessagesOutline, UsersGroupOutline } from 'flowbite-svelte-icons';
    import NavigationBar from '../../lib/components/NavigationBar.svelte';
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
    <!-- <NavigationBar bind:currentTab={currentTab}/> -->

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
        </div>
    {/if}
</div>


<style>

    .entirepage {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .divbg {
        flex-grow: 1;
        overflow-y: auto;
    }

    @media (max-width: 768px) {
        .divbg {
            margin-top: 0rem;
            margin-left: 0rem;
            margin-right: 0rem;
            margin-bottom: 0rem;
        }
    }

</style>