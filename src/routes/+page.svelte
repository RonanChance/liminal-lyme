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

	const illnesses = ['ALL CONDITIONS (ANY)', 'LYME DISEASE', 'BARTONELLA', 'ROCKY MOUNTAIN SPOTTED FEVER', 'BABESIA']
	const medications = ['ALL MEDICATIONS (ANY)', 'ZINC', 'MINOCYCLINE', 'ESCITALOPRAM', 'VENLAFAXINE', 'ALPRAZOLAM', 'PAROXETINE', 'AZITHROMYCIN', 'DOXYCYCLINE', 'LEVOTHYROXINE', 'PENICILLIN G', 'CLONAZEPAM', 'HYDROXYZINE', 'FLUOXETINE', 'OMEPRAZOLE', 'SERTRALINE', 'PANTOPRAZOLE', 'DIPHENHYDRAMINE', 'ARIPIPRAZOLE', 'DULOXETINE', 'TRAZODONE', 'ACETAMINOPHEN', 'LORAZEPAM', 'PREGABALIN', 'FENTANYL', 'CITALOPRAM', 'TINIDAZOLE', 'TOPIRAMATE', 'CETIRIZINE', 'LYMECYCLINE', 'CEFTRIAXONE', 'CHOLESTYRAMINE', 'METRONIDAZOLE', 'AMOXICILLIN', 'TETRACYCLINE', 'VALACICLOVIR', 'ONDANSETRON', 'CEPHALEXIN', 'CYCLOBENZAPRINE', 'HYDROCORTISONE', 'FLUCONAZOLE', 'CLINDAMYCIN', 'CLARITHROMYCIN', 'NAPROXEN', 'NYSTATIN', 'MELOXICAM', 'CEFUROXIME', 'NORTRIPTYLINE', 'AMITRIPTYLINE', 'OXYCODONE', 'ESOMEPRAZOLE', 'NALTREXONE', 'CELECOXIB', 'NIACIN', 'BOTULINUM TOXIN TYPE A', 'RIFAMPIN', 'HYDROXYCHLOROQUINE', 'METHOTREXATE', 'DAPTOMYCIN']
	const tag_counts = {'LYME DISEASE': 3858, 'ALL CONDITIONS (ANY)': 4064, 'ZINC': 103, 'ALL MEDICATIONS (ANY)': 4064, 'MINOCYCLINE': 203, 'ESCITALOPRAM': 91, 'BARTONELLA': 771, 'VENLAFAXINE': 54, 'ALPRAZOLAM': 128, 'PAROXETINE': 21, 'AZITHROMYCIN': 314, 'DOXYCYCLINE': 1379, 'LEVOTHYROXINE': 80, 'PENICILLIN G': 112, 'CLONAZEPAM': 36, 'HYDROXYZINE': 34, 'FLUOXETINE': 76, 'OMEPRAZOLE': 71, 'SERTRALINE': 89, 'PANTOPRAZOLE': 36, 'DIPHENHYDRAMINE': 86, 'ARIPIPRAZOLE': 20, 'DULOXETINE': 104, 'TRAZODONE': 30, 'ACETAMINOPHEN': 144, 'LORAZEPAM': 25, 'PREGABALIN': 89, 'ROCKY MOUNTAIN SPOTTED FEVER': 120, 'FENTANYL': 25, 'CITALOPRAM': 31, 'TINIDAZOLE': 84, 'TOPIRAMATE': 22, 'CETIRIZINE': 60, 'LYMECYCLINE': 80, 'CEFTRIAXONE': 103, 'BABESIA': 408, 'CHOLESTYRAMINE': 37, 'METRONIDAZOLE': 173, 'AMOXICILLIN': 264, 'TETRACYCLINE': 51, 'VALACICLOVIR': 36, 'ONDANSETRON': 38, 'CEPHALEXIN': 42, 'CYCLOBENZAPRINE': 38, 'HYDROCORTISONE': 28, 'FLUCONAZOLE': 32, 'CLINDAMYCIN': 55, 'CLARITHROMYCIN': 118, 'NAPROXEN': 52, 'NYSTATIN': 67, 'MELOXICAM': 51, 'CEFUROXIME': 66, 'NORTRIPTYLINE': 34, 'AMITRIPTYLINE': 56, 'OXYCODONE': 33, 'ESOMEPRAZOLE': 33, 'NALTREXONE': 79, 'CELECOXIB': 24, 'NIACIN': 31, 'BOTULINUM TOXIN TYPE A': 38, 'RIFAMPIN': 20, 'HYDROXYCHLOROQUINE': 53, 'METHOTREXATE': 23, 'DAPTOMYCIN': 21}

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
			// // use this if you want to make it possible to search with just one parameter in the future
			// if (selectedMedications.length >= 1 && selectedIllnesses.length >= 1){
			// }
			// else if (selectedMedications.length >= 1) {
			// 	medicationsFilter = selectedMedications.map(medication => `tags?~'${medication}'`).join(' && ');
			// 	filterQuery = `(${medicationsFilter})`;
			// } else {
			// 	illnessesFilter = selectedIllnesses.map(illness => `tags?~'${illness}'`).join(' && ');
			// 	filterQuery = `(${illnessesFilter})`;
			// }
			
			// console.log(medicationsFilter)
			// console.log(illnessesFilter)
			// console.log(filterQuery)

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

<div class="intro-container">
	<IntroInfo />
	<main class="container">
		<div class="centered-select" id="area-1">
			<MSelect options={illnesses} placeholderString={'Conditions'} tag_counts={tag_counts} on:choices={filterIllnesses}/>
			<MSelect options={medications} placeholderString={'Medications'} tag_counts={tag_counts} on:choices={filterMedications}/>
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