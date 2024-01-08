<script>
    import {EnvelopeSolid, GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { fly } from 'svelte/transition'

    let animate = false;
    onMount(() => animate = true);
</script>

<TopBanner />

Initial commit.