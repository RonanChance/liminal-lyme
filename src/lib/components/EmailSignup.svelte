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

<h2 class="font-semibold">Join for Special Announcements!</h2>
<div class="flex gap-2 justify-center w-[90%] md:w-[65%] lg:w-[50%] xl:w-[30%] px-8">
    <input class="w-full rounded-lg py-3 px-4 border-2 border-transparent focus:outline-none focus:ring-0 focus:border-[var(--accent)]" type="text" bind:value={email} placeholder="example@gmail.com" on:keydown={(event) => { if (event.key === 'Enter') { onSubmit() } }}>
    <button class="whitebutton py-3 px-6 text-white" on:click={onSubmit} >
        Join!
        {#if throwConfetti} <Confetti x={[-0.7, 0.7]} y={[-0.7, .7]} /> {/if}
    </button>
</div>
<!-- can put link to Lymitless here eventually? -->