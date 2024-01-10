<script>
    import { onDestroy, onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { browser } from '$app/environment';
    import { fly } from 'svelte/transition'


    // Declare username outside of the if (browser) block
    let username;

    // Function to get cookie value by name
    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    let animate = false;

    onMount(() => {
        animate = true;
        if (browser) {
            console.log('attemtping to get cookie')
            username = getCookie('username');
            console.log( document.cookie);
            console.log(username);
        }
    });

</script>

<TopBanner />

{#if animate}
<div class="divbg" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
    <h1> Hi, <span class="highlighted-word" style="font-weight:700">{username}</span>!</h1>
    <h2>Let's get you chatting.</h2>
    
    
    <div class="paddingbottom"></div>
</div>
{/if}


<style>

h1 {
    max-width: 80%;
    padding-top: 2rem;
}

</style>