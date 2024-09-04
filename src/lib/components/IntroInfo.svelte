<script>
    import { onMount } from 'svelte';
    import { fade, blur } from 'svelte/transition'
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

<div class="intro-info pt-4 px-2 pb-16">    
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