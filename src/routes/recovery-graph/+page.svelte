<script>
    import { onMount, onDestroy, tick } from 'svelte';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
    import PocketBase from 'pocketbase';
    import chroma from 'chroma-js';
    import * as d3 from 'd3';

    let animate = false;
    let authorized = false;
    let email = '';
    let username = '';
    let userId = '';
    let curValue = 50;
    let scores = [];
    let updating = false;
    let initializing = true;
    let comment = "";
    let scrollContainer;

    const pb = new PocketBase('https://pb.liminallyme.com');
    const colorScale = chroma.scale(['black', '#9de09d']).domain([1, 100]);

    onMount(async () => {
        animate = true;
        if (browser) {
            window.addEventListener('keydown', handleKeydown);
            const storedEmail = getCookie('email');
            const storedUsername = getCookie('username');
            const storedUserId = getCookie('userId');
            if (storedEmail && storedEmail.length >= 5 && storedUsername && storedUserId) {
                email = storedEmail;
                username = storedUsername;
                userId = storedUserId;
                authorized = true;
            }
            await getScores();
            // await createTestingData();
            // createGraph();
            initializing = false;
            await tick();
            scrollToBottom();
        }
    });

    function scrollToBottom() {
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Enter') {
            if (!updating) {
                updating = true;
                addScore();
            }
        }
        else if (event.key.length === 1) {
            comment += event.key;
        }
        else if (event.key === 'Backspace') {
            comment = comment.slice(0, -1);
        }
    }

    async function loginHandler(event) {
        const providerChoice = event.currentTarget.dataset.value;
        event.stopPropagation();
        const w = window.open();
        try {
            const data = await pb.collection("users").authWithOAuth2({
                provider: providerChoice,
                urlCallback: (url) => { 
                    w.location.href = url;
                 }
            });
            email = data.meta.email;
            username = data.meta.username;
            userId = data.record.id;
            authorized = true;
            // store email, record in cookies
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;
            // get current scores from pb
            getScores();
        } catch (error) {
            console.error(error);
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

    async function createTestingData() {
        const dataPoints = []
        for (let i = 0; i < 101; i++){
            const dataPoint = {
                timestamp: new Date().toISOString(),
                score: i
            }
            dataPoints.push(dataPoint);
        }
        scores = [...scores, ...dataPoints]
    }

    async function addScore() {
        if (!pb.authStore.isValid) {
            console.log("User is not authenticated");
            logout();
            return;
        }
        updating = true;
        const date = new Date();
        const formattedDate = date.toISOString();
        const data = {
            "user_id": userId,
            "score": curValue,
            "comment": comment,
            "timestamp": formattedDate
        };
        await pb.collection('scores').create(data);
        getScores();
        comment = "";
        updating = false;
    }

    async function getScores() {
        console.log('getScores() called')
        if (!pb.authStore.isValid) {
            console.log("User is not authenticated");
            logout();
            return;
        }
        try {
            const storedScores = await pb.collection('scores').getFullList({
                filter: `user_id = "${userId}"`, // this is not necessary as the permissions do not allow retrieving other users records
                sort: 'timestamp'
            });

            scores = storedScores.map(score => ({
                ...score,
                timestamp: new Date(score.timestamp),
                localTimeString: new Date(score.timestamp).toLocaleString()
            }));
            
            console.log('fetched scores');
            console.log(scores);

            try {
                curValue = scores[scores.length-1].score;
            } catch (error) {
                curValue = 50;
            }

        } catch (error) {
            console.error("Error fetching user scores:", error);
        }
    }

    function createGraph() {
        const margin = { top: 40, right: 30, bottom: 40, left: 40};
        const width = window.innerWidth/1.5 - margin.left - margin.right;
        const height = window.innerHeight/4 - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const svg = d3.select("#recovery-graph")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

        x.domain(d3.extent(scores, s => s.timestamp));
        y.domain([0, d3.max(scores, s => s.score)]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x)
                .tickValues(scores.map(s => s.timestamp)) // Use the timestamps from your data points
                .tickFormat(d3.timeFormat(""))); // Format as desired

        svg.append("g").call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(d.timestamp))
            .y(d => y(d.score))

        svg.append("path")
            .datum(scores)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("d", line);
    }
</script>

{#if animate}
    {#if !authorized}
        <div class="flex flex-col items-center justify-center w-full h-screen">
            <div class="mb-4">
                <h2 class="text-center">Recovery Graph <span class="text-sm">v0.0.1</span></h2>
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
        {#if initializing}
            <div class="flex flex-col h-screen justify-center">
                <div class="mx-auto text-white text-lg">Loading..</div>
            </div>
        {:else}
            <div class="flex flex-row">
                <p class="absolute left-3 top-2">{username}</p>
                <button class="absolute right-3 top-2 text-white" on:click={logout}>
                    Logout
                </button>
            </div>

            <div class="flex flex-col h-screen gap-[3%] justify-center">
                <div class="mx-[5%] sm:mx-[15%]">
                    <div class="grid-container justify-center max-h-[250px] overflow-y-auto" bind:this={scrollContainer}>
                        {#each scores as score}
                            <div class="text-white text-sm flex items-center justify-center w-12 h-12 bg-[var(--extradarkbackground)] transition-transform transform hover:scale-110 hover:font-bold" style="background-color: {colorScale(score.score).hex()};">
                                {score.score}
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center">
                    <span class="text-white rs-label text-4xl">{curValue}</span>
                    <input class="mt-2 min-w-[70%] sm:min-w-[60%] md:min-w-[50%] lg:min-w-[40%] xl:min-w-[20%]" style="accent-color: {colorScale(curValue).hex()};" bind:value={curValue} type="range" min="0" max="100">
                    <button class="mt-6 bg-[var(--white)] px-[1rem] py-[0.5rem] rounded-md disabled:bg-gray-300" on:click={addScore} disabled={updating}>Confirm</button>
                </div>

                <div class="flex flex-col items-center justify-center text-white">
                    <textarea class="bg-[var(--darkbackground)] min-w-[70%] sm:min-w-[60%] md:min-w-[50%] lg:min-w-[40%] xl:min-w-[20%] text-center" bind:value={comment} placeholder="Start typing to comment"></textarea>
                </div>
            </div>

            <div class="flex flex-row">
                <a href="https://liminallyme.com" class="text-white underline absolute left-3 bottom-2">LiminalLyme</a>
                <p class="absolute right-3 bottom-1">v0.0.1</p>
            </div>
        {/if}
    {/if}
{/if}

<!-- <div class="text-white flex justify-center" id="recovery-graph"></div> -->

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, 3rem);
    }
    /* Hide scrollbar for WebKit browsers (Chrome, Safari) */
    .grid-container::-webkit-scrollbar {
        display: none;
    }
    /* Hide scrollbar for Firefox */
    .grid-container {
        scrollbar-width: none; /* For Firefox */
    }
    /* General overflow settings */
    .grid-container {
        overflow-y: scroll;   /* Keep scrolling functionality */
        -ms-overflow-style: none;  /* For IE and Edge */
    }
</style>