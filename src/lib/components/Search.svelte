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

	const pb = new PocketBase('https://data.openrxn.com/');
    
	let animate = false;
    onMount(() => animate = true);

	let toastMessage = "";
	let isLoading = false;
	let searchTerm = "";

	let selectedItems = [];
	let selectedMedications = [];
	let selectedSupplements = [];
	let excludedConditions = [];
	let requiredConditions = ["Lyme Disease"];
    let result_list = [];

	let slicedItems = all_tags.slice(0, 9);
	let filtered = all_tags;

	let dropdownOpen = false;
	function toggleDropdown(boolean) {
		dropdownOpen = boolean;
	}

	let advancedOn = false;
	function toggleAdvanced() {
		advancedOn = !advancedOn;
	}
	
	async function fetchDataForPostList() {
		try {
			isLoading = true;

			// CLEAR meds and sups from last search
			selectedMedications = []
			selectedSupplements = []

			for (const item of selectedItems) {
				if (tag_counts[item]["label"] === "MED") {
					selectedMedications.push(item);
				}
				if (tag_counts[item]["label"] === "SUP") {
					selectedSupplements.push(item);
				}
			}

			let filterQuery = '';
			// let medFilter = selectedMedications.map(medication => `medications?~'${medication}'`).join(' && ');
			// let supFilter = selectedSupplements.map(supplement => `supplements?~'${supplement}'`).join(' && ')
			// Include selectedMedications in medications tags
			if (selectedMedications.length > 0) {
				const medFilter = selectedMedications.map(medication => `medications?~'${medication}'`).join(' && ');
				filterQuery += `(${medFilter})`;
			}

			// Include selectedSupplements in supplements tags
			if (selectedSupplements.length > 0) {
				const supFilter = selectedSupplements.map(supplement => `supplements?~'${supplement}'`).join(' && ');
				filterQuery += (filterQuery ? ' && ' : '') + `(${supFilter})`;
			}

			// Exclude excludedConditions from conditions tags
			if (advancedOn){
				if (requiredConditions.length > 0) {
					const requiredFilter = requiredConditions.map(condition => `conditions?~'${condition}'`).join(' && ');
					filterQuery += (filterQuery ? ' && ' : '') + `(${requiredFilter})`;
				}
				if (excludedConditions.length > 0) {
					const excludeFilter = excludedConditions.map(condition => `conditions!~'${condition}'`).join(' && ');
					filterQuery += (filterQuery ? ' && ' : '') + `(${excludeFilter})`;
				}
			}

			// If advanced mode is not on, we're going to require results to have Lyme disease 
			// since it's applicable to most people using this app
			const requiredFilter = `conditions?~'LYME DISEASE'`;
			filterQuery += (filterQuery ? ' && ' : '') + `(${requiredFilter})`;

			console.log(filterQuery)

			const fetched_posts = await pb.collection('posts').getList(1, 30, {
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

	function handleAdv(value) {

		// check that value is not in exclusions or requirement
		// Add to requirement 
		if (!excludedConditions.includes(value) && !requiredConditions.includes(value)) {
			requiredConditions = [...requiredConditions, value];
		}

		// IF value is in requirment, we should move to exclusion
		else if (requiredConditions.includes(value)) {
			requiredConditions = requiredConditions.filter(item => item !== value);
			excludedConditions = [...excludedConditions, value];
		}

		// If value is in exclusion we should remove from exclusion
		else if (excludedConditions.includes(value)) {
			excludedConditions = excludedConditions.filter(item => item !== value);
		}

		console.log("requirements", requiredConditions);
		console.log("exclusions", excludedConditions);
	}

	function filterOptions(value) {
		const query = value.toLowerCase();
		filtered = all_tags.filter(option => option.toLowerCase().includes(query));
  	}

</script>

<div class="intro-container">
	{#if animate}
		<main class="container" in:fade={{y:50, delay: 0, duration: 1000}}>


			<div class="infonote">Select Medications & Supplements
				<div class="subscriptnote">Recommend: 1-3 selections</div>
			</div>
            
			<div class="togglebuttongroup">
				{#each slicedItems as item}
					<button class="togglebutton" on:click={() => handleSelection(item)} style="background-color: {selectedItems.includes(item) ? (tag_counts[item]['label'] === 'SUP' ? 'var(--supplement)' : 'var(--medication)') : 'var(--offwhite)'}; color: {selectedItems.includes(item) ? 'var(--offwhite)' : '#000'}; font-weight: {selectedItems.includes(item) ? 'bold' : 'normal'};">
						{item}
					</button>				
				{/each}
			</div>

			<input class="searchbar" type="text" bind:value={searchTerm} on:focus={() => {toggleDropdown(true)}} on:blur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Search Medications & Supplements..." on:input={(event) => {filterOptions(event.target.value)}}>

			<div class="entirelist" style="display: {dropdownOpen ? 'block' : 'none'}">
				{#each filtered as option}
					<div class="spaced-option" on:click={() => {handleSelection(option)}} value={option}>
						<span class="count" style="color: #575757;">({tag_counts[option]['count']})</span> 
						<span class="option" style="color: { tag_counts[option]['label'] === 'MED' ? 'var(--medication)' : 'var(--supplement)'}; font-weight: 500;">{option}</span>
					</div>
				{/each}
			</div>
			
			<div style="display: flex; justify-content: right;">
				<button class="excludenote" on:click={toggleAdvanced}>Advanced Mode: {advancedOn ? 'On' : 'Off'}</button>
			</div>
			
			<div class="advancedbuttongroup" style="display: {advancedOn ? 'block' : 'none'}">
				<div class="advanceddescription" style="margin-bottom: 10px;">
					<span style="font-weight: bold;">Bold</span>: Required <br />
					<span style="text-decoration: line-through;">Strikethrough</span>: Excluded
				</div>
					<div class="togglebuttongroup">
						{#each illnesses as illness}
							<button on:click={() => {handleAdv(illness)}} style="text-decoration: { excludedConditions.includes(illness) ? 'line-through' : 'none'}; box-shadow: { requiredConditions.includes(illness) ? 'inset 0 0 10px var(--accent)' : 'none'}; font-weight: { requiredConditions.includes(illness) ? 'bold' : 'normal'}; background-color: { excludedConditions.includes(illness) ? 'var(--blue)' : 'var(--bluegray)'};" class="advancedbutton">{illness}</button>
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

			{#if result_list.length > 1}
				<div class="searchcount">
					{#if result_list.length === 30}
						30+ Results
					{:else}
						{result_list.length} Results
					{/if}
				</div>
			{/if}

			<div class="post-area">
				<PostList posts={result_list}/>
			</div>
			<div class="med-disclaimer" in:fade={{y:50, delay: 1000, duration: 1000}}>
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

	.searchcount {
		color: white;
		margin-top: 5%;
		text-align: center;
	}
	.excludenote {
		color: white;
		text-decoration: underline;
		margin-top: 2%;
	}

	.advancedbuttongroup {
		color: white;
		display: flex;
		flex-wrap: wrap;
	}

	.advancedbutton {
		color: white;
		background-color: var(--blue);
		font-size: 11pt;
		max-width: fit-content;
		max-width: 90%;

		padding: 6px 14px 6px 14px;
		border-radius: 0.25rem;
	}

	.togglebuttongroup {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.togglebutton {
		font-size: 11pt;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		padding: 6px 14px 6px 14px;
		border-radius: 0.25rem;
	}

	.searchbar {
		margin-top: 5%;
		border-radius: 0.5rem;
		width: 100%;
	}
	.searchbutton {
		margin-top: 5%;
		border-radius: 0.5rem;
		width: 50%;
	}

	.entirelist {
		max-height: 150px;
		overflow-y: auto;
		font-size: 12pt;
		background-color: #fff;
		border-radius: 7px;
	}

	.spaced-option {
		margin-top: 5px;
		margin-bottom: 5px;
		padding-left: 3%;
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
		text-align: center;
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