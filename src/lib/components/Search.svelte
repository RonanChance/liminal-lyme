<script>
    import { SearchOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { Toast, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { all_tags, illnesses, tag_counts } from './constants.js';

	const pb = new PocketBase('https://data.liminallyme.com/');
    
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

<div class="text-center text-2xl text-white py-5 bg-[var(--lightbackground)] rounded-b-lg text-bold flex flex-col">
    <span>Medication & Supplement Search</span>
    <span class="text-center text-sm">Search <a class="underline" href="/about#where_is_the_data_from">subreddits</a> with key terms</span>
</div>

<div class="intro-container">
	{#if animate}
		<main class="flex flex-col max-w-[90%] sm:max-w-[60%] mx-auto my-0" in:fade={{duration: 300}}>
            
			<div class="flex mt-6 gap-2 flex-wrap">
				{#each slicedItems as item}
					<button class="text-[11pt] flex flex-row whitespace-nowrap px-[14px] py-[6px] rounded" on:click={() => handleSelection(item)} style="background-color: {selectedItems.includes(item) ? (tag_counts[item]['label'] === 'SUP' ? 'var(--supplement)' : 'var(--medication)') : 'var(--white)'}; color: {selectedItems.includes(item) ? 'var(--white)' : '#000'}; font-weight: {selectedItems.includes(item) ? 'bold' : 'normal'};">
						{item}
					</button>				
				{/each}
			</div>

            <div class="text-center text-white italic text-sm mt-4">Recommend: 1-3 selections</div>

			<input class="mt-4 rounded w-full" type="text" bind:value={searchTerm} on:focus={() => {toggleDropdown(true)}} on:blur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Search Medications & Supplements..." on:input={(event) => {filterOptions(event.target.value)}}>

			<div class="max-h-[170px] overflow-y-auto text-[12pt] bg-white rounded" style="display: {dropdownOpen ? 'block' : 'none'}">
				{#each filtered as option}
					<div
						class="mt-1 mb-1 pl-3"
						on:click={() => handleSelection(option)}
						on:keydown={(event) => {
							if (event.key === 'Enter') {
								handleSelection(option);
								event.preventDefault();
							}
						}}
						value={option}
						role="button"
						tabindex="0"
					>
						<span class="count" style="color: #575757;">({tag_counts[option]['count']})</span> 
						<span class="option" style="color: { tag_counts[option]['label'] === 'MED' ? 'var(--medication)' : 'var(--supplement)'}; font-weight: 500;">{option}</span>
					</div>
				{/each}
			</div>
			
			<div style="display: flex; justify-content: right;">
				<button class="text-[var(--white)] underline mt-3 text-sm" on:click={toggleAdvanced}>Advanced Mode: {advancedOn ? 'On' : 'Off'}</button>
			</div>
			
			<div class="flex flex-wrap text-[var(--white)]" style="display: {advancedOn ? 'block' : 'none'}">
				<div class="advanceddescription" style="margin-bottom: 10px;">
					<span style="font-weight: bold;">Bold</span>: Required <br />
					<span style="text-decoration: line-through;">Strikethrough</span>: Excluded
				</div>
				<div class="flex mt-6 gap-2 flex-wrap">
					{#each illnesses as illness}
						<button on:click={() => {handleAdv(illness)}} style="text-decoration: { excludedConditions.includes(illness) ? 'line-through' : 'none'}; background-color: { requiredConditions.includes(illness) ? 'var(--accent)' : 'var(--lightbackground)'}; font-weight: { requiredConditions.includes(illness) ? 'bold' : 'normal'}; color: { requiredConditions.includes(illness) ? 'var(--black)' : 'var(--white)'};" class="text-[11pt] flex flex-row rounded whitespace-nowrap px-[14px] py-[6px]">{illness}</button>
					{/each}
				</div>	
			</div>

			<div style="display: flex; justify-content: center;">
				<a href="#_" on:click={fetchDataForPostList} class="whitebutton mt-6 align-middle">
					<div class="flex items-center" style="gap:8px; font-weight: bold; font-size: 20px;">
					{#if isLoading}
						<Spinner size={6} color="gray" />
					{:else}
						<SearchOutline size="lg"/>
					{/if}
					Search
					{#if selectedItems.length >= 1}
						({selectedItems.length})
					{/if}
					</div>
				</a>
			</div>

			{#if result_list.length > 1}
				<div class="text-[var(--white)] mt-6 text-center">
					{#if result_list.length === 30}
						30+ Results
					{:else}
						{result_list.length} Results
					{/if}
					<div class="flex flex-row items-center justify-center">
						<svg class="w-8 h-8 me-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 3.5V2M5.06066 5.06066L4 4M5.06066 13L4 14.0607M13 5.06066L14.0607 4M3.5 9H2M15.8645 16.1896L13.3727 20.817C13.0881 21.3457 12.9457 21.61 12.7745 21.6769C12.6259 21.7349 12.4585 21.7185 12.324 21.6328C12.1689 21.534 12.0806 21.2471 11.9038 20.6733L8.44519 9.44525C8.3008 8.97651 8.2286 8.74213 8.28669 8.58383C8.33729 8.44595 8.44595 8.33729 8.58383 8.2867C8.74213 8.22861 8.9765 8.3008 9.44525 8.44519L20.6732 11.9038C21.247 12.0806 21.5339 12.169 21.6327 12.324C21.7185 12.4586 21.7348 12.6259 21.6768 12.7745C21.61 12.9458 21.3456 13.0881 20.817 13.3728L16.1896 15.8645C16.111 15.9068 16.0717 15.9279 16.0374 15.9551C16.0068 15.9792 15.9792 16.0068 15.9551 16.0374C15.9279 16.0717 15.9068 16.111 15.8645 16.1896Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
						Click the highlighted terms!
					</div>
				</div>
			{/if}

			<div class="pb-2">
				<PostList posts={result_list}/>
			</div>
			<div class="med-disclaimer mt-12 mb-12" in:fade={{duration: 200}}>
				<MedicalDisclaimer />
			</div>
		</main>
	{/if}
</div>

<div class="fixed left-1/2 top-[110pt] transform -translate-x-1/2 -translate-y-1/2 z-10">
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