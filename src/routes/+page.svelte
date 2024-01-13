<script>
	import PostList from '../lib/components/PostList.svelte';
	import MSelect from '../lib/components/MSelect.svelte';
	import IntroInfo from '../lib/components/IntroInfo.svelte';
	import { SearchOutline } from 'flowbite-svelte-icons'
	import PocketBase from 'pocketbase';
	import { Toast } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { Spinner } from 'flowbite-svelte';
    import MedicalDisclaimer from '../lib/components/MedicalDisclaimer.svelte';
	import TopBanner from '../lib/components/TopBanner.svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition'
	import { illnesses, medications, tag_counts } from '../lib/components/constants.js'

	let animate = false;
    onMount(() => animate = true);

	let toastMessage = "";
	let isLoading = false;

	let selectedMedications = []
	let selectedIllnesses = []

	let fetched_posts = [];
    let result_list = [];
	const pb = new PocketBase('https://openrxndatabase.hop.sh/');
	// const pb = new PocketBase('http://127.0.0.1:8090');
	
	async function fetchDataForPostList() {
		try {
			isLoading = true;
			if (selectedMedications.length === 0 || selectedIllnesses.length === 0) {
				// Either selectedMedications or selectedIllnesses is empty, show a toast
				toastMessage = "Select at least one medication and one condition";
				showToast();
				return;
			}
			
			// handle "any" condition choice
			if (selectedIllnesses.includes("ALL CONDITIONS (ANY)")){
				selectedIllnesses = ["ALL CONDITIONS (ANY)"];
			}

			// handle "any" medication choice
			if (selectedMedications.includes("ALL MEDICATIONS (ANY)")){
				selectedMedications = ["ALL MEDICATIONS (ANY)"];
			}
			
			// console.log(selectedIllnesses)
			// console.log(selectedMedications)
			
			let medicationsFilter = selectedMedications.map(medication => `tags?~'${medication}'`).join(' && ');
			let illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');
			let filterQuery = `(${medicationsFilter}) && (${illnessesFilter})`;
			
			// console.log(medicationsFilter)
			// console.log(illnessesFilter)
			console.log(filterQuery)

			// `Tags?~'Lyme' && Tags?~'Doxycycline'`
			const fetched_posts = await pb.collection('posts').getList(1, 50, {
				sort: '-score',
				filter: filterQuery,
			});

			result_list = fetched_posts.items;
			// console.log(fetched_posts);
			// console.log(result_list);

			if (result_list.length === 0) {
				toastMessage = "No matches found.. check back soon!";
				showToast();
			}

		} catch (error) {
			console.error('Error fetching posts:', error);
			}
		
		finally {
				isLoading = false;
			}
		}

	let isToastVisible = false;
	function showToast() {
		isToastVisible = true;
		setTimeout(() => {
			isToastVisible = false;
		}, 4000);
	}
	
	const filterMedications = (e) => {
		selectedMedications = e.detail
	}
	
	const filterIllnesses = (e) => {
		selectedIllnesses = e.detail
	} 

</script>

<TopBanner />
<div class="intro-container">
	<IntroInfo />
	{#if animate}
		<main class="container" in:fly={{y:50, delay: 500, duration: 1500}}>
			<div class="centered-select" id="area-1">
				<MSelect options={illnesses} placeholderString={'Conditions'} tag_counts={tag_counts} on:choices={filterIllnesses}/>
				<MSelect options={medications} placeholderString={'Medications'} tag_counts={tag_counts} on:choices={filterMedications}/>
				<a href="#_" on:click={fetchDataForPostList} class="relative flex justify-center rounded px-5 py-2.5 overflow-hidden group bg-[#42bade] relative hover:bg-gradient-to-r hover:from-bg-[#42bade] hover:to-bg-[#42bade] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#42bade] transition-all ease-out duration-300">
					<span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
					<div class="flex items-center">
					  {#if isLoading}
						<Spinner size={6} />
					  {:else}
						<SearchOutline size="lg" />
					  {/if}
					</div>
				  </a>
			</div>
			<div class="post-area">
				<PostList fetchDataFunction={fetchDataForPostList} posts={result_list}/>
			</div>
			<div class="med-disclaimer">
				<MedicalDisclaimer />
			</div>
		</main>
	{/if}
</div>
<div class="toast-container">
	{#if isToastVisible}
	<Toast color="orange">
		<svelte:fragment slot="icon">
		  <ExclamationCircleSolid class="w-5 h-5" />
		  <span class="sr-only">Warning icon</span>
		</svelte:fragment>
		{toastMessage}
	  </Toast>
	{/if}
</div>

<style>
	.post-area {
		padding-bottom: 5%;
	}
	.med-disclaimer {
		padding-bottom: 20%;
	}
	.toast-container {
		position: fixed;
		left: 50%;
		top: 110pt;
		transform: translate(-50%, -50%);
  	}
</style>