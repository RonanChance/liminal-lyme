<script>
    import { SearchOutline, ExclamationCircleSolid, AngleRightSolid, AngleDownSolid } from 'flowbite-svelte-icons'
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition'
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { all_tags, illnesses, tag_counts } from './constants.js';

	const pb = new PocketBase('https://data.liminallyme.com/');

    import { page } from '$app/stores'
    let username = $page.url.searchParams.get('username')

    let animate = false;
    onMount(() => animate = true);

    // const users_list = ['lymnlym', 'BbyFlakes', 'OrganicRelics']
    const selected_user = 'lymnlym';

    let result_list;
    async function getPosts(){
        result_list = await pb.collection('posts').getList(1, 10, {
            filter: 'author="'+ username + '"',
            sort: '-date'
        }); 
        result_list = result_list.items;
        console.log(result_list)
    }
    getPosts();

</script>

<div class="intro-container">
	{#if animate}
		<main class="container" in:fade={{y:50, delay: 0, duration: 2000}}>

			<div class="infonote">
                View User Posts Over Time
				<div class="subscriptnote">See Progress & Setbacks</div>
			</div>

            <div class="usertitle">
                User: <span style="color:var(--accent);">{username}</span>
            </div>

            <div class="post-area" in:fly={{y:50, delay: 500, duration: 1500}}>
				<PostList posts={result_list} chronologyMode=true/>
			</div>
            
			<div class="med-disclaimer" in:fade={{y:50, delay: 1000, duration: 1000}}>
				<MedicalDisclaimer />
			</div>
		</main>
	{/if}
</div>

<style>
    .container {
		display: flex;
		flex-direction: column;
	}
    
    .infonote{
		font-size: 17pt;
		color: white;
        text-align: center;
        padding-top: 5%;
        padding-bottom: 3%;
    }

    .usertitle{
		font-size: 17pt;
		color: white;
        text-align: center;

    }

	.subscriptnote {
		font-size: 12pt;
		font-style: italic;
		text-align: center;
	}

</style>