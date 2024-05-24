<script>
	import IntroInfo from '../lib/components/IntroInfo.svelte';
	import TopBanner from '../lib/components/TopBanner.svelte';
	import LandingPageContent from '../lib/components/LandingPageContent.svelte';
	import { page } from '$app/stores'
  	import Footer from '../lib/components/Footer.svelte';
</script>

<TopBanner />
<IntroInfo />
<LandingPageContent />
<Footer />