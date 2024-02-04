<script>
    import MedicalDisclaimer from "./MedicalDisclaimer.svelte";
    import { onMount } from 'svelte';
	import { Popover, Toast, Spinner, A } from 'flowbite-svelte';
    import { fly, fade, blur } from 'svelte/transition'


    let animate = false;
    onMount(() => animate = true);
</script>

{#if animate}
<div class="content-container" in:fly={{y:50, delay: 500, duration: 1500}}>
    
    <div class="centerdiv buttondiv" style="text-align: center;">
        <a href="/chat" class="whitebutton">Get started—it's free</a>
    </div>

    <div class="infonote" style="color: white; text-align: center; font-size: 12pt;">We collect open-source tickborne disease data so you can see how people with your <a class="highlight" href="/about#what_conditions_are_supported">conditions</a> react to <a class="highlight" href="/about#what_medications_are_supported">medications</a>
        <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
            <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Show information</span>
        </button>
    </div>
    <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is currently focused on tickborne disease data from Reddit, but will expand in the future</Popover>
</div>

<div class="divbg" in:fly={{y:50, delay: 1000, duration: 1500}}>
    <div class="imgdiv left" in:blur={{delay: 1000, duration: 1500}}>
        <img width=200px src="/bacteria_images/lyme.png">
    </div>
    <div class="imgdiv right" in:blur={{delay: 1000, duration: 1500}}>
        <img width=200px src="/bacteria_images/rmsf.png">
    </div>
    <div class="imgdiv left" in:blur={{delay: 1000, duration: 1500}}>
        <img width=225px src="/bacteria_images/babesia.png">
    </div>
    <div class="imgdiv right" in:blur={{delay: 1000, duration: 1500}}>
        <img width=200px src="/bacteria_images/ehrlichia.png">
    </div>

    <MedicalDisclaimer />
</div>

{/if}

<style>

    .divbg {
        display: flex;
        flex-direction: column;
    }
    
    .left {
        margin-left: 0;
        margin-right: auto;
    }

    .right {
        margin-left: auto;
        margin-right: 0;
    }

    .buttondiv {
        padding-top: 5%;
    }

    .infonote {
        padding-top: 10%;
        padding-bottom: 10%;
    }

</style>