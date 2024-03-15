<script>
    import {EnvelopeSolid, GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { fly } from 'svelte/transition'
    import { subreddits, illnesses, wikipedia_links_illnesses, wikipedia_links_medications, medications, supplements } from '../../lib/components/constants.js'
    
    let animate = false;
    onMount(() => animate = true);

</script>

<TopBanner />

{#if animate}
<div class="divbg" in:fly|global={{y: 30, delay: 50, duration: 1000 }}>
    <div class="textbox" id="what_is_openrxn">
        <h2>What is <span class="highlighted-word" style="font-weight:700">OpenRXN</span>?</h2>
        <p>
            This website makes the reactions people experience during tickborne disease treatment accessible to you.
            <br/><br/>Medical data often lacks the nuanced information that is discernable through personal narrative, and we provide access to relevant narratives with the push of a button.
            <br/><br/>We hope that this data provides a better basis of understanding for your own healthcare.
        </p>
    </div>

    <div class="textbox" id="what_does_openrxn_mean">
        <h2>What does <span class="highlighted-word" style="font-weight:700">"OpenRXN"</span> mean?</h2>
        <p>
            Good question! The medical abbreviation <a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="highlighted-word"> RXN </a> means <a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="highlighted-word"> reaction</a>. 
            <br/><br/>We provide a search tool, open to anyone, for discovering the reactions people experience during treatment. Hence the term Open<a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="highlighted-word">RXN</a>.
        </p>
    </div>

    <div class="textbox" id="what_is_the_inspiration_for_this_site">
        <h2>What is the <span class="highlighted-word" style="font-weight:700">Inspiration</span> for this site?</h2>
        <p>
            I contracted Rocky Mountain Spotted Fever and Lyme Disease during a trip to North Carolina in January 2022 which led to severe illness. 
            My recovery took over two years and involved various antibiotics and supplements. Having spent many hours researching and reading tickborne disease content in my pursuit of health, I often found people's firsthand experiences to be the most relatable and insightful.
            <br/><br/>I wished I could compile all these stories to see how others managed their symptoms and medications.
            This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
        </p>
    </div>

    <div class="textbox" id="where_is_the_data_from">
        <h2>Where is the <span class="highlighted-word" style="font-weight:700">Data</span> from?</h2>
        <p>
            The current version of the website is using Reddit content between June 2005 to December 2022 from the following subreddits: <br/><br/>
        </p>
        <div class="columnscontainer">
            <div class="column">
                {#each subreddits.slice(0, Math.ceil(subreddits.length/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="highlighted-word">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each subreddits.slice(Math.ceil(subreddits.length/3), Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="highlighted-word">{subreddit}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each subreddits.slice(Math.ceil(subreddits.length*2/3)) as subreddit}
                    <li>
                        <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="highlighted-word">{subreddit}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="textbox" id="what_conditions_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:700">Conditions</span> are supported?</h2>
        <div class="columnscontainer">
            <div class="column">
                {#each illnesses.slice(0, Math.ceil(illnesses.length/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each illnesses.slice(Math.ceil(illnesses.length/3), Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each illnesses.slice(Math.ceil(illnesses.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_illnesses[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="textbox" id="what_medications_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:700">Medications</span> are supported?</h2>
        <div class="columnscontainer">
            <div class="column">
                {#each medications.slice(0, Math.ceil(medications.length/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each medications.slice(Math.ceil(medications.length/3), Math.ceil(medications.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each medications.slice(Math.ceil(medications.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="textbox" id="what_supplements_are_supported">
        <h2>What <span class="highlighted-word" style="font-weight:700">Supplements</span> are supported?</h2>
        <div class="columnscontainer">
            <div class="column">
                {#each supplements.slice(0, Math.ceil(supplements.length/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each supplements.slice(Math.ceil(supplements.length/3), Math.ceil(supplements.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>

            <div class="column">
                {#each supplements.slice(Math.ceil(supplements.length*2/3)) as item}
                    <li>
                        <a href={wikipedia_links_medications[item]} target="_blank" rel="noreferrer" class="highlighted-word">{item}</a>
                    </li>
                {/each}
            </div>
        </div>
    </div>

    <div class="textbox" id="how_can_i_support_this_project">
        <h2>How can I <span class="highlighted-word" style="font-weight:700">Support</span> this project?</h2>
        <p>
            You can support this project by contributing to the <a href="https://github.com/RonanChance/OpenRXN" target="_blank" rel="noreferrer" class="highlighted-word">Github</a>.
            <br/><br/>And reach out to me if you have any questions, recommendations, or just want to connect.
            <br/><br/>
            <br/>
        </p>
        <div class="githublinkedin">
            <a href="mailto:Ronan@OpenRXN.com">
                <EnvelopeSolid class="w-8 h-8 text-white" role="button"/>
            </a>
            <a href="https://github.com/RonanChance/OpenRXN">
                <GithubSolid class="w-8 h-8 text-white" role="button"/>
            </a>
            <a href="https://www.linkedin.com/in/ronancdonovan">
                <LinkedinSolid class="w-8 h-8 text-white" role="button"/>
            </a>
        </div>
        <br/><br/>
    </div>
</div>

<div class="paddingbottom"></div>
{/if}


<style>
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
        font-style: italic;

        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 8px;
        text-decoration-style: solid;
        text-decoration-skip-ink: none;
    }

    p {
        font-size: medium;
        color: white;
    }

    .textbox {
        padding-top: 1rem;
        padding-bottom: 2rem;
        margin-left: 10%;
        margin-right: 10%;
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

    .githublinkedin {
        display: flex;
        justify-content: space-evenly;
    }

    @media (max-width: 768px) {

        p {
            font-size: 14pt;
        }

        a {
            font-size: 14pt;
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