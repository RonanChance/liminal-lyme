<script>
    import { SearchOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons'
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition'
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
	import MSelect from './MSelect.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { illnesses, medications, tag_counts } from './constants.js'
    
	let animate = false;
    onMount(() => animate = true);

	let toastMessage = "";
	let isLoading = false;

	let selectedMedications = []
	let selectedIllnesses = []
    let result_list = [];
	
	const pb = new PocketBase('https://openrxndatabase.hop.sh/');
	
	async function fetchDataForPostList() {
		try {
			isLoading = true;
			if (selectedMedications.length === 0 || selectedIllnesses.length === 0) {
				// Either selectedMedications or selectedIllnesses is empty, show a toast
				toastMessage = "Select at least one medication and one condition";
				showToast();
				return;
			}

			if (selectedIllnesses.includes("ALL CONDITIONS (ANY)")){
				selectedIllnesses = ["ALL CONDITIONS (ANY)"];
			}

			if (selectedMedications.includes("ALL MEDICATIONS (ANY)")){
				selectedMedications = ["ALL MEDICATIONS (ANY)"];
			}

			let medicationsFilter = selectedMedications.map(medication => `tags?~'${medication}'`).join(' && ');
			let illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');
			let filterQuery = `(${medicationsFilter}) && (${illnessesFilter})`;

			const fetched_posts = await pb.collection('posts').getList(1, 50, {
				sort: '-score',
				filter: filterQuery,
			});

			result_list = fetched_posts.items;

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

<div class="intro-container">
	{#if animate}
		<main class="container" in:fly={{y:50, delay: 500, duration: 1500}}>
            
            <div class="infonote" style="color: white; text-align: center; font-size: 12pt;">We collect open-source tickborne disease data so you can see how people with your <a class="highlight" href="/about#what_conditions_are_supported">conditions</a> react to <a class="highlight" href="/about#what_medications_are_supported">medications</a>
                <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
                    <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="sr-only">Show information</span>
                </button>
            </div>
            <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is currently focused on tickborne disease data from Reddit, but will expand in the future</Popover>
			
            <div class="centered-select" id="area-1">
				<MSelect options={illnesses} placeholderString={'Conditions'} tag_counts={tag_counts} on:choices={filterIllnesses}/>
				<MSelect options={medications} placeholderString={'Medications'} tag_counts={tag_counts} on:choices={filterMedications}/>
				<a href="#_" on:click={fetchDataForPostList} class="relative flex justify-center rounded px-4 py-2.5 overflow-hidden group bg-[var(--accent)] relative hover:bg-gradient-to-r hover:from-bg-[var(--accent)] hover:to-bg-[var(--accent)] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[var(--accent)] transition-all ease-out duration-300">
					<span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
					<div class="flex items-center">
					  {#if isLoading}
						<Spinner size={6} />
					  {:else}
						<SearchOutline size="lg"/>
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
    .infonote{
        padding-top: 10%;
        padding-bottom: 8%;
    }
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