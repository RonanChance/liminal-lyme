<script>
	import TopBanner from '../lib/components/TopBanner.svelte';
  	import Footer from '../lib/components/Footer.svelte';
    import MedicalDisclaimer from "../lib/components/MedicalDisclaimer.svelte";
    import EmailSignup from '../lib/components/EmailSignup.svelte';
    import { onMount } from 'svelte';
    import { fade, fly, blur } from 'svelte/transition';
    import { total_scanned, total_cataloged, medications, supplements } from "../lib/components/constants";
    import { Popover } from 'flowbite-svelte';
    import { ArrowRightSolid } from 'flowbite-svelte-icons';
    
    let animate = false;
    onMount(() => animate = true);
    
    const words = ['HEALTH', 'MEDICATION', 'JOURNEY', 'INSIGHT']
    let currentIndex = 0;
    let currentWord = words[currentIndex];

    const interval = 2500; // Change text every 2.5 seconds 
    const rotateText = () => {
      currentIndex = (currentIndex + 1) % words.length;
      currentWord = words[currentIndex];
    };
    const textInterval = setInterval(rotateText, interval);
</script>

<TopBanner />

<div class="intro-info pt-4 px-2 pb-16 relative">
    <a href="https://github.com/RonanChance/liminal-lyme" class="github-corner" aria-label="View on GitHub"><svg width="100" height="100" viewBox="0 0 250 250" style="fill:var(--extradarkbackground); color:var(--white); position: absolute; top: 1; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style> 
    <div class="rotating-text mt-10 text-center">
        {#key currentWord}
            <h1>YOUR <span class="highlighted-word text-center">{currentWord}</span></h1>
        {/key}
    </div>

    {#if animate}
        <div class="mt-8 text-center">
            <h2 class="inline" in:fade={{duration: 200}}>
                Health <span class="font-bold">insights</span> from Reddit based on <span class="font-bold">medications</span> & <span class="font-bold">supplements</span>
            </h2>
        </div>

        <div class="mt-12 text-center flex flex-wrap justify-center gap-2" in:blur={{duration: 300}}>
            <a href="/search" class="whitebutton" type="button">Search Reddit</a>
            <a href="/tree" class="whitebutton" type="button">Treatment Tree</a>
        </div>

        <h3 class="mt-12 max-w-[90%] mx-auto text-center" in:blur={{duration: 400}}>We collect open-source tick-borne disease data so you can see how people with your <a class="text-[var(--accent)]" href="/about#what_conditions_are_supported">conditions</a> react to <a class="text-[var(--accent)]" href="/about#what_supplements_are_supported">supplements</a> & <a class="text-[var(--accent)]" href="/about#what_medications_are_supported">medications</a>
            <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
                <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Show information</span>
            </button>
        </h3>
        <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is focused on tick-borne disease data from Reddit, but might expand in the future</Popover>
    {/if}
</div>

{#if animate}
<div class="flex flex-col">
    
    <div class="flex flex-col md:flex-row space-evenly bg-[var(--lightbackground)] pt-3 pb-10 gap-6">
        <div class="flex flex-row md:flex-col flex-1 items-center mt-6 ml-[2%] mr-[2%]" in:blur={{duration: 450}}>
            <div class="min-w-[50%] max-w-[50%] md:min-w-[70%] md:max-w-[70%] xl:min-w-[60%] xl:max-w-[60%] 2xl:min-w-[40%] 2xl:max-w-[40%]">
                <video src="videos/search.mp4" type="video/mp4" class="rounded-xl" playsinline autoplay loop muted></video>
            </div>
            <div class="flex flex-col flex-grow items-center text-center text-[var(--white)] text-lg max-w-[75%] px-[2%] md:mt-5 gap-1">
                <strong class="text-2xl">Search</strong>
                Query our database to find tick-borne illness experiences
                <a href="/search" class="px-4 py-1 bg-[--darkbackground] rounded text-[var(--white)] mt-3">Search <ArrowRightSolid class="text-[var(--white)] inline" /></a>
            </div>
        </div>
        
        <div class="flex flex-row md:flex-col flex-1 items-center mt-6 pl-[2%] pr-[2%]" in:blur={{duration: 450}}>
            <div class="min-w-[50%] max-w-[50%] md:min-w-[70%] md:max-w-[70%] xl:min-w-[60%] xl:max-w-[60%] 2xl:min-w-[40%] 2xl:max-w-[40%]">
                <video src="videos/tree.mp4" type="video/mp4" class="rounded-xl" playsinline autoplay loop muted></video>
            </div>
            <div class="flex flex-col items-center text-center text-[var(--white)] text-lg max-w-[75%] px-[2%] md:mt-5 gap-1">
                <strong class="text-2xl">Explore</strong>
                Find treatment ideas based on scientific research articles
                <a href="/tree" class="px-4 py-1 bg-[--darkbackground] rounded text-[var(--white)] mt-3">Explore <ArrowRightSolid class="text-[var(--white)] inline" /></a>
            </div>
        </div>

        <div class="flex flex-row md:flex-col flex-1 items-center mt-6 pl-[2%] pr-[2%]" in:blur={{duration: 450}}>
            <div class="min-w-[50%] max-w-[50%] md:min-w-[70%] md:max-w-[70%] xl:min-w-[60%] xl:max-w-[60%] 2xl:min-w-[40%] 2xl:max-w-[40%]">
                <video src="videos/recovery.mp4" type="video/mp4" class="rounded-xl" playsinline autoplay loop muted></video>
            </div>
            <div class="flex flex-col items-center text-center text-[var(--white)] text-lg max-w-[75%] px-[2%] md:mt-5 gap-1">
                <strong class="text-2xl">Track</strong>
                Log your experiences and track changes in your health
                <a href="/recovery-graph" class="px-4 py-1 bg-[--darkbackground] rounded text-[var(--white)] mt-3">Track <ArrowRightSolid class="text-[var(--white)] inline" /></a>
            </div>
        </div>
    </div>
    
    <div class="flex flex-col items-center" in:blur={{duration: 450}}>
        <div class="pt-10 text-[var(--accent)] opacity-50 text-2xl">Scanned Comments</div>
        <div class="text-[var(--white)] font-bold text-6xl mt-5 mb-5">{total_scanned}</div>

        <hr class="opacity-50 mt-2 bg-[var(--white)] w-[80%]" />
        <div class="mt-5 text-[var(--accent)] opacity-50 text-2xl">Cataloged Experiences</div>
        <div class="text-[var(--white)] font-bold text-6xl mt-5 mb-5">{total_cataloged}</div>
        
        <hr class="opacity-50 mt-2 bg-[var(--white)] w-[80%]" />
        <div class="mt-5 text-[var(--accent)] opacity-50 text-2xl">Supported Medications</div>
        <div class="text-[var(--white)] font-bold text-6xl mt-5 mb-5">{medications.length}</div>
        
        <hr class="opacity-50 mt-2 bg-[var(--white)] w-[80%]" />
        <div class="mt-5 text-[var(--accent)] opacity-50 text-2xl">Supported Supplements</div>
        <div class="text-[var(--white)] font-bold text-6xl mt-5 pb-10">{supplements.length}</div>
    </div>

    <div class="italic text-2xl sm:text-3xl font-semibold bg-[var(--white)] text-[var(--darkbackground)] px-[10%] pt-10 pb-10" in:fade={{duration: 450}}>
        The highest form of knowledge is empathy, for it requires us to suspend our egos and live in another's world.
        <div class="quoteattribution text-right font-normal not-italic">
            - Plato
        </div>
    </div>

    <div in:fade={{duration: 450}}>
        <EmailSignup />
    </div>
    
    <div class="flex flex-col ml-auto mr-auto pt-10 pb-12 max-w-[90%]" in:fade={{duration: 450}}>
        <MedicalDisclaimer />
    </div>
</div>
{/if}

<Footer />