<script>
    import { fly } from 'svelte/transition'
    import { onMount } from 'svelte';
    let animate = false;
    onMount(() => animate = true);
</script>

{#if animate}
    <div class="footer" in:fly={{y:50, delay: 500, duration: 1500}}>
        <div class="centered">&#9877; 2024 Liminal Lyme</div>
        <div class="centered text-sm">Supporting your path to health from Boston, MA </div>
    </div>
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
</style>