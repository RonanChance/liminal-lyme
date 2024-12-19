<script>
    import { SearchOutline, ExclamationCircleSolid, ChevronDownOutline } from 'flowbite-svelte-icons';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
	import { Toast, Spinner, Popover, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import PocketBase from 'pocketbase';
	import PostList from './PostList.svelte';
    import MedicalDisclaimer from './MedicalDisclaimer.svelte';
	import { all_tags, illnesses, tag_counts } from './constants.js';
    import { Skeleton } from 'flowbite-svelte';

	const PB_DATA = new PocketBase('https://data.liminallyme.com');
    const PB_USERS = new PocketBase('https://pb.liminallyme.com');
    
	let animate = $state(false);
    onMount(() => animate = true);

	let toastMessage = $state("");
	let isLoading = $state(false);
    let isAIModeEnabled = $state(true);
    let isAIResultsEnabled = $state(true);
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
    let AIOptionalText = $state("");
    let AIItemCount = $state(9672);

	let dropdownOpen = $state(false);
    let illnessesDropdownOpen = $state(false);

    let selectItemMode = $state(false);
    let selectIllnessMode = $state(false);

    let authorized = $state(false);
    let promptLogin = $state(false);

    let email = $state('');
    let username = $state('');
    let userId = $state('');

    onMount(async () => {
        if (browser) {
            // window.addEventListener('keydown', handleKeydown);
            const storedEmail = getCookie('email');
            const storedUsername = getCookie('username');
            const storedUserId = getCookie('userId');
            if (storedEmail && storedEmail.length >= 5 && storedUserId) {
                email = storedEmail;
                username = storedUsername;
                userId = storedUserId;
                authorized = true;
            }
        }
    });

    async function loginHandler(event) {
        const providerChoice = event.currentTarget.dataset.value;
        event.stopPropagation();
        const w = window.open();
        try {
            const data = await PB_USERS.collection("users").authWithOAuth2({
                provider: providerChoice,
                urlCallback: (url) => { 
                    w.location.href = url;
                 }
            });
            
            email = data.meta.email;
            username = data.meta?.username || data.meta?.name;
            userId = data.record.id;

            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;
            
            authorized = true;
            promptLogin = false;

            // fix username if necessary
            if (data.record.username !== username) {
                try {
                    const response = await fetch('/search/updateUsername', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({"userId": userId, "username": username})
                        });
                } catch (e) {
                    console.log(e);
                }
            }

        } catch (e) {
            console.error(e);
        }
    }

    async function logout() {
    try {
            await PB_USERS.authStore.clear();
            email = '';
            username = '';
            userId = '';
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;
            authorized = false;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

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

			const fetched_posts = await PB_DATA.collection('posts').getList(1, 80, {
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
    $effect(() => { resetValues(isAIModeEnabled); });
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

                const response = await PB_DATA.collection('posts').getList(1, 1, {
                    filter: filterQuery,
                });
                AIItemCount = response.totalItems;
            }
		} catch (error) {
            AIItemCount = null;
			console.error('Error fetching count:', error);
        } finally {
            isLoading = false;
        }
    }

    async function AISearch() {
        if (AISelectedItem && AISelectedIllness) {
            if (!authorized)
                promptLogin = true;
            else {
                isAIResultsEnabled = true;
                
                console.log('Begin search for', AISelectedItem, AISelectedIllness, AIOptionalText);
                const response = await fetch('/search/queryAI', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({"AISelectedItem": AISelectedItem, "AISelectedIllness": AISelectedIllness, "AIOptionalText": AIOptionalText})
                });

                const result = await response.json();
            }
        } else {
            toastMessage = '';
            if (!AISelectedItem)
                toastMessage += (toastMessage ? '\n' : '') + "Required: Supplement/Medication";
            if (!AISelectedIllness)
                toastMessage += (toastMessage ? '\n' : '') + "Required: Condition";
            showToast();
        }
    } 
    
</script>

{#if promptLogin}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" role="button" tabindex="0" onclick={() => {promptLogin = false;}}>
        <div class="flex flex-col items-center justify-center bg-[var(--white)] px-6 py-6 rounded gap-2">
            <div class="">
                <img src="/banner.png" class="mainlogo w-[200px] sm:w-[250px] xl:w-[250px] px-1 py-1 md:px-0" alt="LiminalLyme" />
            </div>
            <div class="text-[var(--darkbackground)] font-regular text-2xl">Login</div>
            <div class="text-center text-[var(--darkbackground)] font-regular font-light max-w-[70%]">Authorization is required to generate AI insights</div>
            <div class="flex flex-col justify-center items-center mt-2 gap-2">
                <button data-value="google" onclick={loginHandler} class="gsi-material-button">
                    <div class="gsi-material-button-state"></div>
                    <div class="gsi-material-button-content-wrapper">
                        <div class="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                        </div>
                        <span class="gsi-material-button-contents" style="font-weight: bold;">Continue with Google</span>
                        <span style="display: none;">Continue with Google</span>
                    </div>
                </button>

                <button onclick={loginHandler} data-value="github" class="py-2 px-4 flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 mb-1" viewBox="0 0 1792 1792">
                        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                    </svg>
                    <span class="text-center items-center">Continue with GitHub</span>
                </button>
            </div>
        </div>
    </div>
{/if}

<div class="flex flex-row justify-between items-center pt-4 px-[5%] sm:px-3">
    <div class="text-[var(--white)]">
        {#if email}
            <Button color="alternative" class="text-[var(--darkbackground)] hover:text-[var(--darkbackground)] focus:text-[var(--darkbackground)] py-2 pl-3 pr-2" style="touch-action: manipulation;">{username}<ChevronDownOutline class="w-4 h-4 text-[var(--darkbackground)]" /></Button>
            <Dropdown>
                <!-- <DropdownItem onclick={logout}>Test</DropdownItem> -->
                <DropdownItem onclick={logout}>Sign out</DropdownItem>
            </Dropdown>
        {:else}
        <button class="text-[var(--darkbackground)] bg-[var(--white)] py-2 px-4 rounded-full text-xs" onclick={() => {promptLogin = true}}>Sign in</button>
        {/if}
    </div>
    <label class="flex flex-row gap-2 cursor-pointer">
        <input type="checkbox" value="" class="sr-only peer" bind:checked={isAIModeEnabled} />
        <div class="flex items-center pt-[2px] text-sm text-[var(--white)] ">AI Mode</div>
        <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--extralightbackground)]"></div>
    </label>
</div>

<!-- AI MODE -->

{#if isAIModeEnabled && !isAIResultsEnabled}
    {#if animate}
        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto mt-8">
            <h2 class="mb-0 text-center">AI Treatment Insights</h2>
            <h4 class="text-gray-200 opacity-70 text-center"><div class="font-bold inline opacity-100 text-gray-300">Quick Tip:</div> Search for your favorite supplement</h4>
        </div>

        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto gap-4 mt-8">
            <div class="flex flex-col justify-start bg-[var(--white)] text-[var(--white)] text-center rounded">
                
                <!-- SUPPLEMENT / MEDICATION SELECTION -->
                <div class="flex flex-row gap-2 justify-start border-b h-[70px] rounded">
                    <div class="flex flex-row gap-3 text-[var(--darkbackground)] bg-gray-100 py-1 px-4 min-w-[50%] max-w-[50%] items-center rounded">
                        <div class="min-w-8 h-8">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 9.5C11 8.34835 10.5607 7.1967 9.68198 6.31802C7.92462 4.56066 5.07538 4.56066 3.31802 6.31802C2.43934 7.1967 2 8.34835 2 9.5M11 9.5C11 10.6517 10.5607 11.8033 9.68198 12.682C7.92462 14.4393 5.07538 14.4393 3.31802 12.682C2.43934 11.8033 2 10.6517 2 9.5M11 9.5H2" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.7574 7.12132C15.9289 8.29289 17.8284 8.29289 19 7.12132C19.5858 6.53553 19.8787 5.76777 19.8787 5C19.8787 4.23223 19.5858 3.46447 19 2.87868C17.8284 1.70711 15.9289 1.70711 14.7574 2.87868C14.1716 3.46447 13.8787 4.23223 13.8787 5C13.8787 5.76777 14.1716 6.53553 14.7574 7.12132Z" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M20.9052 17.381C22.3649 15.9213 22.3649 13.5546 20.9052 12.0948C19.4454 10.6351 17.0787 10.6351 15.619 12.0948L12.0948 15.619C10.6351 17.0787 10.6351 19.4454 12.0948 20.9052C13.5546 22.3649 15.9213 22.3649 17.381 20.9052L20.9052 17.381Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M14 14C14 14 14.2813 15.4596 15.911 17.0892C17.5407 18.7189 19 19 19 19" stroke="#2e473f" stroke-width="1.5"></path> </g></svg>
                        </div>
                        <div class="flex items-center text-left h-full">Supplement, Medication</div>
                    </div>
                    <button class="bg-[var(--white)] py-[0.25rem] px-[0.5rem] w-full rounded-r truncate {AISelectedItem ? 'text-[var(--darkbackground)]' : 'text-gray-400'}" onclick={() => {selectItemMode = true; toggleDropdown(true);}} onkeydown={(event) => { if (event.key === 'Escape') { selectItemMode = false; toggleDropdown(false)}}}>
                        {#if AISelectedItem}
                            <div class="flex flex-row items-center text-center">
                                {AISelectedItem}
                                <!-- <ChevronDownOutline class="text-gray-400" /> -->
                            </div>
                        {:else}
                            <div class="flex flex-row items-center text-left">
                                Select
                                <ChevronDownOutline />
                            </div>
                        {/if}
                    </button>
                </div>
                
                <!-- CONDITION SELECTION -->
                <div class="flex flex-row gap-2 justify-start border-b h-[70px] rounded">
                    <div class="flex flex-row gap-3 text-[var(--darkbackground)] bg-gray-100 py-1 px-4 min-w-[50%] max-w-[50%] items-center rounded">
                        <div class="min-w-8 h-8">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M6 15C6 13.3431 7.34315 12 9 12C10.6569 12 12 13.3431 12 15C12 16.6569 10.6569 18 9 18C7.34315 18 6 16.6569 6 15Z" stroke="#2e473f" stroke-width="1.5"></path> <path d="M4.5 11.5L4.91406 10.5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.4648 7.17122C14.4648 7.17122 15.7077 6.99983 16.5862 7.87832C17.4647 8.75682 17.2933 9.99964 17.2933 9.99964" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M9.00013 9.29278C9.00013 9.29278 7.7573 9.46417 6.87881 8.58568C6.00032 7.70718 6.1717 6.46436 6.1717 6.46436" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M19.0001 13.1362C19.0001 13.1362 17.8381 13.6092 17.5165 14.8093C17.195 16.0093 17.9648 16.9999 17.9648 16.9999" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M13.4209 17.772L14.9995 19" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M14.5 14V12" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12 5L10 5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> <path d="M12.5 9.5L11.5 8.5" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
                        </div>
                        <div class="flex items-center text-left h-full">Condition</div>
                    </div>
                    <button class="bg-[var(--white)] py-[0.25rem] px-[0.5rem] w-full rounded-r truncate {AISelectedIllness ? 'text-[var(--darkbackground)]' : 'text-gray-400'}" onclick={() => {selectIllnessMode = true; toggleIllnessesDropdown(true);}} onkeydown={(event) => { if (event.key === 'Escape') { selectIllnessMode = false; toggleDropdown(false)}}} >
                        {#if AISelectedIllness}
                            <div class="flex flex-row items-center text-center">
                                {AISelectedIllness}
                                <!-- <ChevronDownOutline class="text-gray-400" /> -->
                            </div>
                        {:else}
                            <div class="flex flex-row items-center text-left" >
                                Select
                                <ChevronDownOutline />
                            </div>
                        {/if}
                    </button>
                </div>

                <!-- OPTIONAL INFO -->
                <div class="flex flex-row gap-2 justify-start h-[120px] rounded">
                    <div class="flex flex-row gap-3 text-[var(--darkbackground)] bg-gray-100 py-1 px-4 min-w-[50%] max-w-[50%] items-center rounded">
                        <div class="min-w-8 h-8">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9426 1.25L13.5 1.25C13.9142 1.25 14.25 1.58579 14.25 2C14.25 2.41421 13.9142 2.75 13.5 2.75H12C9.62178 2.75 7.91356 2.75159 6.61358 2.92637C5.33517 3.09825 4.56445 3.42514 3.9948 3.9948C3.42514 4.56445 3.09825 5.33517 2.92637 6.61358C2.75159 7.91356 2.75 9.62178 2.75 12C2.75 14.3782 2.75159 16.0864 2.92637 17.3864C3.09825 18.6648 3.42514 19.4355 3.9948 20.0052C4.56445 20.5749 5.33517 20.9018 6.61358 21.0736C7.91356 21.2484 9.62178 21.25 12 21.25C14.3782 21.25 16.0864 21.2484 17.3864 21.0736C18.6648 20.9018 19.4355 20.5749 20.0052 20.0052C20.5749 19.4355 20.9018 18.6648 21.0736 17.3864C21.2484 16.0864 21.25 14.3782 21.25 12V10.5C21.25 10.0858 21.5858 9.75 22 9.75C22.4142 9.75 22.75 10.0858 22.75 10.5V12.0574C22.75 14.3658 22.75 16.1748 22.5603 17.5863C22.366 19.031 21.9607 20.1711 21.0659 21.0659C20.1711 21.9607 19.031 22.366 17.5863 22.5603C16.1748 22.75 14.3658 22.75 12.0574 22.75H11.9426C9.63423 22.75 7.82519 22.75 6.41371 22.5603C4.96897 22.366 3.82895 21.9607 2.93414 21.0659C2.03933 20.1711 1.63399 19.031 1.43975 17.5863C1.24998 16.1748 1.24999 14.3658 1.25 12.0574V11.9426C1.24999 9.63423 1.24998 7.82519 1.43975 6.41371C1.63399 4.96897 2.03933 3.82895 2.93414 2.93414C3.82895 2.03933 4.96897 1.63399 6.41371 1.43975C7.82519 1.24998 9.63423 1.24999 11.9426 1.25ZM16.7705 2.27592C18.1384 0.908029 20.3562 0.908029 21.7241 2.27592C23.092 3.6438 23.092 5.86158 21.7241 7.22947L15.076 13.8776C14.7047 14.2489 14.4721 14.4815 14.2126 14.684C13.9069 14.9224 13.5761 15.1268 13.2261 15.2936C12.929 15.4352 12.6169 15.5392 12.1188 15.7052L9.21426 16.6734C8.67801 16.8521 8.0868 16.7126 7.68711 16.3129C7.28742 15.9132 7.14785 15.322 7.3266 14.7857L8.29477 11.8812C8.46079 11.3831 8.56479 11.071 8.7064 10.7739C8.87319 10.4239 9.07761 10.0931 9.31605 9.78742C9.51849 9.52787 9.7511 9.29529 10.1224 8.924L16.7705 2.27592ZM20.6634 3.33658C19.8813 2.55448 18.6133 2.55448 17.8312 3.33658L17.4546 3.7132C17.4773 3.80906 17.509 3.92327 17.5532 4.05066C17.6965 4.46372 17.9677 5.00771 18.48 5.51999C18.9923 6.03227 19.5363 6.30346 19.9493 6.44677C20.0767 6.49097 20.1909 6.52273 20.2868 6.54543L20.6634 6.16881C21.4455 5.38671 21.4455 4.11867 20.6634 3.33658ZM19.1051 7.72709C18.5892 7.50519 17.9882 7.14946 17.4193 6.58065C16.8505 6.01185 16.4948 5.41082 16.2729 4.89486L11.2175 9.95026C10.801 10.3668 10.6376 10.532 10.4988 10.7099C10.3274 10.9297 10.1804 11.1676 10.0605 11.4192C9.96337 11.623 9.88868 11.8429 9.7024 12.4017L9.27051 13.6974L10.3026 14.7295L11.5983 14.2976C12.1571 14.1113 12.377 14.0366 12.5808 13.9395C12.8324 13.8196 13.0703 13.6726 13.2901 13.5012C13.468 13.3624 13.6332 13.199 14.0497 12.7825L19.1051 7.72709Z" fill="#2e473f"></path> </g></svg>
                        </div>
                        <div class="flex items-center text-left h-full">Details</div>
                    </div>
                    <textarea class="border-0 rounded bg-[var(--white)] my-2 mr-2 text-regular text-[var(--darkbackground)] placeholder-gray-400 w-full" placeholder="(optional) details you would like considered" bind:value={AIOptionalText} maxlength=200></textarea>
                </div>
            </div>

            <!-- COUNTER / INFO BUTTON / SEARCH BUTTON -->
            <div class="flex justify-between mt-4">
                <div class="text-[var(--white)] text-3xl h-full flex items-center gap-1 ml-2">
                    {#if isLoading}
                        <Spinner size={6} color="gray" />
                    {:else}
                        {AIItemCount ? AIItemCount.toLocaleString() : '---'}
                    {/if}
                    <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button" class="pb-1">
                        <svg class="w-5 h-5 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                        </svg>
                        <span class="sr-only">Show information</span>
                    </button>
                    <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="right" placement="right">The number of online posts matching your search criteria. Keep it above 0 for best results.</Popover>
                </div>
                <a href="#_" onclick={AISearch} class="rounded bg-[var(--white)] text-normal px-[1rem] py-[0.5rem] border-2 border-[var(--white)] hover:shadow-[0_0_5px_var(--white)]">
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

<!-- AI MODE RESULTS -->
{#if isAIModeEnabled && isAIResultsEnabled}
    <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto mt-8">
        <h2 class="mb-0 text-center">Results</h2>
        <h4 class="flex flex-col text-gray-200 opacity-70 text-center">
            <div class="">
                <div class="font-bold inline opacity-100 text-gray-300">Treatment: </div> 
                test
            </div>
            <div class="">
                <div class="font-bold inline opacity-100 text-gray-300">Illness: </div> 
                test
            </div>
        </h4>

        <Skeleton size="sm" class="my-8" />
        <Skeleton size="sm" class="my-8" />
        <Skeleton size="sm" class="my-8" />
        <Skeleton size="sm" class="my-8" />
    </div>
    <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto gap-4 mt-8">
        test
    </div>
{/if}


<!-- MEDICATION / SUPPLEMENT SELECTION -->
{#if selectItemMode}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50" role="button" tabindex="0" onclick={() => {selectItemMode = false; toggleDropdown(false);}} onkeydown={(event) => {
        if (event.key === 'Escape') { selectItemMode = false; toggleDropdown(false)}
    }}>
        <div class="flex flex-col min-w-[80%] max-w-[80%] sm:min-w-[40%] sm:max-w-[40%] 2xl:min-w-[20%] 2xl:max-w-[20%] mx-auto" role="button" tabindex="0" onclick={(event) => event.stopPropagation()}>

            <button class="relative transform translate-y-[52px] ml-auto mr-[5px] flex flex-row outline outline-1 bg-[var(--white)] py-[0.05rem] px-[0.5rem] rounded truncate gap-1 items-center justify-around w-[70px]" onclick={() => {AISelectedItem = searchTerm; selectItemMode = false;}}>
                <div class="pt-1 text-[var(--lightbackground)]">Add</div>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#2e473f" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#2e473f" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
            </button>
            
            <input class="mt-4 rounded w-[100%] text-[var(--darkbackground)]" type="text" bind:value={searchTerm} onfocus={() => {toggleDropdown(true)}} onblur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Type a Medication/Supplement" oninput={(event) => {filterOptions(event.target.value)}} onkeydown={(event) => {
                if (event.key === 'Enter') {
                    AISelectedItem = searchTerm;
                    selectItemMode = false;
                    toggleDropdown(false)
                    event.preventDefault();
                }
            }}>

            <div class="scroll-container max-h-[170px] overflow-y-auto text-[12pt] bg-[var(--white)] rounded mt-1" style="display: {dropdownOpen ? 'block' : 'none'}">
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
        <div class="flex flex-col min-w-[80%] max-w-[80%] sm:min-w-[40%] sm:max-w-[40%] 2xl:min-w-[20%] 2xl:max-w-[20%] mx-auto" role="button" tabindex="0" onclick={(event) => event.stopPropagation()}>
            <!-- <input class="mt-4 rounded w-[100%]" type="text" bind:value={searchTerm} onfocus={() => {toggleIllnessesDropdown(true)}} onblur={() => {setTimeout(() => toggleDropdown(false), 100)}} placeholder="Select Illness"> -->

            <div class="scroll-container max-h-[170px] overflow-y-auto text-[12pt] bg-white rounded" style="display: {illnessesDropdownOpen ? 'block' : 'none'}">
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
{#if !isAIModeEnabled}
    {#if animate}

        <div class="flex flex-col min-w-[90%] max-w-[90%] sm:min-w-[60%] sm:max-w-[60%] mx-auto mt-8">
            <h2 class="mb-0 text-center">Reddit Search</h2>
            <h4 class="text-gray-200 opacity-70 text-center">Find posts by medication & supplement</h4>
        </div>

        <div class="flex flex-col max-w-[90%] sm:max-w-[60%] mx-auto" in:fade={{duration: 300}}>
            
            <div class="flex mt-8 gap-2 flex-wrap">
                {#each slicedItems as item}
                    <button class="text-[11pt] flex flex-row whitespace-nowrap px-[14px] py-[6px] rounded" onclick={() => handleSelection(item)} style="background-color: {selectedItems.includes(item) ? (tag_counts[item]['label'] === 'SUP' ? 'var(--supplement)' : 'var(--medication)') : 'var(--white)'}; color: {selectedItems.includes(item) ? 'var(--white)' : '#000'}; font-weight: {selectedItems.includes(item) ? 'bold' : 'normal'};">
                        {item}
                    </button>				
                {/each}
            </div>

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
            
            <div class="flex flex-row justify-start">
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

            <div class="flex flex-row justify-end">
                <a href="#_" onclick={fetchDataForPostList} class="whitebutton rounded mt-6">
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


<style>
    .gsi-material-button {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-appearance: none;
        background-color: WHITE;
        background-image: none;
        border: 1px solid #747775;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #1f1f1f;
        cursor: pointer;
        font-family: 'Roboto', arial, sans-serif;
        font-size: 14px;
        height: 40px;
        letter-spacing: 0.25px;
        outline: none;
        overflow: hidden;
        padding: 0 12px;
        position: relative;
        text-align: center;
        -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
        transition: background-color .218s, border-color .218s, box-shadow .218s;
        vertical-align: middle;
        white-space: nowrap;
        width: auto;
        max-width: 400px;
        min-width: min-content;
    }

    .gsi-material-button .gsi-material-button-icon {
        height: 20px;
        margin-right: 12px;
        min-width: 20px;
        width: 20px;
    }

    .gsi-material-button .gsi-material-button-content-wrapper {
        -webkit-align-items: center;
        align-items: center;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: nowrap;
        flex-wrap: nowrap;
        height: 100%;
        justify-content: space-between;
        position: relative;
        width: 100%;
    }

    .gsi-material-button .gsi-material-button-contents {
        -webkit-flex-grow: 1;
        flex-grow: 1;
        font-family: 'Roboto', arial, sans-serif;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
    }

    .gsi-material-button .gsi-material-button-state {
        -webkit-transition: opacity .218s;
        transition: opacity .218s;
        bottom: 0;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    .gsi-material-button:disabled {
        cursor: default;
        background-color: #ffffff61;
        border-color: #1f1f1f1f;
    }

    .gsi-material-button:disabled .gsi-material-button-contents {
        opacity: 38%;
    }

    .gsi-material-button:disabled .gsi-material-button-icon {
    opacity: 38%;
    }

    .gsi-material-button:not(:disabled):active .gsi-material-button-state, 
    .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
        background-color: #303030;
        opacity: 12%;
    }

    .gsi-material-button:not(:disabled):hover {
        -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
    }

    .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
        background-color: #303030;
        opacity: 8%;
    }

    .scroll-container {
        -ms-overflow-style: none; /* for Internet Explorer, Edge */
        scrollbar-width: none; /* for Firefox */
        overflow-y: auto;
    }
    .scroll-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }
</style>