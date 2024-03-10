<script>
    import { SearchOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons'
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';

	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition'
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
	import MSelect from './MSelect.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { illnesses, medications, supplements, tag_counts } from './constants.js'
    
	let animate = false;
    onMount(() => animate = true);

	let toastMessage = "";
	let isLoading = false;
	let searchTerm = "";

	let selectedMedications = []
	let selectedSupplements = []
	let selectedIllnesses = []
	let selectedMode = "Medications";
    let result_list = [];

	let slicedMedications = medications.slice(0, 10);
	let filteredMedications = medications;
	
	const pb = new PocketBase('https://openrxndatabase.hop.sh/');
	
	async function fetchDataForPostList() {
		try {
			isLoading = true;
			if (selectedMedications.length === 0) {
				toastMessage = "Select at least one medication/supplement";
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
			// let illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');
			// let filterQuery = `(${medicationsFilter}) && (${illnessesFilter})`;
			let filterQuery = `${medicationsFilter}`;

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


	function handleSelection(value) {
		if (selectedMedications.includes(value)) {
			selectedMedications = selectedMedications.filter(item => item !== value)
		} else {
    		selectedMedications = [...selectedMedications, value]
		}

		if (!slicedMedications.includes(value)){
			slicedMedications = [...slicedMedications, value]
		}

		searchTerm = "";
		filteredMedications = medications;
		
		console.log(selectedMedications)
	}

	function filterOptions(value) {
		const query = value.toLowerCase();
		filteredMedications = medications.filter(option => option.toLowerCase().includes(query));
  	}
console.log(selectedMedications)
</script>

<div class="intro-container">
	{#if animate}
		<main class="container" in:fly={{y:50, delay: 500, duration: 1500}}>


			<div class="infonote">Find tickborne disease anecdotes based on medications and supplements</div>
            
			<div class="togglebuttongroup">
				{#each slicedMedications as medication}
					<button class="togglebutton" on:click={handleSelection(medication)} style="background-color: {selectedMedications.includes(medication) ? 'var(--accent)' : 'var(--offwhite)'}; color: {selectedMedications.includes(medication) ? 'var(--offwhite)' : '#000'}; font-weight: {selectedMedications.includes(medication) ? 'bold' : 'normal'};"> {medication} </button> 
				{/each}
			</div>

			<input class="searchbar" type="text" bind:value={searchTerm} placeholder="Search..." on:input={(event) => {filterOptions(event.target.value)}}>
			
			<select class="selectbar" multiple on:click={(event) => {handleSelection(event.target.value)}}>
				{#each filteredMedications as option}
					<option value={option}> {option} ({tag_counts[option]})</option>
				{/each}
			</select>

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

	.searchbar {
		border-radius: 7px;
	}

	.selectbar {
		border-radius: 7px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}
	
	.togglebuttongroup{
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
		padding-bottom: 5%;
	}

	.togglebutton {
		font-size: 10pt;
		display: flex;
		flex-direction: row;
		/* margin: auto; */
		white-space: nowrap;
		padding: 5px 5px 5px 5px;
		border-radius: 7px;
	}

	.selector {
		font-size: 10pt;
		background-color: var(--offwhite);
		padding: 5px 5px 5px 5px;
		border-radius: 7px;
	}

    .infonote{
		color: white;
        padding-top: 5%;
        padding-bottom: 5%;
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