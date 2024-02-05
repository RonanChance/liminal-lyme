<script>
	import IntroInfo from '../lib/components/IntroInfo.svelte';
	import TopBanner from '../lib/components/TopBanner.svelte';
	import LandingPageContent from '../lib/components/LandingPageContent.svelte';
	import { page } from '$app/stores'
</script>

<TopBanner />
<div class="intro-container">
	<IntroInfo />
</div>
<LandingPageContent />

<style>
	.intro-container {
		padding-top: 10%;
		padding-left: 8%;
		padding-right: 8%;
	}
</style>