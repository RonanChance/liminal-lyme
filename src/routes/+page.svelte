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

	let toastMessage = "";
	let isLoading = false;

	let selectedMedications = []
	let selectedIllnesses = []
	
	let fetched_posts = [];
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
			const medicationsFilter = selectedMedications.map(medication => `tags?~'${medication}'`).join(' && ');
			const illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');

			// Combine the medications and illnesses filters using the AND operator
			const filterQuery = `(${medicationsFilter}) && (${illnessesFilter})`;

			// `Tags?~'Lyme' && Tags?~'Doxycycline'`
			const fetched_posts = await pb.collection('posts').getList(1, 50, {
				sort: '-score',
				filter: filterQuery,
			});

			result_list = fetched_posts.items;
			console.log(fetched_posts);
			console.log(result_list);

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


	const illnesses = ['Babesia', 'Bartonella', 'Lyme Disease', 'Rocky Mountain Spotted Fever'];
	const medications = ['Amoxicillin', 'Azithromycin', 'Ceftriaxone', 'Doxycycline'];

</script>

<div class="intro-container">
	<IntroInfo />
	<main class="container">
		<div class="centered-select" id="area-1">
			<MSelect options={illnesses} placeholderString={'Conditions'} on:choices={filterIllnesses}/>
			<MSelect options={medications} placeholderString={'Medications'} on:choices={filterMedications}/>
			<button type="button" on:click={fetchDataForPostList} class="bg-[#43bbde] text-white hover:bg-[#ffff] hover:text-[#43bbde] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
				{#if isLoading}
					<Spinner size={6} />
				{:else}
					<SearchOutline />
				{/if}
			</button>
		</div>
		<div class="post-area">
			<PostList fetchDataFunction={fetchDataForPostList} posts={result_list}/>
		</div>
		<div class="med-disclaimer">
			<MedicalDisclaimer />
		</div>
	</main>
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
		top: 10%;
		transform: translate(-50%, -50%);
  	}
</style>