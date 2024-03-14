<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition'
    import { Toast } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
    import { goto } from '$app/navigation';

    import PocketBase from 'pocketbase';
    
    const pb = new PocketBase("https://pb.openrxn.com/");

    export let email;

    let typing_text = 'Share your story';
    let speed = 50;
    let i = 0;
    let animate = false;
    let anecdote = '';
    let placeholder_text = '- Be as descriptive as possible\n- Include symptoms, diagnosis, etc\n- Include relevant medications, supplements, and dosages when possible \n- Feel free to submit multiple times, the more data the better!'

    onMount(async () => {
        if (browser) {
          let email = getCookie('email');
          if (!email) {
            goto("/auth")
          }
        }
        typeWriter();
    });

    function typeWriter() {
        if (i < typing_text.length) {
            document.getElementById("typewriter").innerHTML += typing_text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);

            if (i > typing_text.length/1.5) {
                animate = true;
            }
        }
    }

    async function handleSubmit(event) {
        const data = {
            "email": email,
            "anecdote": anecdote
        };

        try {
            const record = await pb.collection('anecdotes').create(data);
            anecdote = '';
            submit_status = true;
            showToast();
        }
        catch (error) {
            // // console.log(error)
            // console.log("request failed");
            submit_status = false;
            showToast();
        }
    }
    
    let isToastVisible = false;
    let submit_status;
	function showToast() {
		isToastVisible = true;
		setTimeout(() => {
			isToastVisible = false;
		}, 4000);
	}
</script>

<span id="typewriter" class="typewriter"></span>

{#if animate}
<div class="content" in:fly|global={{y: 100, delay: 50, duration: 1300 }}>
    <!-- <h1> Hi, <span class="highlighted-word" style="font-weight:700">{email}</span>!</h1> -->
    <!-- <h2>Want to share your knowledge with others?</h2> -->

    {#if !submit_status}
    <div class="mb-6">
        <input type="hidden" autocomplete="off" name="email" bind:value={email} required>
    </div>
    
    <label for="anecdote" class="block mb-2 text-lg font-medium text-white">My Experience</label>
    <div class="centerbox">
        <textarea name="anecdote" class="anecdotebox" autocomplete="off" placeholder="{placeholder_text}" bind:value={anecdote}></textarea>
    </div>
    <div class="submitarea b-6">
        <button type="submit" on:click={handleSubmit} class="sign-in-button text-white bg-slate-800 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        <p style="font-size: 15px;">Submitting as: <span style="color:var(--accent); font-weight: bold;">{email}</span></p>
    </div>
    {:else if submit_status === true}
    <p style="font-size: 20px;">Thank you for contributing to the OpenRxnDatabase! Your experience has been submitted.</p>
    <button type="resubmit" on:click={() => {submit_status=null}} class="sign-in-button text-white bg-slate-800 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Back</button>

    {/if}

</div>
<div class="toast-container">
	{#if isToastVisible}
        {#if submit_status}
        <!-- <Toast color="blue">
            <svelte:fragment slot="icon">
            <ExclamationCircleSolid class="w-8 h-8" />
            <span class="sr-only">Warning icon</span>
            </svelte:fragment>
            Experience submitted!
        </Toast> -->
        {:else if submit_status === false}
        <Toast color="orange">
            <svelte:fragment slot="icon">
            <ExclamationCircleSolid class="w-8 h-8" />
            <span class="sr-only">Warning icon</span>
            </svelte:fragment>
            Failed to submit, please try again.
        </Toast>
        {/if}
	{/if}
</div>
{/if}
        
<style>

    .toast-container {
		position: fixed;
		left: 50%;
		top: 30%;
		transform: translate(-50%, -50%);
  	}

    .content {
        padding-top: 2%;
        padding-bottom: 2%;
        padding-left: 35px;
        padding-right: 35px;
        display: flex;
        flex-direction: column;
    }

    .anecdotebox {
        width: 100%;
        margin: auto;
        min-height: 50vh;
        border-radius: 10px;
    }

    .submitarea {
        display: flex;
        justify-content: space-between;
        padding-left: 2%;
        padding-right: 2%;
        padding-top: 2%;
        gap: 10px;
    }

    .centerbox {
        display: flex;
    }

    .typewriter {
        display: flex;
        justify-content: center;
        padding-top: 2rem;
        font-size: 20pt;
        font-weight: bold;
        color: white;
    }
</style>