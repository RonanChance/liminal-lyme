<script>
    import { SearchOutline, ExclamationCircleSolid, AngleRightSolid, AngleDownSolid } from 'flowbite-svelte-icons'
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition'
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
	import MSelect from './MSelect.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { all_tags, illnesses, tag_counts } from './constants.js';

	const pb = new PocketBase('https://pb.openrxn.com/');
    
	let animate = false;
    onMount(() => animate = true);

	let toastMessage = "";
	let isLoading = false;
	let searchTerm = "";

	let selectedItems = [];
	let selectedMedications = [];
	let selectedSupplements = [];
	let excludeConditions = [];
    let result_list = [];

	let slicedItems = all_tags.slice(0, 9);
	let filtered = all_tags;

	let dropdownOpen = false;
	function toggleDropdown(boolean) {
		dropdownOpen = boolean;
	}

	let exclusionsOn = false;
	function toggleExclusions() {
		exclusionsOn = !exclusionsOn;
	}
	
	async function fetchDataForPostList() {
		try {
			isLoading = true;
			if (selectedItems.length === 0) {
				toastMessage = "Select at least one medication/supplement";
				showToast();
				return;
			}

			// let itemsFilter = selectedItems.map(medication => `tags?~'${medication}'`).join(' && ');
			// let illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');
			// let filterQuery = `(${itemsFilter}) && (${illnessesFilter})`;
			let filterQuery = `${itemsFilter}`;

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
		if (value === "" || value === " "){
			return;
		}

		if (selectedItems.includes(value)) {
			selectedItems = selectedItems.filter(item => item !== value);
		} else {
    		selectedItems = [...selectedItems, value];
		}

		if (!slicedItems.includes(value)){
			slicedItems = [...slicedItems, value];
		}

		searchTerm = "";
		filtered = all_tags;
		
		console.log(selectedItems);
	}

	function handleExclusion(value) {
		if (excludeConditions.includes(value)) {
			excludeConditions = excludeConditions.filter(item => item !== value);
		} else {
			excludeConditions = [...excludeConditions, value];
		}

		console.log(excludeConditions);
	}

	function filterOptions(value) {
		const query = value.toLowerCase();
		filtered = all_tags.filter(option => option.toLowerCase().includes(query));
  	}

	  function convertToLowercase(value) {
		return value.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
			return letter.toLowerCase(); // You need to return the modified letter
		});
	}

</script>

<div class="intro-container">
	{#if animate}
		<main class="container" in:fly={{y:50, delay: 500, duration: 1500}}>


			<div class="infonote">Select Medications & Supplements
				<div class="subscriptnote">Recommend: 1-3 selections</div>
			</div>
            
			<div class="togglebuttongroup">
				{#each slicedItems as item}
					<button class="togglebutton" on:click={handleSelection(item)} style="background-color: {selectedItems.includes(item) ? 'var(--accent)' : 'var(--offwhite)'}; color: {selectedItems.includes(item) ? 'var(--offwhite)' : '#000'}; font-weight: {selectedItems.includes(item) ? 'bold' : 'normal'};"> {convertToLowercase(item)} </button> 
				{/each}
			</div>

			<input class="searchbar" type="text" bind:value={searchTerm} on:focus={() => {toggleDropdown(true)}} on:blur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Search Medications & Supplements..." on:input={(event) => {filterOptions(event.target.value)}}>

			<select class="selector" multiple on:click={(event) => {handleSelection(event.target.value)}} style="display: {dropdownOpen ? 'block' : 'none'}">
				{#each filtered as option}
					<option class="spaced-option" style="color: { tag_counts[option]['label'] === 'MED' ? 'var(--medication)' : 'var(--supplement)'}; font-weight: 500;" value={option}> ({tag_counts[option]['count']}) {convertToLowercase(option)} </option>
				{/each}
			</select>
			
			<div style="display: flex; justify-content: right;">
				<button class="excludenote" on:click={toggleExclusions}>Exclusions: {exclusionsOn ? 'On' : 'Off'}</button>
			</div>
			
			<div class="exclusionbuttongroup" style="display: {exclusionsOn ? 'block' : 'none'}">
					<div class="togglebuttongroup">
						{#each illnesses as illness}
							<button on:click={() => {handleExclusion(illness)}} style="text-decoration: { excludeConditions.includes(illness) ? 'line-through' : 'none'}; background-color: { excludeConditions.includes(illness) ? 'var(--bluedark)' : 'var(--blue)'};" class="exclusionbutton">{convertToLowercase(illness)}</button>
						{/each}
					</div>	
			</div>

			<div style="display: flex; justify-content: center;">
				<a href="#_" on:click={fetchDataForPostList} class="searchbutton relative flex justify-center rounded px-4 py-2.5 overflow-hidden group bg-[var(--accent)] hover:bg-gradient-to-r hover:from-bg-[var(--accent)] hover:to-bg-[var(--accent)] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[var(--accent)] transition-all ease-out duration-300">
					<span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
					<div class="flex items-center" style="gap:8px; font-weight: bold;">
					Search
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

	.excludenote {
		color: white;
		text-decoration: underline;
		margin-top: 2%;
		margin-bottom: 4%;
	}

	.exclusionbuttongroup {
		color: white;
		display: flex;
		flex-wrap: wrap;
	}

	.exclusionbutton {
		color: white;
		background-color: var(--blue);
		font-size: 11pt;
		max-width: fit-content;
		max-width: 90%;

		padding: 6px 14px 6px 14px;
		border-radius: 15px;
	}

	.togglebuttongroup {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		padding-bottom: 5%;
	}

	.togglebutton {
		font-size: 11pt;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		padding: 6px 14px 6px 14px;
		border-radius: 15px;
	}

	.searchbar {
		border-radius: 7px;
		width: 100%;
	}
	.searchbutton {
		border-radius: 50px;
		width: 50%;
	}

	.spaced-option {
		margin-bottom: 5px;
	}

	.selector {
		font-size: 12pt;
		background-color: #fff;
		border-radius: 7px;
		min-height: 200px;
	}

	.container {
		display: flex;
		flex-direction: column;
	}

    .infonote{
		font-size: 17pt;
		color: white;
        padding-top: 5%;
        padding-bottom: 5%;
		margin: auto;
    }

	.subscriptnote {
		font-size: 12pt;
		font-style: italic;
		text-align: center;
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