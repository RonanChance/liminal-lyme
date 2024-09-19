<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition'
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';

	const pb = new PocketBase('https://data.liminallyme.com/');
    import { page } from '$app/stores'
    let username = $page.url.searchParams.get('username')

    let animate = false;
    onMount(() => animate = true);

    let result_list;
    async function getPosts(){
        result_list = await pb.collection('posts').getList(1, 10, {
            filter: 'author="'+ username + '"',
            sort: '-date'
        }); 
        result_list = result_list.items;
    }
    getPosts();
</script>

<div class="intro-container">
	{#if animate}
		<main class="flex flex-col xl:max-w-[60%] max-w-[90%] m-auto" in:fade={{duration: 2000}}>
			<div class="text-2xl text-white text-center pt-8 pb-3">
                View User Posts Over Time
				<div class="text-base italic text-center">See Progress & Setbacks</div>
			</div>
            <div class="text-xl text-white text-center">
                User: <span style="color:var(--accent);">{username}</span>
            </div>
            <div class="post-area" in:fly={{duration: 1500}}>
				<PostList posts={result_list} chronologyMode=true/>
			</div>
			<div class="med-disclaimer" in:fade={{duration: 1000}}>
				<MedicalDisclaimer />
			</div>
		</main>
	{/if}
</div>