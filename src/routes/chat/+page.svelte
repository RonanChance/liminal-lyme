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
    import Insight from '../../lib/components/Insight.svelte';
    import Connect from '../../lib/components/Connect.svelte';

    // Declare username outside of the if (browser) block
    let username;
    let animate = false;

    let currentTab = 'chatTab';

    onMount(() => {
        animate = true;
        if (browser) {
            username = getCookie('username');
            console.log(username);
        }
    });

</script>

<TopBanner />

{#if animate}
    <div class="divbg" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
        <div class="buttongroup">
            <ButtonGroup>
                <Button style="color: {currentTab === 'chatTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'chatTab'}}>
                <MessagesSolid class="w-5 h-5 me-2" />
                Chat
                </Button>
                <Button style="color: {currentTab === 'insightTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'insightTab'}}>
                <PenSolid class="w-5 h-5 me-2" />
                Insight
                </Button>
                <Button style="color: {currentTab === 'connectTab' ? '#43bbde' : 'gray'}" on:click={() => {currentTab = 'connectTab'}}>
                <UserGroupSolid class="w-5 h-5 me-2" />
                Connect
                </Button>
            </ButtonGroup>
        </div>
        {#if currentTab === 'chatTab'}
            <Chat {username}/>
        {:else if currentTab === 'insightTab'}
            <Insight {username}/>
        {:else if currentTab === 'connectTab'}
            <Connect {username}/>
        {/if}
        <div class="paddingbottom"></div>
    </div>
{/if}


<style>

    .buttongroup {
        display: flex;
        justify-content: center;

        padding-top: 20px;
    }


</style>