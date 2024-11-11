<script>
    import TopBanner from '../../lib/components/TopBanner.svelte';
    import Footer from "../../lib/components/Footer.svelte";
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { subreddits, illnesses, wikipedia_links_illnesses, medications, supplements } from '../../lib/components/constants.js';
    import fallingMedication from '$lib/assets/fallingMedication.webp';
    import TBDMap from '$lib/assets/TBDMap.jpg';
    import coinfections from '$lib/assets/coinfections.jpg';

    let animate = $state(false);
    onMount(() => animate = true);
</script>

<TopBanner />

{#if animate}
<div class="" in:fade|global={{ duration: 200 }}>

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8" id="what_does_liminal_lyme_mean">
        <div class="text-center text-4xl mt-8 mb-4 text-[var(--white)] no-underline">Lim·​i·nal</div>
        <p class="text-center font-light text-xl">relating to, or being an intermediate state, phase, or condition</p>
        <br />
        <div class="flex justify-center flex-col">
            <img alt="Falling Medication" src={fallingMedication} />
            <a class="text-[var(--white)] underline text-right pt-1 text-sm" href='https://www.netflix.com/title/81098586' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <div class="text-[var(--white)] mt-8 font-light text-xl">
            In anthropology, <span class="italic">liminality</span> is the quality of ambiguity or disorientation that occurs in the middle stage of a rite of passage.
            <br /><br />
            The chronic symptoms from tick-borne disease have left many of us in a frustrating, uncertain, and misunderstood state.
            <br /><br />
            Researching medications, supplements, and treatment ideas is essential to our pursuit of health.
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1 bg-[var(--lightbackground)]" id="what_is_liminal_lyme">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">What is Liminal Lyme?</div>
        <div class="text-[var(--white)] font-light text-xl">This website makes the symptoms experienced during treatment accessible to you.</div>
        <div class="text-[var(--white)] font-light text-xl">
            <br/>Medical data often lacks the nuanced information that is discernable through personal narrative. Our goal is to provide you quick access to these narratives.
            <br/><br/>We hope that these narratives provide you insight for your own healthcare.
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1" id="what_is_the_inspiration_for_this_site">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">What is the inspiration for this site?</div>
        <div class="flex justify-center flex-col">
            <img alt="Tick-borne disease map" src={TBDMap} />
            <a class="text-white underline text-right pt-1 text-sm" href='https://www.cdc.gov/ticks/data-research/facts-stats/geographic-distribution-of-tickborne-disease-cases.html' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <br />
        <div class="text-[var(--white)] font-light text-xl">
            I contracted Rocky Mountain Spotted Fever and Lyme Disease during a trip to North Carolina in December 2021 which led to severe illness. 
            My recovery has taken over two years and involved various antibiotics, supplements, and therapies. 
            <br /><br />Having spent countless hours researching and reading tickborne disease content in my pursuit of health, I often found people's firsthand experiences to be the most relatable and insightful.
            <br/><br/>I wished I could compile all these stories to see how others managed their symptoms and medications.
            This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1 bg-[var(--lightbackground)]" id="where_is_the_data_from">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">Where is the data from?</div>
        <div class="text-[var(--white)] mt-8 font-light text-xl">
            The current version of the website is using Reddit content between June 2005 to December 2022 from the following subreddits: <br/><br/>
        </div>
        <div class="flex flex-wrap list-none sm:flex-nowrap text-[var(--white)] underline decoration-1 text-lg underline-offset-2">
            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each subreddits.slice(0, Math.ceil(subreddits.length/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each subreddits.slice(Math.ceil(subreddits.length/3), Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each subreddits.slice(Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer">{subreddit}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1" id="what_conditions_are_supported">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">What conditions are supported?</div>
        <div class="flex justify-center flex-col">
            <img alt="Coinfection graph" src={coinfections} />
            <a class="text-white underline text-right pt-1 text-sm" href='https://www.lymedisease.org/tick-borne-coinfections/' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <br />
        <div class="flex flex-wrap sm:flex-nowrap list-none text-[var(--white)] underline decoration-1 text-lg underline-offset-2">
            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each illnesses.slice(0, Math.ceil(illnesses.length/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each illnesses.slice(Math.ceil(illnesses.length/3), Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="w-[100%] text-left sm:text-center sm:flex-1">
                {#each illnesses.slice(Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer">{item}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1 bg-[var(--lightbackground)]" id="what_medications_are_supported">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">What medications are supported?</div>
        <div class="text-[var(--white)] mt-8 font-light text-xl">
            There are currently <span class="font-semibold not-italic">{medications.length}</span> prescription medications supported.
            You can view and contribute to the full list on the <a href={"https://github.com/RonanChance/liminal-lyme-data/blob/master/txts/medications.txt"} target="_blank" rel="noreferrer" class="text-[var(--accent)] underline decoration-1">Medications GitHub</a>.
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-8 pt-1" id="what_supplements_are_supported">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">What supplements are supported?</div>
        <div class="text-[var(--white)] mt-8 font-light text-xl">
            There are currently <span class="font-semibold not-italic">{supplements.length}</span> supplements supported.
            You can view and contribute to the full list on the <a href={"https://github.com/RonanChance/liminal-lyme-data/blob/master/txts/supplements.txt"} target="_blank" rel="noreferrer" class="text-[var(--accent)] underline decoration-1">Supplements GitHub</a>.
        </div>
    </div>

    <hr />

    <div class="2xl:px-[35%] xl:px-[30%] md:px-[20%] px-[5%] pb-2 pt-1 bg-[var(--lightbackground)]" id="how_can_i_support_this_project">
        <div class="text-[var(--white)] text-center mt-8 mb-8 text-3xl font-bold">Can I contribute to this project?</div>
        <div class="text-[var(--white)] mt-8 font-light text-xl">
            You can support this project by contributing to the <a href="https://github.com/RonanChance/liminal-lyme" target="_blank" rel="noreferrer" class="text-[var(--accent)] underline decoration-1">GitHub</a> or by sharing your <a href="/tree#contribute" class="text-[var(--accent)] underline decoration-1">medications, supplements, and treatments</a>.
            <br/><br/>Reach out to me if you have any questions, recommendations, or just want to connect.
            <br/><br/>
        </div>
        <div class="flex flex-row w-full justify-center items-center mt-2 mb-10 gap-4">
            <a href="https://www.linkedin.com/in/ronancdonovan/" target="_blank" data-value="github" class="py-2 px-[20px] flex justify-center items-center bg-[#0072b1] hover:bg-[#004182] text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
                <svg fill="#fff" height="16px" width="16px" class="mr-2" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 310 310" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_801_"> <path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"></path> <path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"></path> <path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"></path> </g> </g></svg>
                <span class="text-center pt-[6px]">LinkedIn</span>
            </a>
            <a href="https://github.com/RonanChance/liminal-lyme" target="_blank" data-value="github" class="py-2 px-[23px] flex justify-center items-center bg-zinc-900 hover:bg-gray-900 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792">
                  <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                </svg>
                <span class="text-center pt-[5px]">GitHub</span>
            </a>
        </div>
    </div>
</div>

<Footer />
{/if}