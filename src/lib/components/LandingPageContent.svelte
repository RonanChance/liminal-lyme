<script>
    import MedicalDisclaimer from "./MedicalDisclaimer.svelte";
    import { onMount } from 'svelte';
	import { Popover, Toast, Spinner } from 'flowbite-svelte';
    import { fly, fade, blur } from 'svelte/transition'
    import { total_scanned, total_cataloged, medications, supplements } from "./constants";


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

    <div class="image-content-bar" in:fly={{y:50, delay: 1000, duration: 1500}}>
        <div class="info-row">
            <div class="imgdiv" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img1.png" alt="img1">
            </div>
            <div class="text-info" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Search</strong> 
                Query our database to find tickborne illness experiences
            </div>
        </div>
        
        <div class="info-row">
            <div class="imgdiv" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img2.png" alt="img2">
            </div>
            <div class="text-info" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Learn</strong> 
                Find treatment ideas based on the medications and supplements that help others
            </div>
        </div>

        <div class="info-row">
            <div class="imgdiv" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img3.png" alt="img3">
            </div>
            <div class="text-info" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Connect</strong>
                Find users with similar reactions and experiences
            </div>
        </div>

        <div class="info-row">
            <div class="imgdiv" in:blur={{delay: 1000, duration: 1500}}>
                <img src="/bacteria_images/img4.png" alt="img4">
            </div>
            <div class="text-info" in:blur={{delay: 1000, duration: 1500}}>
                <strong>Return</strong>
                Check back often as we add medications, supplements, and treatments
            </div>
        </div>
    
    </div>
    
    <div class="numbersdiv">
        <hr/>
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

    <div class="buttondiv" style="text-align: center;">
        <a href="/home" class="whitebutton">Get started</a>
    </div>
    
    <div class="disclaimer-container">
        <MedicalDisclaimer />
    </div>

</div>

{/if}

<style>

    .buttondiv {
        margin-top: 50px;
    }

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
        margin-top: 50px;
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

    .imgdiv {
        max-width: 50%;
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
        /* margin: auto; */
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

    .infonote {
        margin-top: 50px;
        max-width: 90%;
        text-align: center;
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