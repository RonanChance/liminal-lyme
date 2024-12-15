<script>
    import { SearchOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { Toast, Spinner, Popover } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { all_tags, illnesses, tag_counts } from './constants.js';

	const pb = new PocketBase('https://data.liminallyme.com/');
    
	let animate = $state(false);
    onMount(() => animate = true);

	let toastMessage = $state("");
	let isLoading = $state(false);
    let isAiModeEnabled = $state(true);
	let searchTerm = $state("");

	let selectedItems = $state([]);
	let selectedMedications = [];
	let selectedSupplements = [];
	let excludedConditions = $state([]);
	let requiredConditions = $state(["Lyme Disease"]);
    let result_list = $state([]);

	let slicedItems = $state(all_tags.slice(0, 9));
	let filtered = $state(all_tags);

    let AISelectedItem = $state("");
    let AISelectedIllness = $state("");
    let AIItemCount = $state(9672);

	let dropdownOpen = $state(false);
    let illnessesDropdownOpen = $state(false);

    let selectItemMode = $state(false);
    let selectIllnessMode = $state(false);

	function toggleDropdown(boolean) {
		dropdownOpen = boolean;
        illnessesDropdownOpen = boolean;
	}

    function toggleIllnessesDropdown(boolean) {
        illnessesDropdownOpen = boolean;
    }

	let advancedOn = $state(false);
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
			} else {
                // If advanced mode is not on, we're going to require results to have Lyme disease 
                // since it's applicable to most people using this app
                const requiredFilter = `conditions?~'LYME DISEASE'`;
                filterQuery += (filterQuery ? ' && ' : '') + `(${requiredFilter})`;
            }

			console.log("Query", filterQuery)

			const fetched_posts = await pb.collection('posts').getList(1, 80, {
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

	let isToastVisible = $state(false);
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

    // reset values if user toggles between AI mode and regular search
    $effect(() => { resetValues(isAiModeEnabled); });
    function resetValues() {
        selectedItems = [];
    }

    // find number of posts matching the criteria
    $effect(() => { calculateNumberRedditPosts(AISelectedItem, AISelectedIllness)});
    async function calculateNumberRedditPosts(AISelectedItem, AISelectedIllness) {
        try {
			isLoading = true;
            if (AISelectedItem || AISelectedIllness) {
                let filterQuery = '';

                if (AISelectedItem) {
                    if (tag_counts[AISelectedItem]['label'] === 'MED') {
                        filterQuery += (filterQuery ? ' && ' : '') + `(medications?~'${AISelectedItem}')`;
                    }
                    else if (tag_counts[AISelectedItem]['label'] === 'SUP') {
                        filterQuery += (filterQuery ? ' && ' : '') + `(supplements?~'${AISelectedItem}')`;
                    }
                }

                if (AISelectedIllness) {
                    filterQuery += (filterQuery ? ' && ' : '') + `(conditions?~'${AISelectedIllness}')`;
                }

                const response = await pb.collection('posts').getList(1, 1, {
                    filter: filterQuery,
                });
                AIItemCount = response.totalItems;
            }
		} catch (error) {
			console.error('Error fetching count:', error);
        } finally {
            isLoading = false;
        }
    }
    
</script>

<label class="flex items-center cursor-pointer gap-2 ml-auto pt-2 pr-2">
    <input type="checkbox" value="" class="sr-only peer" bind:checked={isAiModeEnabled} />
    <div class="flex items-center pt-[2px] text-sm text-[var(--white)] ">AI Mode</div>
    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
</label>

<!-- AI MODE -->

{#if isAiModeEnabled}
    {#if animate}
        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto mt-4 mb-8">
            <h2 class="mb-0 text-center">AI Treatment Insights</h2>
            <h4 class="text-gray-200 opacity-70 text-center"><div class="font-bold inline opacity-100 text-gray-300">Quick Tip:</div> Search for your favorite supplement</h4>
        </div>
        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto gap-4">

            <div class="flex flex-col justify-start bg-[var(--white)] rounded">
                <div class="flex flex-col text-[var(--white)] text-center justify-start ">
                    
                    <div class="flex flex-row gap-2 justify-start border-b h-[60px]">
                        <div class="flex flex-row gap-3 text-[var(--darkbackground)] bg-gray-100 rounded-l py-[0.25rem] px-[1rem] w-[50%] items-center">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="min-w-10 h-10"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 9.5C11 8.34835 10.5607 7.1967 9.68198 6.31802C7.92462 4.56066 5.07538 4.56066 3.31802 6.31802C2.43934 7.1967 2 8.34835 2 9.5M11 9.5C11 10.6517 10.5607 11.8033 9.68198 12.682C7.92462 14.4393 5.07538 14.4393 3.31802 12.682C2.43934 11.8033 2 10.6517 2 9.5M11 9.5H2" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.7574 7.12132C15.9289 8.29289 17.8284 8.29289 19 7.12132C19.5858 6.53553 19.8787 5.76777 19.8787 5C19.8787 4.23223 19.5858 3.46447 19 2.87868C17.8284 1.70711 15.9289 1.70711 14.7574 2.87868C14.1716 3.46447 13.8787 4.23223 13.8787 5C13.8787 5.76777 14.1716 6.53553 14.7574 7.12132Z" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20.9052 17.381C22.3649 15.9213 22.3649 13.5546 20.9052 12.0948C19.4454 10.6351 17.0787 10.6351 15.619 12.0948L12.0948 15.619C10.6351 17.0787 10.6351 19.4454 12.0948 20.9052C13.5546 22.3649 15.9213 22.3649 17.381 20.9052L20.9052 17.381Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M14 14C14 14 14.2813 15.4596 15.911 17.0892C17.5407 18.7189 19 19 19 19" stroke="#2e473f" stroke-width="1.5"></path> </g></svg>
                            <div class="flex items-center text-left h-full">Supplement, Medication</div>
                        </div>
                        <button class="bg-[var(--white)] rounded text-[var(--darkbackground)] py-[0.25rem] px-[0.5rem] text-var(--darkbackground) truncate {AISelectedItem ? 'text-[var(--darkbackground)]' : 'text-gray-400'}" onclick={() => {selectItemMode = true; toggleDropdown(true);}}>
                            {AISelectedItem || 'Select..'}
                        </button>
                    </div>
                    
                    <div class="flex flex-row gap-2 justify-start h-[60px]">
                        <div class="flex flex-row gap-3 text-[var(--darkbackground)] bg-gray-100 rounded-l py-[0.25rem] px-[1rem] w-[50%] items-center">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-10 h-10"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M6 15C6 13.3431 7.34315 12 9 12C10.6569 12 12 13.3431 12 15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M4.5 11.5L4.91406 10.5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.4648 7.17122C14.4648 7.17122 15.7077 6.99983 16.5862 7.87832C17.4647 8.75682 17.2933 9.99964 17.2933 9.99964" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9.00013 9.29278C9.00013 9.29278 7.7573 9.46417 6.87881 8.58568C6.00032 7.70718 6.1717 6.46436 6.1717 6.46436" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.0001 13.1362C19.0001 13.1362 17.8381 13.6092 17.5165 14.8093C17.195 16.0093 17.9648 16.9999 17.9648 16.9999" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13.4209 17.772L14.9995 19" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.5 14V12" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 5L10 5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12.5 9.5L11.5 8.5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                            <div class="flex items-center text-left h-full">Condition</div>
                        </div>
                        <button class="bg-[var(--white)] rounded py-[0.25rem] px-[0.5rem] truncate {AISelectedIllness ? 'text-[var(--darkbackground)]' : 'text-gray-400'}" onclick={() => {selectIllnessMode = true; toggleIllnessesDropdown(true);}}>
                            {AISelectedIllness || 'Select..'}
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex justify-between mt-4">
                <div class="text-[var(--white)] text-3xl h-full flex items-center gap-1 ml-2">
                    {#if isLoading}
                        <Spinner size={6} color="gray" />
                    {:else}
                        {AIItemCount.toLocaleString()}
                    {/if}
                    <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button" class="pb-1">
                        <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Show information</span>
                    </button>
                    <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="right" placement="right">Number of posts matching your search criteria. Keep it above 0 for best results.</Popover>
                </div>
                <a href="#_" onclick={fetchDataForPostList} class="rounded bg-[var(--white)] text-normal px-[1rem] py-[0.5rem] border-2 border-[var(--white)] hover:shadow-[0_0_5px_var(--white)]">
                    <div class="flex flex-row gap-1">
                        <div class="">
                            <!-- {#if isLoading}
                                <Spinner size={6} color="gray" />
                            {:else}
                                <SearchOutline size="md"/>
                            {/if}
                        </div> -->
                        <div class="text-lg font-semibold items-center align-middle">
                            Search
                            {#if selectedItems.length >= 1}
                                ({selectedItems.length})
                            {/if}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    {/if}
{/if}


<!-- MEDICATION / SUPPLEMENT SELECTION -->
{#if selectItemMode}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" role="button" tabindex="0" onclick={() => {selectItemMode = false; toggleDropdown(false);}}>
        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto" role="button" tabindex="0" onclick={(event) => event.stopPropagation()}>
            <input class="mt-4 rounded w-[100%]" type="text" bind:value={searchTerm} onfocus={() => {toggleDropdown(true)}} onblur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Search Medication or Supplement" oninput={(event) => {filterOptions(event.target.value)}}>

            <div class="max-h-[170px] overflow-y-auto text-[12pt] bg-white rounded" style="display: {dropdownOpen ? 'block' : 'none'}">
                {#each filtered as option}
                    <div
                        class="mt-1 mb-1 pl-3"
                        onclick={() => {AISelectedItem = option; selectItemMode = false; toggleDropdown(false);}}
                        onkeydown={(event) => {
                            if (event.key === 'Enter') {
                                AISelectedItem = option;
                                selectItemMode = false;
                                toggleDropdown(false)
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
        </div>
    </div>
{/if}



<!-- ILLNESS SELECTION -->
{#if selectIllnessMode}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" role="button" tabindex="0" onclick={() => {selectIllnessMode = false}}>
        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto" role="button" tabindex="0" onclick={(event) => event.stopPropagation()}>
            <!-- <input class="mt-4 rounded w-[100%]" type="text" bind:value={searchTerm} onfocus={() => {toggleIllnessesDropdown(true)}} onblur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Select Illness"> -->

            <div class="max-h-[170px] overflow-y-auto text-[12pt] bg-white rounded" style="display: {illnessesDropdownOpen ? 'block' : 'none'}">
                {#each illnesses as option}
                    <div
                        class="mt-1 mb-1 pl-3"
                        onclick={() => {AISelectedIllness = option; selectIllnessMode = false; toggleDropdown(false);}}
                        onkeydown={(event) => {
                            if (event.key === 'Enter') {
                                AISelectedIllness = option;
                                selectIllnessMode = false;
                                toggleDropdown(false)
                                event.preventDefault();
                            }
                        }}
                        value={option}
                        role="button"
                        tabindex="0"
                    >
                        <!-- <span class="count" style="color: #575757;">({tag_counts[option]['count']})</span>  -->
                        <span class="option" style="font-weight: 500;">{option}</span>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}


<!-- DEFAULT REDDIT SEARCH MODE -->
{#if !isAiModeEnabled}
    {#if animate}
        <div class="flex flex-col max-w-[90%] sm:max-w-[60%] mx-auto" in:fade={{duration: 300}}>
            
            <div class="flex mt-6 gap-2 flex-wrap">
                {#each slicedItems as item}
                    <button class="text-[11pt] flex flex-row whitespace-nowrap px-[14px] py-[6px] rounded" onclick={() => handleSelection(item)} style="background-color: {selectedItems.includes(item) ? (tag_counts[item]['label'] === 'SUP' ? 'var(--supplement)' : 'var(--medication)') : 'var(--white)'}; color: {selectedItems.includes(item) ? 'var(--white)' : '#000'}; font-weight: {selectedItems.includes(item) ? 'bold' : 'normal'};">
                        {item}
                    </button>				
                {/each}
            </div>

            <div class="text-center text-white italic text-sm mt-4">Recommended: 1-3 selections</div>

            <input class="mt-4 rounded w-full" type="text" bind:value={searchTerm} onfocus={() => {toggleDropdown(true)}} onblur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Search Medication or Supplement" oninput={(event) => {filterOptions(event.target.value)}}>

            <div class="max-h-[170px] overflow-y-auto text-[12pt] bg-white rounded" style="display: {dropdownOpen ? 'block' : 'none'}">
                {#each filtered as option}
                    <div
                        class="mt-1 mb-1 pl-3"
                        onclick={() => handleSelection(option)}
                        onkeydown={(event) => {
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
                <button class="text-[var(--white)] underline mt-3 text-sm" onclick={toggleAdvanced}>Advanced Mode: {advancedOn ? 'On' : 'Off'}</button>
            </div>
            
            <div class="flex flex-wrap text-[var(--white)]" style="display: {advancedOn ? 'block' : 'none'}">
                <div class="advanceddescription" style="margin-bottom: 10px;">
                    <span style="font-weight: bold;">Bold</span>: Required <br />
                    <span style="text-decoration: line-through;">Strikethrough</span>: Excluded
                </div>
                <div class="flex mt-6 gap-2 flex-wrap">
                    {#each illnesses as illness}
                        <button onclick={() => {handleAdv(illness)}} style="text-decoration: { excludedConditions.includes(illness) ? 'line-through' : 'none'}; background-color: { requiredConditions.includes(illness) ? 'var(--accent)' : 'var(--lightbackground)'}; font-weight: { requiredConditions.includes(illness) ? 'bold' : 'normal'}; color: { requiredConditions.includes(illness) ? 'var(--black)' : 'var(--white)'};" class="text-[11pt] flex flex-row rounded whitespace-nowrap px-[14px] py-[6px]">{illness}</button>
                    {/each}
                </div>	
            </div>

            <div style="display: flex; justify-content: center;">
                <a href="#_" onclick={fetchDataForPostList} class="whitebutton rounded-lg mt-6">
                    <div class="flex flex-row gap-1">
                        <div class="">
                            {#if isLoading}
                                <Spinner size={6} color="gray" />
                            {:else}
                                <SearchOutline size="lg"/>
                            {/if}
                        </div>
                        <div class="text-xl font-semibold items-center align-middle">
                            Search
                            {#if selectedItems.length >= 1}
                                ({selectedItems.length})
                            {/if}
                        </div>
                    </div>
                </a>
            </div>
        </div>
    {/if}

    <div class="flex flex-col max-w-[90%] sm:max-w-[60%] mx-auto my-0" in:fade={{duration: 300}}>
        {#if result_list.length > 1}
            <div class="text-[var(--white)] mt-6 text-center">
                {#if result_list.length === 30}
                    30+ Results
                {:else}
                    {result_list.length}+ Results
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
        <div class="med-disclaimer mt-12 mb-12 opacity-30 " in:fade={{duration: 200}}>
            <MedicalDisclaimer />
        </div>
    </div>
{/if}

<div class="fixed left-1/2 top-[110pt] transform -translate-x-1/2 -translate-y-1/2 z-10">
	{#if isToastVisible}
        <Toast >
            <svelte:fragment slot="icon">
                <ExclamationCircleSolid class="w-5 h-5" color=orange />
                <span class="sr-only">Warning icon</span>
            </svelte:fragment>
            {toastMessage}
        </Toast>
	{/if}
</div>