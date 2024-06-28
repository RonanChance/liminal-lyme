<script>
    import Footer from "../../lib/components/Footer.svelte";
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { fly } from 'svelte/transition'
    import { subreddits, illnesses, wikipedia_links_illnesses, wikipedia_links_medications, medications, supplements } from '../../lib/components/constants.js'
    import fallingMedication from '$lib/assets/fallingMedication.webp';
    import TBDMap from '$lib/assets/TBDMap.jpg';
    import coinfections from '$lib/assets/coinfections.jpg';

    let animate = false;
    onMount(() => animate = true);

</script>

<TopBanner />

{#if animate}
<div class="2xl:mx-[35%] xl:mx-[30%] md:mx-[20%] mx-[5%]" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>

    <div class="pb-8" id="what_does_liminal_lyme_mean">
        <h2 style="text-decoration: none; margin-bottom: 0px;">Lim·​i·nal</h2>
        <p class="text-center" style="font-weight: 200;">relating to, or being an intermediate state, phase, or condition</p>
        <br />
        <div class="flex justify-center flex-col">
            <img alt="Falling Medication" src={fallingMedication} />
            <a class="text-white underline text-right pt-1" style="font-size: 0.75rem;" href='https://www.netflix.com/title/81098586' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <p style="margin-top: 40px;">
            In anthropology, <span class="italic">liminality</span> is the quality of ambiguity or disorientation that occurs in the middle stage of a rite of passage.
            <br /><br />
            The chronic symptoms from tick-borne disease have left many of us in a frustrating, uncertain, and misunderstood state.
            <br /><br />
            Researching medications, supplements, and treatment ideas is essential to our pursuit of health.
        </p>
    </div>


    <div class="pb-8" id="what_is_liminal_lyme">
        <h2>What is <span class="highlighted-word" style="font-weight:900; font-style:normal">Liminal</span> Lyme?</h2>
        <p>This website makes the symptoms experienced during treatment accessible to you.</p>
        <p>
            <br/>Medical data often lacks the nuanced information that is discernable through personal narrative. Our goal is to provide you quick access to these narratives.
            <br/><br/>We hope that these narratives provide you insight for your own healthcare.
        </p>
    </div>

    <div class="pb-8" id="what_is_the_inspiration_for_this_site">
        <h2>What is the <span class="highlighted-word" style="font-weight:900; font-style:normal">Inspiration</span> for this site?</h2>
        <div class="flex justify-center flex-col">
            <img alt="Tick-borne disease map" src={TBDMap} />
            <a class="text-white underline text-right pt-1" style="font-size: 0.75rem;" href='https://www.cdc.gov/ticks/data-research/facts-stats/geographic-distribution-of-tickborne-disease-cases.html' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <br />
        <p>
            I contracted Rocky Mountain Spotted Fever and Lyme Disease during a trip to North Carolina in December 2021 which led to severe illness. 
            My recovery has taken over two years and involved various antibiotics, supplements, and therapies. 
            <br /><br />Having spent countless hours researching and reading tickborne disease content in my pursuit of health, I often found people's firsthand experiences to be the most relatable and insightful.
            <br/><br/>I wished I could compile all these stories to see how others managed their symptoms and medications.
            This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
        </p>
    </div>

    <div class="pb-8" id="where_is_the_data_from">
        <h2>Where is the <span class="highlighted-word" style="font-weight:900; font-style:normal">Data</span> from?</h2>
        <p>
            The current version of the website is using Reddit content between June 2005 to December 2022 from the following subreddits: <br/><br/>
        </p>
        <div class="columnscontainer">
            <div class="column">
                {#each subreddits.slice(0, Math.ceil(subreddits.length/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="link-word">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each subreddits.slice(Math.ceil(subreddits.length/3), Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="link-word">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each subreddits.slice(Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="link-word">{subreddit}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="pb-8" id="what_conditions_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:900; font-style:normal">Conditions</span> are supported?</h2>
        <div class="flex justify-center flex-col">
            <img alt="Coinfection graph" src={coinfections} />
            <a class="text-white underline text-right pt-1" style="font-size: 0.75rem;" href='https://www.lymedisease.org/tick-borne-coinfections/' target="_blank" rel="noreferrer">Credit</a>
        </div>
        <br />
        <div class="columnscontainer">
            <div class="column">
                {#each illnesses.slice(0, Math.ceil(illnesses.length/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer" class="link-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each illnesses.slice(Math.ceil(illnesses.length/3), Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer" class="link-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each illnesses.slice(Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item.toUpperCase()]} target="_blank" rel="noreferrer" class="link-word">{item}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="pb-8" id="what_medications_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:900; font-style:normal">Medications</span> are supported?</h2>
        <p>
            There are currently <span style="font-weight:900; font-style:normal">{medications.length}</span> prescription medications supported.
            You can view and contribute to the full list on the <a href={"https://github.com/RonanChance/liminal-lyme-data/blob/master/txts/medications.txt"} target="_blank" rel="noreferrer" class="link-word">Medications GitHub</a>.
        </p>
    </div>

    <div class="pb-8" id="what_supplements_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:900">Supplements</span> are supported?</h2>
        <p>
            There are currently <span style="font-weight:900; font-style:normal">{supplements.length}</span> supplements supported.
            You can view and contribute to the full list on the <a href={"https://github.com/RonanChance/liminal-lyme-data/blob/master/txts/supplements.txt"} target="_blank" rel="noreferrer" class="link-word">Supplements GitHub</a>.
        </p>
    </div>

    <div class="pb-2" id="how_can_i_support_this_project">
        <h2>Can I <span class="highlighted-word" style="font-weight:900">Contribute</span> to this project?</h2>
        <p>
            You can support this project by contributing to the <a href="https://github.com/RonanChance/liminal-lyme" target="_blank" rel="noreferrer" class="link-word">GitHub</a>.
            <br/><br/>And reach out to me if you have any questions, recommendations, or just want to connect.
            <br/><br/>
        </p>
        <div class="flex flex-col w-full justify-center items-center mt-12 mb-14 gap-4">
            <a href="https://github.com/RonanChance/liminal-lyme" target="_blank" data-value="github" style="border-radius:4px; flex justify-center items-center" class="py-2 px-[53px] flex justify-center items-center bg-black hover:bg-gray-900 text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mr-2" viewBox="0 0 1792 1792">
                  <path d="M896 128q209 0 385.5 103t279.5 279.5 103 385.5q0 251-146.5 451.5t-378.5 277.5q-27 5-40-7t-13-30q0-3 .5-76.5t.5-134.5q0-97-52-142 57-6 102.5-18t94-39 81-66.5 53-105 20.5-150.5q0-119-79-206 37-91-8-204-28-9-81 11t-92 44l-38 24q-93-26-192-26t-192 26q-16-11-42.5-27t-83.5-38.5-85-13.5q-45 113-8 204-79 87-79 206 0 85 20.5 150t52.5 105 80.5 67 94 39 102.5 18q-39 36-49 103-21 10-45 15t-57 5-65.5-21.5-55.5-62.5q-19-32-48.5-52t-49.5-24l-20-3q-21 0-29 4.5t-5 11.5 9 14 13 12l7 5q22 10 43.5 38t31.5 51l10 23q13 38 44 61.5t67 30 69.5 7 55.5-3.5l23-4q0 38 .5 88.5t.5 54.5q0 18-13 30t-40 7q-232-77-378.5-277.5t-146.5-451.5q0-209 103-385.5t279.5-279.5 385.5-103zm-477 1103q3-7-7-12-10-3-13 2-3 7 7 12 9 6 13-2zm31 34q7-5-2-16-10-9-16-3-7 5 2 16 10 10 16 3zm30 45q9-7 0-19-8-13-17-6-9 5 0 18t17 7zm42 42q8-8-4-19-12-12-20-3-9 8 4 19 12 12 20 3zm57 25q3-11-13-16-15-4-19 7t13 15q15 6 19-6zm63 5q0-13-17-11-16 0-16 11 0 13 17 11 16 0 16-11zm58-10q-2-11-18-9-16 3-14 15t18 8 14-14z"></path>
                </svg>
                <span class="text-center pt-[5px]">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/ronancdonovan/" target="_blank" data-value="github" style="border-radius:4px;" class="py-2 px-[50px] flex justify-center items-center bg-[#0072b1] hover:bg-[#004182] text-white transition ease-in duration-100 text-center text-base font-semibold shadow-md focus:outline-none">
                <svg fill="#fff" height="16px" width="16px" class="mr-2" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 310 310" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="XMLID_801_"> <path id="XMLID_802_" d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73 C77.16,101.969,74.922,99.73,72.16,99.73z"></path> <path id="XMLID_803_" d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4 c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"></path> <path id="XMLID_804_" d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599 c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319 c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995 C310,145.43,300.549,94.761,230.454,94.761z"></path> </g> </g></svg>
                <span class="text-center pt-[6px]">LinkedIn</span>
            </a>
        </div>
    </div>
</div>
<Footer />
{/if}


<style>
    
    .link-word {
        color: var(--white);
        text-decoration: underline;
        text-decoration-thickness: 1px;
    }

    #what_conditions_are_supported {
        scroll-margin-top: 75px;
    }

    #what_medications_are_supported {
        scroll-margin-top: 75px;
    }

    h2 {
        text-align: center;
        margin-top: 2rem;
        margin-bottom: 2rem;
        color: white;
        /* font-style: italic; */
        font-size: 3rem;
        font-weight: 300;

        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 8px;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
    }

    p {
        font-size: 1.25rem;
        font-weight: 200;
        color: white;
    }

    a {
        font-size: 1.25rem;
    }

    .columnscontainer {
        display: flex;
    }

    .column {
        text-align: center;
        flex: 1;
    }

    .columnscontainer li::marker {
        color: rgba(255, 255, 255, 0);
    }

    @media (max-width: 768px) {

        h2 {
            font-size: 2rem;
        }

        p {
            font-size: 1.35rem;
        }

        a {
            font-size: 1.25rem;
        }

        .columnscontainer {
            flex-wrap: wrap;
        }

        .column {
            width: 100%;
            flex: 0 0 100%;
            text-align: left;
        }
  }
</style>