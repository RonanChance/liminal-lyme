<script>
	import TopBanner from '../lib/components/TopBanner.svelte';
  	import Footer from '../lib/components/Footer.svelte';
    import MedicalDisclaimer from "../lib/components/MedicalDisclaimer.svelte";
    import { onMount } from 'svelte';
    import { fade, fly, blur } from 'svelte/transition';
    import { total_scanned, total_cataloged, medications, supplements } from "../lib/components/constants";
    import { Popover } from 'flowbite-svelte';
    
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
    <a href="https://github.com/RonanChance/liminal-lyme" class="github-corner" aria-label="View on GitHub"><svg width="100" height="100" viewBox="0 0 250 250" style="fill:var(--extradarkbackground); color:var(--white); position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style> 
    <div class="rotating-text mt-10 text-center">
        {#key currentWord}
            <h1 in:fade|global={{duration: 750}}>YOUR <span class="highlighted-word text-center">{currentWord}</span></h1>
        {/key}
    </div>

    {#if animate}
        <div class="mt-8 text-center">
        <h2 class="inline" in:fade|global={{y: 100, delay: 50, duration: 500 }}>
            Get <span class="font-bold">insights</span> from Reddit based on <span class="font-bold">medications</span> & <span class="font-bold">supplements</span>
        </h2>
        </div>

        <div class="mt-12 text-center flex flex-wrap justify-center gap-2" in:blur={{delay: 200, duration: 600}}>
            <a href="/search" class="whitebutton" type="button">Search Reddit</a>
            <a href="/tree" class="whitebutton" type="button">Treatment Tree</a>
        </div>

        <h3 class="mt-12 max-w-[90%] mx-auto text-center" in:blur={{delay: 400, duration: 750}}>We collect open-source tick-borne disease data so you can see how people with your <a class="highlight" href="/about#what_conditions_are_supported">conditions</a> react to <a class="highlight" href="/about#what_supplements_are_supported">supplements</a> & <a class="highlight" href="/about#what_medications_are_supported">medications</a>
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
<div class="content-container">
    <div class="image-content-bar" in:fly={{y:50, delay: 750, duration: 750}}>
        <div class="info-row" in:blur={{delay: 750, duration: 1250}}>
            <div class="min-w-[50%] max-w-[50%]">
                <img src="/bacteria_images/img1.png" alt="img1">
            </div>
            <div class="text-info">
                <strong>Search</strong> 
                Query our database to find tickborne illness experiences
            </div>
        </div>
        
        <div class="info-row" in:blur={{delay: 750, duration: 1250}}>
            <div class="min-w-[50%] max-w-[50%]">
                <img src="/bacteria_images/img2.png" alt="img2">
            </div>
            <div class="text-info">
                <strong>Learn</strong> 
                Find treatment ideas based on the medications and supplements that help others
            </div>
        </div>

        <div class="info-row" in:blur={{delay: 750, duration: 1250}}>
            <div class="min-w-[50%] max-w-[50%]">
                <img src="/bacteria_images/img3.png" alt="img3">
            </div>
            <div class="text-info">
                <strong>Connect</strong>
                Find users with similar reactions and experiences
            </div>
        </div>

        <div class="info-row" in:blur={{delay: 750, duration: 1250}}>
            <div class="min-w-[50%] max-w-[50%]">
                <img src="/bacteria_images/img4.png" alt="img4">
            </div>
            <div class="text-info">
                <strong>Return</strong>
                Check back often as we add medications, supplements, and treatments
            </div>
        </div>
    
    </div>
    
    <div class="numbersdiv" in:blur={{delay: 1000, duration: 750}}>
        <div class="transparenttext">Scanned Comments</div>
        <div class="numbertext">{total_scanned}</div>

        <hr/>
        <div class="transparenttext">Cataloged Experiences</div>
        <div class="numbertext">{total_cataloged}</div>
        
        <hr/>
        <div class="transparenttext">Supported Medications</div>
        <div class="numbertext">{medications.length}</div>
        
        <hr/>
        <div class="transparenttext">Supported Supplements</div>
        <div class="numbertext">{supplements.length}</div>
    </div>

    <div class="quotediv">
        The highest form of knowledge is empathy, for it requires us to suspend our egos and live in another's world.
        <div class="quoteattribution" style="text-align: right; font-style: normal;">
            - Plato
        </div>
    </div>

    <div class="mt-12 text-center flex flex-wrap justify-center gap-2" in:blur={{delay: 200, duration: 600}}>
        <a href="/search" class="whitebutton" type="button">Search Reddit</a>
        <a href="/tree" class="whitebutton" type="button">Treatment Tree</a>
    </div>
    
    <div class="disclaimer-container">
        <MedicalDisclaimer />
    </div>

</div>
{/if}

<Footer />

<style>
    .quotediv {
        padding-top: 50px;
        padding-bottom: 50px;
        font-style: italic;
        font-size: 30pt;
        font-weight: 600;
        background-color: var(--white);
        color: var(--darkbackground);

        padding-left: 15%;
        padding-right: 15%;
    }

    .image-content-bar {
        background-color: var(--lightbackground);
        display: flex;
        flex-direction: row;
    }

    .info-row {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 2%;
        padding-right: 2%;
    }

    .text-info {
        max-width: 75%;
        padding-left: 4%;
        padding-right: 4%;

        display: flex;
        flex-direction: column;
        text-align: center;
        color: var(--white);
        font-size: 14pt;
    }

    strong {
        font-size: 20pt;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .disclaimer-container {
        display: flex;
        flex-direction: column;
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
        max-width: 90%;
    }

    .numbersdiv {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    hr {
        opacity: 0.5;
        margin-top: 20px;
        background-color: var(--white);
        width: 80%;
    }

    .transparenttext {
        margin-top: 25px;
        color:var(--accent);
        opacity: 0.5;
        font-size: 25pt;
    }

    .numbertext {
        color: var(--white);
        font-weight: bold;
        font-size: 50pt;
    }

    .info-row:last-child {
        margin-bottom: 50px;
    }

    @media (max-width: 768px) {

        .quotediv {
            font-size: 21pt;
        }

        .transparenttext {
            font-size: 20pt;
        }

        .image-content-bar {
            flex-direction: column;
        }

        .info-row {
            flex-direction: row;
        }
        
    }
</style>