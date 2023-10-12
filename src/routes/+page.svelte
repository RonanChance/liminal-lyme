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
	import TopBanner from '../lib/components/TopBanner.svelte'

	let toastMessage = "";
	let isLoading = false;

	let selectedMedications = []
	let selectedIllnesses = []

	const illnesses = ['ALL CONDITIONS (ANY)', 'ANAPLASMOSIS', 'BABESIOSIS', 'BARTONELLOSIS', 'EHRLICHIOSIS', 'LYME DISEASE', 'ROCKY MOUNTAIN SPOTTED FEVER', 'TULAREMIA']
	const medications = ['ALL MEDICATIONS (ANY)', 'ACETAMINOPHEN', 'ACETAZOLAMIDE', 'ACYCLOVIR', 'ALPRAZOLAM', 'AMITRIPTYLINE', 'AMOXICILLIN', 'ARIPIPRAZOLE', 'AZITHROMYCIN', 'AZLOCILLIN', 'BOTULINUM TOXIN TYPE A', 'CEFTRIAXONE', 'CEFUROXIME', 'CELECOXIB', 'CEPHALEXIN', 'CETIRIZINE', 'CHOLESTYRAMINE', 'CIPROFLOXACIN', 'CITALOPRAM', 'CLARITHROMYCIN', 'CLINDAMYCIN', 'CLONAZEPAM', 'COLCHICINE', 'CROMOGLICIC ACID', 'CYCLOBENZAPRINE', 'DAPTOMYCIN', 'DEXAMETHASONE', 'DIAZEPAM', 'DICYCLOMINE', 'DIPHENHYDRAMINE', 'DISULFIRAM', 'DOXYCYCLINE', 'DULOXETINE', 'ESCITALOPRAM', 'ESOMEPRAZOLE', 'FENTANYL', 'FLUCONAZOLE', 'FLUOXETINE', 'FLUVOXAMINE', 'HYDROCODONE', 'HYDROCORTISONE', 'HYDROXYCHLOROQUINE', 'HYDROXYZINE', 'L-TRYPTOPHAN', 'LEVOFLOXACIN', 'LEVOTHYROXINE', 'LIOTHYRONINE', 'LORAZEPAM', 'MECLIZINE', 'MELOXICAM', 'METHOTREXATE', 'METHYLPHENIDATE', 'METHYLPREDNISOLONE', 'METRONIDAZOLE', 'MINOCYCLINE', 'MIRTAZAPINE', 'NALTREXONE', 'NAPROXEN', 'NIACIN', 'NORTRIPTYLINE', 'NYSTATIN', 'OMEPRAZOLE', 'ONDANSETRON', 'OXYCODONE', 'PANTOPRAZOLE', 'PAROXETINE', 'PENICILLIN G', 'PREGABALIN', 'PROMETHAZINE', 'RANITIDINE', 'RIFAMPIN', 'RIFAXIMIN', 'SERTRALINE', 'TETRACYCLINE', 'TINIDAZOLE', 'TOPIRAMATE', 'TRAZODONE', 'VALACICLOVIR', 'VANCOMYCIN', 'VENLAFAXINE', 'ZINC']
	const tag_counts = {'ALL CONDITIONS (ANY)': 4107, 'ALL MEDICATIONS (ANY)': 4107, 'LYME DISEASE': 4088, 'DOXYCYCLINE': 1382, 'BARTONELLOSIS': 544, 'BABESIOSIS': 495, 'DISULFIRAM': 374, 'AZITHROMYCIN': 305, 'AMOXICILLIN': 256, 'MINOCYCLINE': 195, 'METRONIDAZOLE': 169, 'ACETAMINOPHEN': 129, 'ROCKY MOUNTAIN SPOTTED FEVER': 125, 'CLARITHROMYCIN': 115, 'PENICILLIN G': 110, 'CEFTRIAXONE': 103, 'ALPRAZOLAM': 102, 'ZINC': 98, 'DULOXETINE': 96, 'PREGABALIN': 84, 'TINIDAZOLE': 84, 'ESCITALOPRAM': 81, 'SERTRALINE': 81, 'DIPHENHYDRAMINE': 79, 'NALTREXONE': 79, 'FLUOXETINE': 75, 'LEVOTHYROXINE': 73, 'NYSTATIN': 67, 'CEFUROXIME': 65, 'OMEPRAZOLE': 60, 'CETIRIZINE': 57, 'HYDROXYCHLOROQUINE': 52, 'AMITRIPTYLINE': 50, 'VENLAFAXINE': 49, 'CLINDAMYCIN': 49, 'ANAPLASMOSIS': 48, 'MELOXICAM': 48, 'EHRLICHIOSIS': 47, 'TETRACYCLINE': 47, 'NAPROXEN': 45, 'CEPHALEXIN': 38, 'BOTULINUM TOXIN TYPE A': 37, 'PANTOPRAZOLE': 36, 'CHOLESTYRAMINE': 36, 'CLONAZEPAM': 35, 'ONDANSETRON': 35, 'CYCLOBENZAPRINE': 33, 'VALACICLOVIR': 33, 'NORTRIPTYLINE': 32, 'FLUCONAZOLE': 31, 'ESOMEPRAZOLE': 31, 'NIACIN': 31, 'HYDROXYZINE': 29, 'TRAZODONE': 28, 'CITALOPRAM': 27, 'HYDROCORTISONE': 26, 'OXYCODONE': 26, 'LORAZEPAM': 24, 'CELECOXIB': 24, 'METHOTREXATE': 23, 'TOPIRAMATE': 22, 'FENTANYL': 21, 'DAPTOMYCIN': 21, 'PAROXETINE': 19, 'RIFAMPIN': 18, 'ARIPIPRAZOLE': 18, 'RIFAXIMIN': 18, 'AZLOCILLIN': 18, 'CROMOGLICIC ACID': 16, 'LIOTHYRONINE': 15, 'METHYLPHENIDATE': 15, 'RANITIDINE': 13, 'TULAREMIA': 13, 'DEXAMETHASONE': 13, 'L-TRYPTOPHAN': 13, 'PROMETHAZINE': 12, 'METHYLPREDNISOLONE': 12, 'VANCOMYCIN': 12, 'DIAZEPAM': 11, 'LEVOFLOXACIN': 11, 'DICYCLOMINE': 11, 'FLUVOXAMINE': 11, 'MIRTAZAPINE': 11, 'COLCHICINE': 10, 'CIPROFLOXACIN': 9, 'ACETAZOLAMIDE': 9, 'MECLIZINE': 9, 'HYDROCODONE': 9, 'ACYCLOVIR': 9}

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
			console.log(filterQuery)

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

<TopBanner />
<div class="intro-container">
	<IntroInfo />
	<main class="container">
		<div class="centered-select" id="area-1">
			<MSelect options={illnesses} placeholderString={'Conditions'} tag_counts={tag_counts} on:choices={filterIllnesses}/>
			<MSelect options={medications} placeholderString={'Medications'} tag_counts={tag_counts} on:choices={filterMedications}/>
			<button type="button" on:click={fetchDataForPostList} class="bg-[#43bbde] text-white hover:bg-[#ffff] hover:text-[#43bbde] font-medium rounded-lg text-sm p-2.5 items-center mr-2">
				{#if isLoading}
					<Spinner size={6} />
				{:else}
					<SearchOutline size="lg"/>
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
		top: 110pt;
		transform: translate(-50%, -50%);
  	}
</style>