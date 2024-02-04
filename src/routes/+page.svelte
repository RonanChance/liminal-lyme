<script>
	import IntroInfo from '../lib/components/IntroInfo.svelte';
	import TopBanner from '../lib/components/TopBanner.svelte';
	import Search from '../lib/components/Search.svelte';
	import LandingPageContent from '../lib/components/LandingPageContent.svelte';
</script>

<TopBanner />
<div class="intro-container">
	<IntroInfo />
</div>
<LandingPageContent />

<style>
	.intro-container {
		padding-left: 8%;
		padding-right: 8%;
	}
</style>