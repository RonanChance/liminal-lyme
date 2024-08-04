<script>
    import { fly } from 'svelte/transition'
    import { onMount } from 'svelte';

    let animate = false;
    export let expand = false;

    onMount(() => animate = true);
</script>

{#if !expand}
    {#if animate}
        <div class="footer" in:fly={{y:50, delay: 500, duration: 1500}}>
            <div class="centered">&#9877; 2024 Liminal Lyme</div>
            <div class="centered text-sm">Supporting your path to health from Boston, MA </div>
        </div>
    {/if}
{:else}
    {#if animate}
        <div class="footer-expanded-bg" in:fly={{y:50, delay: 500, duration: 1500}}>
            <div class="centered">&#9877; 2024 Liminal Lyme</div>
            <div class="centered text-sm">Supporting your path to health from Boston, MA </div>
        </div>
    {/if}
{/if}

<style>
    .footer {
        color: var(--darkbackground);
        font-size: 1.25rem;
        background-color: var(--white);
        margin-top: 50px;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .footer-expanded-bg {
        position: absolute;
        width: 100%;
        color: var(--darkbackground);
        font-size: 1.25rem;
        background-color: var(--white);
        margin-top: 50px;
        padding-top: 50px;
        padding-bottom: 50px;
    }

    .footer-expanded-bg::after {
        content: '';
        position: absolute;
        top: 0;
        left: 99%;
        width: 600vw;
        height: 100%;
        background: var(--white);
        z-index: -1;
    }
</style>