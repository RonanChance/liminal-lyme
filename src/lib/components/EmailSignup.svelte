<script>
    import { Confetti } from "svelte-confetti";
    import PocketBase from 'pocketbase';
    import { PaperPlaneSolid } from 'flowbite-svelte-icons';

    let email = $state("");
    let throwConfetti = $state(false);

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    async function onSubmit() {
        if (email.trim() === "") {
            alert("Email is required.");
            return;
        }
        if (!isValidEmail(email)) {
            alert("Email address is invalid.");
            return;
        }
        const pb = new PocketBase("https://pb.liminallyme.com");
        const data = { "email": email || '' };
        throwConfetti = true;
        try {
            const record = await pb.collection('emails').create(data);
            alert('Thank you for your interest in LiminalLyme!');
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
        email = "";
        throwConfetti = false;
    }
</script>

<div class="flex flex-col items-center text-center justify-center bg-[var(--lightbackground)] pt-10 pb-14">
    <div class="font-normal px-2 text-3xl text-[var(--white)] flex gap-3 items-center">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 8L3 11.6923L7 16M17 8L21 11.6923L17 16M14 4L10 20" stroke="var(--white)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        Development Progress
    </div>

    <div class="pt-10">
        <div class="text-[var(--white)] text-base">
            <ul class="ml-[4.8rem] relative list-none StepProgress">
                <div class="StepProgress-item relative is-done mr-5 font-light"><span class="text-xl font-normal">Collect Reddit & Tree Data</span><br /><span class="italic opacity-90">Source initial data and create database</span></div>
                <div class="StepProgress-item relative is-done mr-5 font-light"><span class="text-xl font-normal">Launch Open-Source Website</span><br /><span class="italic opacity-90">Search Reddit posts & explore a research tree</span></div>
                <div class="StepProgress-item relative current mr-5 font-light"><span class="text-xl font-normal">Crowdsource Treatment Ideas</span><br /><span class="italic opacity-90">Website becomes community effort: <a href="tree#contribute" class="text-[var(--accent)]">contribute</a></span></div>
                <div class="StepProgress-item relative incomplete mr-5 font-light"><span class="text-xl font-normal">Create an AI Research Tool</span><br /><span class="italic opacity-90">AI improves the research process</span></div>
                <div class="StepProgress-item relative incomplete mr-5 font-light"><span class="text-xl font-normal">Launch a Survey Research Study</span><br /><span class="italic opacity-90">Correlate medications, supplements, and treatments with tick-borne illness outcomes</span></div>
            </ul>
        </div>
    </div>

    <hr class="mt-10 bg-[var(--white)] w-[80%] sm:w-[40%] 2xl:sm:w-[20%] mt-10" />

    <h2 class="text-3xl font-normal px-2 pt-8">
        <span class="pr-1">&#128236</span> 
        Stay Updated
    </h2>

    <div class="flex gap-1 justify-center w-[90%] md:w-[65%] lg:w-[50%] xl:w-[30%] px-4 pt-8">
        <input class="w-full rounded-lg px-3 border-transparent focus:outline-none focus:ring-0 focus:border-[var(--white)]" type="text" bind:value={email} placeholder="name@gmail.com" onkeydown={(event) => { if (event.key === 'Enter') { onSubmit() } }}>
        <button class="whitebutton rounded-lg text-white" onclick={onSubmit} >
            <svg fill="var(--darkbackground)" class="w-5 h-5" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></g></svg>
            {#if throwConfetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
        </button>
    </div>

</div>
<!-- can put link to Lymitless here eventually? -->

<style>
    /* counter */
     .StepProgress-item {
         counter-increment: my-counter;
    }

    /* spacing between nodes */
     .StepProgress-item:not(:last-child) {
         padding-bottom: 2rem;
    }

    /* vertical bar */
     .StepProgress-item::before {
         content: '';
         position: absolute;
         left: -30px;
         height: 100%;
    }

    /* node after completed & current */
     .StepProgress-item::after {
         content: counter(my-counter);
         position: absolute;
         color: white;
         top: 0;
         left: -40px;
         width: 25px;
         height: 25px;
         border: 2px solid var(--darkbackground);
         border-radius: 50%;
         background-color: var(--darkbackground);
    }

    /* highlighted vertical bar between prev/current nodes */
     .StepProgress-item.is-done::before {
         border-left: 4px solid var(--white);
    }

    /* done nodes, checkmark  */
    .StepProgress-item.is-done::after {
        content: '';
        border: 2px solid var(--white);
        background-color: var(--white);
        border-radius: 50%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="var(--darkbackground)"><path d="M20.285 6.261l-11.036 11.035-5.249-5.248 1.414-1.414 3.835 3.835 9.622-9.621z"/></svg>');
        background-repeat: no-repeat;
        background-position: center;
    }

    /* vertical bar between current/next nodes  */
     .StepProgress-item.current::before {
         border-left: 4px solid var(--darkbackground);
    }

    /* current node */
     .StepProgress-item.current::after {
         padding-top: 2px;
         width: 30px;
         height: 30px;
         top: -2px;
         left: -43px;
         font-size: 14px;
         text-align: center;
         color: var(--white);
         border: 2px solid var(--white);
         background-color: var(--darkbackground);
    }

    /* vertical bar before incomplete nodes (excluding last node) */
    .StepProgress-item.incomplete:not(:last-child)::before {
        border-left: 4px solid var(--darkbackground);
    }
</style>