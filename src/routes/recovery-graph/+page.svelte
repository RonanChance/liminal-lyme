<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
    import PocketBase from 'pocketbase';

    let animate = false;
    let authorized = false;
    let email = '';
    let username = '';
    let recordId = '';
    const pb = new PocketBase('https://pb.liminallyme.com');

    onMount(() => {
        animate = true;
        if (browser) {
            const storedEmail = getCookie('email');
            const storedUsername = getCookie('username');
            if (storedEmail && storedEmail.length >= 5 && storedUsername) {
                email = storedEmail;
                username = storedUsername;
                authorized = true;
            }
        }
    });

    async function clickHandler(event) {
        const providerChoice = event.currentTarget.dataset.value;
        event.stopPropagation();
        
        try {
            const data = await pb.collection("users").authWithOAuth2({
                provider: providerChoice,
                urlCallback: (url) => {
                    window.open(url, '_blank');
                }
            });
            
            // console.log(data.meta)
            // console.log(data.record)
            email = data.meta.email;
            username = data.meta.username;
            recordId = data.record.id;
            console.log(recordId);
            authorized = true;

            // store email, record in cookies
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `recordId=${recordId}; path=/;`;

        } catch (error) {
            console.error(error); // Handle error appropriately
        }
    }

    async function logout() {
    try {
            await pb.authStore.clear();
            email = '';
            username = '';
            authorized = false;
            document.cookie = `email=${email}; path=/;`;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    let rangeValue = 50;
    let rangeSlider;
    let rangeBullet;

    function showSliderValue() {
        const bulletPosition = rangeValue / 200;
        // rangeBullet.style.left = `${bulletPosition * 578}px`; // Update bullet position
    }
</script>

{#if animate}
    {#if !authorized}
        <div class="flex flex-col items-center justify-center w-full h-screen">

            <div class="mb-4">
                <h3 class="underline decoration-1 underline-offset-4 text-center">Recovery Graph v0.0.1</h3>
                <ul class="text-white">
                    <li>Register to track your health over time</li>
                </ul>
            </div>

            <!-- <button data-value="google" on:click={clickHandler} class="gsi-material-button">
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                    </div>
                    <span class="gsi-material-button-contents" style="font-weight: bold;">Continue with Google</span>
                </div>
            </button> -->

            <div class="flex flex-row justify-center items-center mt-2 gap-4">
                <button on:click={clickHandler} data-value="github" class="py-2 px-[23px] flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 mb-1" viewBox="0 0 1792 1792">
                        <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                    </svg>
                    <span class="text-center items-center">Continue with GitHub</span>
                </button>
            </div>
        </div>
    {:else}
        <div class="flex flex-row">
            <p class="absolute left-3 top-2">{username}</p>
            <button class="absolute right-3 top-2 text-white" on:click={logout}>
                Logout
            </button>
        </div>

        <div class="flex flex-col items-center h-screen justify-center">
            <span class="text-white rs-label text-6xl pb-4">{rangeValue}</span>
            <input class="min-w-[50%]" bind:value={rangeValue} type="range" min="0" max="100">
        </div>

        
        <div class="flex flex-row">
            <p class="absolute right-3 bottom-1">v0.0.1</p>
        </div>
    {/if}
{/if}