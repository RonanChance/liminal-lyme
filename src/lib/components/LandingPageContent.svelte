<script>
    import MedicalDisclaimer from "./MedicalDisclaimer.svelte";
    import { onMount } from 'svelte';
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
    import { fly, fade, blur } from 'svelte/transition'
    import { medications, supplements } from "./constants";


    let animate = false;
    onMount(() => animate = true);
</script>

{#if animate}
<div class="content-container" in:fly={{y:50, delay: 500, duration: 1500}}>
    
    <div class="buttondiv" style="text-align: center;">
        <a href="/home" class="whitebutton">Get started—it's free</a>
    </div>

    <h3 class="infonote">We collect open-source tickborne disease data so you can see how people with your <a class="highlight" href="/about#what_conditions_are_supported">conditions</a> react to <a class="highlight" href="/about#what_supplements_are_supported">supplements</a> & <a class="highlight" href="/about#what_medications_are_supported">medications</a>
        <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
            <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Show information</span>
        </button>
    </h3>
    <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is currently focused on tickborne disease data from Reddit, but will expand in the future</Popover>

    <div class="divbg" in:fly={{y:50, delay: 1000, duration: 1500}}>
        <div class="info-row">
            <div class="imgdiv left" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img1.png" alt="img1">
            </div>
            <div class="text-info right" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Search</strong> 
                Query our database to find tickborne illness experiences
            </div>
        </div>
        
        <div class="info-row">
            <div class="text-info left" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Learn</strong> 
                Find treatment ideas with an AI model that knows conventional & alternative treatments
            </div>
            <div class="imgdiv right" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img2.png" alt="img2">
            </div>
        </div>

        <div class="info-row">
            <div class="imgdiv left" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img3.png" alt="img3">
            </div>
            <div class="text-info right" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Contribute</strong>
                Share your health successes and obstacles with the community
            </div>
        </div>

        <div class="info-row">
            <div class="text-info left" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Stay Updated</strong>
                Check back often as we add more medications, supplements, and treatments
            </div>
            <div class="imgdiv right" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img4.png" alt="img4">
            </div>
        </div>
    
    </div>
    
    <div class="numbersdiv">
        <hr/>
        <div class="transparenttext">Scanned Comments</div>
        <div class="numbertext">19,663,903</div>
        <hr/>
        <div class="transparenttext">Cataloged Experiences</div>
        <div class="numbertext">9,027</div>
        <hr/>
        <div class="transparenttext">Supported Medications</div>
        <div class="numbertext">{medications.length}</div>
        <hr/>
        <div class="transparenttext">Supported Supplements</div>
        <div class="numbertext">{supplements.length}</div>
        <hr/>
    </div>

    <div class="buttondiv" style="text-align: center;">
        <a href="/home" class="whitebutton">Get started</a>
    </div>
    
    <div class="disclaimer-container">
        <MedicalDisclaimer />
    </div>

</div>

{/if}

<style>

    .imgdiv {
        min-width: 50%;
        max-width: 50%;
        height: auto;
        width: auto;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .text-info {
        max-width: 50%;
        padding-left: 4%;
        padding-right: 4%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
        font-size: 12pt;
    }

    .info-row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        padding-left: 2%;
        padding-right: 2%;
        padding-top: 5%;
        padding-bottom: 5%;
    }

    .disclaimer-container {
        padding-top: 5%;
        max-width: 90%;
        margin: auto;
        padding-bottom: 5%;
    }

    .numbersdiv {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 4%;
    }

    hr {
        opacity: 0.5;
        width: 80%;
        margin: auto;
    }

    .transparenttext {
        padding-top: 2%;
        color: white;
        opacity: 0.5;
    }

    .numbertext {
        color: white;
        font-weight: bold;
        font-size: 50pt;
    }

    .divbg {
        max-width: 50%;
        margin: auto;
    }

    .buttondiv {
        padding-top: 3%;
    }

    .infonote {
        margin: auto;
        max-width: 90%;
        padding-top: 5%;
        padding-bottom: 10%;
        text-align: center;
    }

    @media (max-width: 768px) {

        .disclaimer-container {
            padding-bottom: 10%;
        }
        
        .buttondiv {
            padding-top: 5%;
        }

        .divbg {
            max-width: 95%;
            margin: auto;
        }

        .infonote {
        padding-top: 10%;
    }
    }

</style>