<script>
    import {EnvelopeSolid, GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import { onMount } from 'svelte';
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { fly } from 'svelte/transition'

    let animate = false;
    onMount(() => animate = true);

    const subreddits = ['AlternativeHealth', 'Anxiety', 'AskDocs', 'askdoctors', 'AskDoctorSmeeee', 'camping', 'CampingandHiking', 'ChronicIllness', 'ChronicPain', 'Connecticut', 'covidlonghaulers', 'Health', 'healthcare', 'IAmA', 'Lyme', 'medicine', 'Outdoors', 'Survival', 'WhatIsThisBug']
</script>

<TopBanner />

{#if animate}
<div class="divbg" in:fly|global={{y: 100, delay: 50, duration: 1000 }}>
    <h2>What is <span class="highlighted-word" style="font-weight:700">OpenRXN</span>?</h2>
    <div class="textbox">
        <p>
            This website makes the reactions people experience during tickborne disease treatment accessible to you.
            <br/><br/>Medical data often lacks the nuanced information that is discernable through personal narrative, and we provide access to relevant narratives with the push of a button.
            <br/><br/>We hope that this data provides a better basis of understanding for your own healthcare.
        </p>
    </div>

    <h2>What does <span class="highlighted-word" style="font-weight:700">"OpenRXN"</span> mean?</h2>
    <div class="textbox">
        <p>
            Good question! The medical abbreviation <a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="highlighted-word"> RXN </a> is short for "Reaction". 
            <br/><br/>We provide a search tool, open to anyone, for discovering the reactions people experience during treatment. Hence the term "OpenRXN"!
        </p>
    </div>

    <h2>Where is the <span class="highlighted-word" style="font-weight:700">Data</span> from?</h2>
    <div class="textbox">
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

    <h2>What is the <span class="highlighted-word" style="font-weight:700">Inspiration</span> for this site?</h2>
    <div class="textbox">
        <p>
            I contracted Rocky Mountain Spotted Fever and Lyme Disease during a trip to North Carolina in January 2022 which led to a severe illness. 
            My recovery took over a year and involved various antibiotics and supplements. Throughout the process, I dedicated a lot of time to researching and reading about tickborne disease. 
            I found, at times, that peoples firsthand experiences were more relatable and insightful than conventional medical literature.
            <br/><br/>I wished I could compile all these stories to see how others managed their symptoms and medications.
            This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
        </p>
    </div>

    <h2>How can I <span class="highlighted-word" style="font-weight:700">Support</span> this project?</h2>
    <div class="textbox">
        <p>
            You can support this project by contributing to the <a href="https://github.com/RonanChance/OpenRXN" target="_blank" rel="noreferrer" class="highlighted-word">Github</a>.
            <br/><br/>And reach out to me if you have any questions, recommendations, or just want to network.
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

    .paddingbottom {
        padding-bottom: 10rem;
    }

    .divbg {
        margin-left: 15%;
        margin-right: 15%;
        background: linear-gradient(135deg, rgba(14, 43, 74, 0.613), rgba(162, 162, 162, 0.4));
        backdrop-filter: blur(50px);
        -webkit-backdrop-filter: blur(50px);
        border-radius: 20px;
        border:1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    @media (max-width: 768px) {
        .divbg {
            margin-left: 5%;
            margin-right: 5%;
        }

        .columnscontainer {
            flex-wrap: wrap;
        }

        .column {
            width: 100%;
            flex: 0 0 80%;
            text-align: left;
        }
  }
</style>