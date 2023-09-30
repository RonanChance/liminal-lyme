<script>
	import PostList from '../lib/components/PostList.svelte';
	import MSelect from '../lib/components/MSelect.svelte';
	import IntroInfo from '../lib/components/IntroInfo.svelte';
	import { SearchOutline } from 'flowbite-svelte-icons'
	import PocketBase from 'pocketbase';
	import { Toast } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';

	let selectedMedications = []
	let selectedIllnesses = []
	
	let fetched_posts = [];
    let result_list = [];
	const pb = new PocketBase('http://127.0.0.1:8090');
	async function fetchDataForPostList() {
	try {
			if (selectedMedications.length === 0 || selectedIllnesses.length === 0) {
				// Either selectedMedications or selectedIllnesses is empty, show a toast
				showToast();
				return;
			}
			const medicationsFilter = selectedMedications.map(medication => `Tags?~'${medication}'`).join(' || ');
			const illnessesFilter = selectedIllnesses.map(illness => `Tags?~'${illness}'`).join(' || ');

			// Combine the medications and illnesses filters using the AND operator
			const filterQuery = `(${medicationsFilter}) && (${illnessesFilter})`;

			// `Tags?~'Lyme' && Tags?~'Doxycycline'`
			const fetched_posts = await pb.collection('posts').getList(1, 50, {
			sort: '-Score',
			filter: filterQuery,
			});

			result_list = fetched_posts.items;
			console.log(fetched_posts);
			console.log(result_list);
		} catch (error) {
			console.error('Error fetching posts:', error);
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


	const illnesses = ['Lyme', 'RMSF', 'Babesia'];
	const medications = ['Lyrica', 'Lamictal', 'Doxycycline'];

</script>

<div class="toast-container">
	{#if isToastVisible}
	<Toast color="orange">
		<svelte:fragment slot="icon">
		  <ExclamationCircleSolid class="w-5 h-5" />
		  <span class="sr-only">Warning icon</span>
		</svelte:fragment>
		Include at least one condition and one medication.
	  </Toast>
	{/if}
</div>
<div class="intro-container">
	<IntroInfo />
<main class="container">
	<div class="centered-select" id="area-1">
		<MSelect options={illnesses} placeholderString={'Conditions'} on:choices={filterIllnesses}/>
		<MSelect options={medications} placeholderString={'Medications'} on:choices={filterMedications}/>
		<button type="button" on:click={fetchDataForPostList} class="bg-[#43bbde] text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
			<SearchOutline />
		</button>
	</div>
	<PostList fetchDataFunction={fetchDataForPostList} posts={result_list}/>
</main>
</div>

<style>
	.toast-container {
    position: fixed;
    left: 50%;
	top: 5%;
    transform: translate(-50%, -50%);
    padding: 16px;
  }
</style>