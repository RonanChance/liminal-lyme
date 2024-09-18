<script>
    import { Confetti } from "svelte-confetti";
    import PocketBase from 'pocketbase';

    let email = "";
    let throwConfetti = false;

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
    <div class="font-medium px-2 text-4xl text-[var(--white)]">Liminal Lyme Roadmap</div>

    <div class="pt-10">
        <div class="text-[var(--white)] text-base">
            <ul class="ml-16 relative list-none StepProgress">
                <div class="StepProgress-item relative is-done mr-5 font-light"><span class="text-xl font-semibold">Collect Reddit & Tree Data</span><br />Source initial data and create database</div>
                <div class="StepProgress-item relative is-done mr-5 font-light"><span class="text-xl font-semibold">Launch Open-Source Website</span><br />LiminalLyme.com: Search Reddit posts & explore a treatment tree</div>
                <div class="StepProgress-item relative current mr-5 font-light"><span class="text-xl font-semibold">Crowdsource Treatment Ideas</span><br />Get insights from <span class="font-bold">YOU</span>! Make this website a community effort: <a href="tree#contribute" class="text-[var(--accent)]">contribute your ideas</a></div>
                <div class="StepProgress-item relative current mr-5 font-light"><span class="text-xl font-semibold">Launch a Survey Research Study</span><br />Correlate medications, supplements, and treatments with outcomes in the tick-borne illness community</div>
            </ul>
        </div>
    </div>

    <h2 class="font-semibold px-2 pt-10">
        <span class="pr-2">&#128236</span> 
        Stay Updated!
    </h2>

    <div class="flex gap-1 justify-center w-[90%] md:w-[65%] lg:w-[50%] xl:w-[30%] px-8 pt-4">
        <input class="w-full rounded-lg px-4 border-transparent focus:outline-none focus:ring-0 focus:border-[var(--accent)]" type="text" bind:value={email} placeholder="example@gmail.com" on:keydown={(event) => { if (event.key === 'Enter') { onSubmit() } }}>
        <button class="whitebutton px-6 text-white" on:click={onSubmit} >
            Send
            {#if throwConfetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
        </button>
    </div>

</div>
<!-- can put link to Lymitless here eventually? -->

<style>
     .StepProgress::before {
         display: inline-block;
         content: '';
         position: absolute;
         top: 0;
         left: 15px;
         width: 10px;
         height: 100%;
    }
     .StepProgress-item {
         counter-increment: my-counter;
    }
     .StepProgress-item:not(:last-child) {
         padding-bottom: 2rem;
    }
     .StepProgress-item::before {
         display: inline-block;
         content: '';
         position: absolute;
         left: -30px;
         height: 100%;
         width: 10px;
    }
     .StepProgress-item::after {
         content: '';
         display: inline-block;
         position: absolute;
         top: 0;
         left: -37px;
         width: 20px;
         height: 20px;
         border: 2px solid #CCC;
         border-radius: 50%;
         background-color: #FFF;
    }
     .StepProgress-item.is-done::before {
         border-left: 4px solid green;
    }
    .StepProgress-item.is-done::after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: -40px;
        width: 25px;
        height: 25px;
        border: 2px solid green;
        background-color: green;
        border-radius: 50%;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20.285 6.261l-11.036 11.035-5.249-5.248 1.414-1.414 3.835 3.835 9.622-9.621z"/></svg>');
        background-repeat: no-repeat;
        background-position: center;
    }
     .StepProgress-item.current::before {
         border-left: 4px solid green;
    }
     .StepProgress-item.current::after {
         content: counter(my-counter);
         padding-top: 2px;
         width: 30px;
         height: 30px;
         top: -2px;
         left: -43px;
         font-size: 14px;
         text-align: center;
         color: green;
         border: 2px solid green;
         background-color: white;
    }
</style>