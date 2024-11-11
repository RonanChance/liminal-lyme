<script>
    import { onMount, tick } from 'svelte';
    import { browser } from '$app/environment';
    import { getCookie } from '../../lib/components/constants';
    import TopBanner from '../../lib/components/TopBanner.svelte';
    import { Popover, Button } from 'flowbite-svelte';
    import { themeColorLeft, themeColorRight } from "../stores";
    import { CogSolid, TrashBinSolid, ArrowUpRightFromSquareOutline, ArrowRightToBracketOutline, ArrowUpOutline } from 'flowbite-svelte-icons';
    import PocketBase from 'pocketbase';
    import chroma from 'chroma-js';
    import * as d3 from 'd3';

    let authorized = $state(false);
    let email = '';
    let username = '';
    let userId = '';
    let curValue = $state(50);
    let scores = $state([]);
    let updating = $state(false);
    let initializing = $state(true);
    let comment = $state("");
    let scrollContainer = $state();
    let showData = $state({});
    let triggerElement = $state(null);

    const pb = new PocketBase('https://pb.liminallyme.com');
    let colorScale = $derived(chroma.scale([$themeColorLeft, $themeColorRight]).domain([1, 100]));

    onMount(async () => {
        if (browser) {
            window.addEventListener('keydown', handleKeydown);
            const storedEmail = getCookie('email');
            const storedUsername = getCookie('username');
            const storedUserId = getCookie('userId');
            if (storedEmail && storedEmail.length >= 5 && storedUserId) {
                email = storedEmail;
                username = storedUsername;
                userId = storedUserId;
                authorized = true;
                await loadAllData();
            }
        }
    });

    async function loadAllData() {
        await getScores();
        // await createTestingData();
        initializing = false;
        await tick();
        await createGraph();
        scrollToBottom();
    }

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
            username = data.meta?.username || data.meta?.name;
            userId = data.record.id;
            authorized = true;

            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;

            await loadAllData();
        } catch (error) {
            console.error(error);
        }
    }

    async function logout() {
    try {
            await pb.authStore.clear();
            email = '';
            username = '';
            userId = '';
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `email=${email}; path=/;`;
            document.cookie = `userId=${userId}; path=/;`;
            authorized = false;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async function createTestingData() {
        const dataPoints = []
        for (let i = 0; i < 201; i++){
            const dataPoint = {
                id: 1,
                timestamp: new Date().toISOString(),
                comment: "this is an example comment",
                localTimeString: new Date().toLocaleString(),
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
        await loadAllData();
        comment = "";
        updating = false;
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
                sort: 'timestamp'
            });

            scores = storedScores.map(score => ({
                ...score,
                timestamp: new Date(score.timestamp),
                localTimeString: new Date(score.timestamp).toLocaleString()
            }));
            
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

    async function createGraph() {
        const margin = { top: 10, right: 15, bottom: 40, left: 30};
        let container = document.getElementById('recovery-graph-container');
        let svg = d3.select("#recovery-graph svg");

        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        if (!svg.empty()) {
            svg.remove();
        }

        svg = d3.select("#recovery-graph")
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
                .tickValues(scores.map(s => s.timestamp))
                .tickFormat(d3.timeFormat("")));

        svg.append("g").call(d3.axisLeft(y));

        const line = d3.line()
            .x(d => x(d.timestamp))
            .y(d => y(d.score))
            .curve(d3.curveMonotoneX)

        const path = svg.append("path")
            .datum(scores)
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("d", line);

        const totalLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1300)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        svg.selectAll("circle")
            .data(scores)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.timestamp))
            .attr("cy", d => y(d.score))
            .attr("r", 3)
            .attr("fill", "white")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);
    }

    function selectDataPoint(scoreDict, element) {
        triggerElement = element;
        showData = scoreDict;
    }

    async function deleteData(scoreDict) {
        console.log("deleting: ", scoreDict.id);
        try {
            await pb.collection('scores').delete(scoreDict.id);
            scores = scores.filter(dict => dict.id !== scoreDict.id);
            await loadAllData();
            triggerElement = null;
            showData = {};
        } catch (e) {
            console.log(e);
        }
    }

    async function exportData() {
        const newWindow = window.open('', '_blank');
        const htmlContent = `
            <html>
                <head>
                    <title>Export Data</title>
                </head>
                <body>
                    <pre>${scores.map(score => JSON.stringify(score, null, 2)).join(',\n')}</pre>
                </body>
            </html>
        `;
        newWindow.document.write(htmlContent);
        newWindow.document.close();
    }

    function changeColorScheme(leftColor, rightColor) {
        themeColorLeft.set(leftColor);
        themeColorRight.set(rightColor);
    }

</script>

{#if !authorized}
    <TopBanner />
    <div class="text-center text-xl sm:text-2xl text-[var(--darkbackground)] pb-4 bg-[var(--white)] rounded-b-lg text-bold flex flex-col">
        <span class="">Recovery Graph <span class="font-thin text-sm">v0.0.1</span></span>
        <span class="text-center text-sm">Track your health over time</span>
    </div>
    <div class="flex flex-col items-center justify-center w-full mt-[15%]">
        <p class="mb-4 text-center text-white max-w-[70%]">
            This is a work in progress, make an account to try it out!
        </p>

        <div class="flex flex-col justify-center items-center mt-2 gap-4">
            <button data-value="google" onclick={loginHandler} class="gsi-material-button">
                <div class="gsi-material-button-state"></div>
                <div class="gsi-material-button-content-wrapper">
                    <div class="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    </div>
                    <span class="gsi-material-button-contents" style="font-weight: bold;">Continue with Google</span>
                    <span style="display: none;">Continue with Google</span>
                </div>
            </button>

            <button onclick={loginHandler} data-value="github" class="py-2 px-4 flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2 mb-1" viewBox="0 0 1792 1792">
                    <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                </svg>
                <span class="text-center items-center">Continue with GitHub</span>
            </button>
        </div>
    </div>
{:else}
    <meta charset="utf-8" name="theme-color" content="{colorScale(curValue).hex()}"/>
    {#if initializing}
        <div class="flex flex-col justify-center">
            <div class="mx-auto text-white text-lg">Loading..</div>
        </div>
    {:else}
        <div class="flex flex-row">
            <a href="/" class="text-white underline absolute left-4 bottom-4">Home</a>
            <button class="absolute right-5 bottom-5 text-white"><CogSolid size="lg" /></button>
            <Popover arrow={false} class="text-sm font-light bg-[var(--white)] z-50" trigger="click">
                <div class="flex flex-col">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <div>Color Scheme</div>
                            <button class="px-2 py-1 bg-gradient-to-r from-[#0a0a0a] to-[#467465] rounded text-white" onclick={() => {changeColorScheme("#0a0a0a", "#467465")}}>{$themeColorRight === "#467465" ? "Selected" : "Select"}</button>
                            <button class="px-2 py-1 bg-gradient-to-r from-[#0a0a0a] to-[#0369a1] rounded text-white" onclick={() => {changeColorScheme("#0a0a0a", "#0369a1")}}>{$themeColorRight === "#0369a1" ? "Selected" : "Select"}</button>
                            <button class="px-2 py-1 bg-gradient-to-r from-[#0a0a0a] to-[#fda4af] rounded text-white" onclick={() => {changeColorScheme("#0a0a0a", "#fda4af")}}>{$themeColorRight === "#fda4af" ? "Selected" : "Select"}</button>
                            <button class="px-2 py-1 bg-gradient-to-r from-[#0a0a0a] to-[#7c2d12] rounded text-white" onclick={() => {changeColorScheme("#0a0a0a", "#7c2d12")}}>{$themeColorRight === "#7c2d12" ? "Selected" : "Select"}</button>
                            <button class="px-2 py-1 bg-gradient-to-r from-[#0a0a0a] to-[#6b7280] rounded text-white" onclick={() => {changeColorScheme("#0a0a0a", "#6b7280")}}>{$themeColorRight === "#6b7280" ? "Selected" : "Select"}</button>
                        </div>
                        <div class="flex flex-row justify-end items-center gap-2">
                            <div>Export Data</div>
                            <button class="px-4 py-2 bg-[var(--lightbackground)] rounded text-white" onclick={exportData}><ArrowUpRightFromSquareOutline size="xs" /></button>
                        </div>
                        <div class="flex flex-row justify-end items-center gap-2">
                            <div>Logout</div>
                            <button class="px-4 py-2 bg-red-700 rounded text-white" onclick={logout}><ArrowRightToBracketOutline size="xs" /></button>
                        </div>
                    </div>
                </div>
            </Popover>
        </div>

        <div class="flex flex-col w-full h-dvh justify-center" style="background-color: {colorScale(curValue).hex()}">
            {#if scores.length > 0}
                <div class="mx-[5%] sm:mx-[15%] lg:mx-[30%] xl:mx-[35%]">
                    <div class="text-white flex justify-center h-[25vh] w-full" id="recovery-graph-container">
                        <div class="text-white flex justify-center h-full w-full" id="recovery-graph"></div>
                    </div>
                    <div class="grid-container justify-center max-h-[207px] w-full overflow-y-auto py-1" bind:this={scrollContainer}>
                        {#each scores as scoreDict}
                            <button onclick={(e) => selectDataPoint(scoreDict, e.currentTarget)} 
                                class="text-white outline outline-1 outline-black text-sm flex items-center justify-center w-12 h-12 bg-[var(--extradarkbackground)] rounded-lg" 
                                style="background-color: {colorScale(scoreDict.score).hex()}; text-decoration: {scoreDict.comment ? "underline" : ""}">
                                {scoreDict.score}
                            </button>
                        {/each}
                    </div>
                    <Popover arrow={false} class="w-64 text-sm font-light bg-[var(--white)] z-50" title="Score: {showData.score}" triggeredBy={triggerElement} trigger="click">
                        <div class="flex flex-col">
                            {showData.localTimeString}
                            <br />
                            {#if showData.comment}
                                {showData.comment}
                            {/if}
                            <div class="flex justify-end">
                                <Button outline color="red" size="xs" on:click={() => { deleteData(showData) }} ><TrashBinSolid size="xs" /></Button>
                            </div>
                        </div>
                    </Popover>
                </div>
            {:else}
                <div class="text-center opacity-25">
                    <p>Your first data point will be go here</p>
                </div>
            {/if}
            
            <div class="mx-[10%] sm:mx-[15%] md:mx-[25%] lg:mx-[30%] xl:mx-[35%] mt-[5%]">
                <div class="text-white rs-label text-6xl text-center">{curValue}</div>
                <div class="px-[5px] flex flex-row gap-2 items-center">
                    <input class="w-full range-slider" style="accent-color: #fff" bind:value={curValue} type="range" min="0" max="100">
                    <button class="bg-[var(--white)] text-[var(--darkbackground)] w-12 py-2 rounded-2xl disabled:bg-gray-300 flex items-center justify-center outline-none" onclick={addScore} disabled={updating}>
                        <ArrowUpOutline class="outline-none" />
                    </button>
                </div>
                <textarea class="mt-4 w-full bg-[var(--white)] rounded-2xl outline-0 border-0 text-center text-[var(--darkbackground)] focus:outline-none focus:outline-1 focus:ring-white" bind:value={comment} maxlength="250" placeholder="Start typing to comment"></textarea>
            </div>
        </div>
    {/if}
{/if}

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, 3rem);
        gap: 0.2rem;
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
    .range-slider {
        --SliderColor: #fff;
    }
    .range-slider::-webkit-slider-thumb {
        background-color: #fff;
    }
    .range-slider::-moz-range-thumb {
        background-color: #fff;
    }
    .gsi-material-button {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        -webkit-appearance: none;
        background-color: WHITE;
        background-image: none;
        border: 1px solid #747775;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #1f1f1f;
        cursor: pointer;
        font-family: 'Roboto', arial, sans-serif;
        font-size: 14px;
        height: 40px;
        letter-spacing: 0.25px;
        outline: none;
        overflow: hidden;
        padding: 0 12px;
        position: relative;
        text-align: center;
        -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
        transition: background-color .218s, border-color .218s, box-shadow .218s;
        vertical-align: middle;
        white-space: nowrap;
        width: auto;
        max-width: 400px;
        min-width: min-content;
    }

    .gsi-material-button .gsi-material-button-icon {
        height: 20px;
        margin-right: 12px;
        min-width: 20px;
        width: 20px;
    }

    .gsi-material-button .gsi-material-button-content-wrapper {
        -webkit-align-items: center;
        align-items: center;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: nowrap;
        flex-wrap: nowrap;
        height: 100%;
        justify-content: space-between;
        position: relative;
        width: 100%;
    }

    .gsi-material-button .gsi-material-button-contents {
        -webkit-flex-grow: 1;
        flex-grow: 1;
        font-family: 'Roboto', arial, sans-serif;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
    }

    .gsi-material-button .gsi-material-button-state {
        -webkit-transition: opacity .218s;
        transition: opacity .218s;
        bottom: 0;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
    }

    .gsi-material-button:disabled {
        cursor: default;
        background-color: #ffffff61;
        border-color: #1f1f1f1f;
    }

    .gsi-material-button:disabled .gsi-material-button-contents {
        opacity: 38%;
    }

    .gsi-material-button:disabled .gsi-material-button-icon {
    opacity: 38%;
    }

    .gsi-material-button:not(:disabled):active .gsi-material-button-state, 
    .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
        background-color: #303030;
        opacity: 12%;
    }

    .gsi-material-button:not(:disabled):hover {
        -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
    }

    .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
        background-color: #303030;
        opacity: 8%;
    }
</style>