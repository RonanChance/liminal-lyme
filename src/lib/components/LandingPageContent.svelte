<script>
    import MedicalDisclaimer from "./MedicalDisclaimer.svelte";
    import { onMount } from 'svelte';
    import { fly, blur } from 'svelte/transition'
    import { total_scanned, total_cataloged, medications, supplements } from "./constants";

    let animate = false;
    onMount(() => animate = true);
</script>

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

    <div class="buttondiv pt-12" style="text-align: center;">
        <a href="/search" class="whitebutton">Get started</a>
    </div>
    
    <div class="disclaimer-container">
        <MedicalDisclaimer />
    </div>

</div>

{/if}

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