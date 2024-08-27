<script>
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import Search from '../../lib/components/Search.svelte';
    import Chronology from '../../lib/components/Chronology.svelte';
    import SharePost from '../../lib/components/SharePost.svelte';
    import { page } from '$app/stores'
    let path = $page.url.searchParams.get('path')
</script>

<div class="flex flex-col h-screen">
    <TopBanner />
    {#if path == null}
        <Search />
    {:else if path === 'chronologyTab'}
        <Chronology />
    {:else if path === 'shareTab'}
        <SharePost />
    {:else}
        <Search />
    {/if}
</div>