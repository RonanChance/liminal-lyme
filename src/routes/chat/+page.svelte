<script>
    import {EnvelopeSolid, GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import PocketBase from 'pocketbase';
    import { fly } from 'svelte/transition'
    import { Button, Checkbox, Label, Input } from 'flowbite-svelte';

    // let animate = false;
    // onMount(() => animate = true);

</script>

<TopBanner />

<h1> CHAT </h1>
<h2> You made it! </h2>