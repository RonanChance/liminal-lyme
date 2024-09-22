<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
    import PocketBase from 'pocketbase';
    import * as d3 from 'd3';

    let animate = false;
    let authorized = false;
    let email = '';
    let username = '';
    let userId = '';
    let curValue = 50;
    let scores = [];
    const pb = new PocketBase('https://pb.liminallyme.com');

    onMount(() => {
        animate = true;
        if (browser) {
            const storedEmail = getCookie('email');
            const storedUsername = getCookie('username');
            const storedUserId = getCookie('userId');
            if (storedEmail && storedEmail.length >= 5 && storedUsername && storedUserId) {
                email = storedEmail;
                username = storedUsername;
                userId = storedUserId;
                authorized = true;
            }
        
            
        }
    });

    async function loginHandler(event) {
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
            userId = data.record.id;
            authorized = true;

            // store email, record in cookies
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;

            getScores();

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

    async function updateValue() {
        if (!pb.authStore.isValid) {
            console.log("User is not authenticated");
            logout();
            return;
        }

        const date = new Date();
        const formattedDate = date.toISOString();

        const data = {
            "user_id": userId,
            "score": curValue,
            "timestamp": formattedDate
        };
        await pb.collection('scores').create(data);
        console.log(userId)
        console.log("created");
    }

    async function getScores() {
        if (!pb.authStore.isValid) {
            console.log("User is not authenticated");
            logout();
            return;
        }
        try {
            const storedScores = await pb.collection('scores').getFullList({
                filter: `user_id = "${userId}"`, // this is not necessary as the permissions do not allow retrieving other users records
                sort: '-created'
            });

            scores = storedScores.map(score => ({
                ...score,
                timestamp: new Date(score.timestamp).toLocaleString()
            }));
            
            console.log('fetched scores');
            console.log(scores);
        } catch (error) {
            console.error("Error fetching user scores:", error);
        }
    }

</script>

{#if animate}
    {#if !authorized}
        <div class="flex flex-col items-center justify-center w-full h-screen">

            <div class="mb-4">
                <h2 class="text-center">Recovery Graph v0.0.1</h2>
                <ul class="text-center text-white">
                    <li>Register to track your health over time</li>
                </ul>
            </div>

            <!-- <button data-value="google" on:click={loginHandler} class="gsi-material-button">
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                    </div>
                    <span class="gsi-material-button-contents" style="font-weight: bold;">Continue with Google</span>
                </div>
            </button> -->

            <div class="flex flex-row justify-center items-center mt-2 gap-4">
                <button on:click={loginHandler} data-value="github" class="py-2 px-[23px] flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
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
            <span class="text-white rs-label text-6xl">{curValue}</span>
            <input class="min-w-[50%] mt-4" bind:value={curValue} type="range" min="0" max="100">
            <button class="mt-6 bg-[var(--white)] px-[1rem] py-[0.5rem] rounded-md" on:click={updateValue}>Confirm</button>
            <button class="mt-6 bg-[var(--white)] px-[1rem] py-[0.5rem] rounded-md" on:click={getScores}>Fetch</button>
        </div>

        {#each scores as score}
            <div class="text-white">{score.score}, {score.timestamp.toLocaleString()}</div>
        {/each}

        
        <div class="flex flex-row">
            <p class="absolute right-3 bottom-1">v0.0.1</p>
        </div>
    {/if}
{/if}