<script>
    import { AccordionItem, Accordion } from 'flowbite-svelte';
    import {GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import TopBanner from '../../lib/components/TopBanner.svelte'

    const subreddits = ['AlternativeHealth', 'Anxiety', 'AskDocs', 'askdoctors', 'AskDoctorSmeeee', 'camping', 'CampingandHiking', 'ChronicIllness', 'ChronicPain', 'Connecticut', 'covidlonghaulers', 'Health', 'healthcare', 'IAmA', 'Lyme', 'medicine', 'Outdoors', 'Survival', 'WhatIsThisBug']
</script>

<TopBanner />

<div class="accordion-container">
    <Accordion>
        <AccordionItem class="accordion-item bg-gray-100" >
            <span slot="header">What is this website?</span>
            <p class="text-lg text-white">This website aims to make the reactions people have during treatment accessible to you.
            
            <br/><br/>Medical data often lacks nuanced information that is only discernable through personal narrative. We want to supercharge these narratives to empower your recovery. 
                
            <br/><br/>The hope is that this data provides a better basis of understanding for your own healthcare, whether you are dealing with an acute or persistent issue.
        </AccordionItem>

        <AccordionItem class="accordion-item bg-gray-100" >
            <span slot="header">What does "OpenRXN" mean?</span>
            <p class="text-lg text-white ">
            Good question! The medical abbreviation <a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="text-blue-600"> RXN </a> is short for "Reaction". 
            <br/><br/>We provide a search tool, open to anyone, for discovering the reactions people experience during treatment, hence the name OpenRXN.
        </AccordionItem>

        <AccordionItem class="accordion-item bg-gray-100">
            <span slot="header">Where is the data from?</span>
            <p class="text-lg text-white ">
                The current version of the website is using Reddit content between June 2005 to December 2022 from the following subreddits: <br/><br/>
                {#each subreddits as subreddit}
                    <li>
                    <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="text-blue-600"> {subreddit} </a>
                    </li>
                {/each}
            </p>
        </AccordionItem>

        <AccordionItem class="accordion-item bg-gray-100">
            <span slot="header">What is the inspiration for this site?</span>
            <p class="text-lg text-white ">
                In late 2021, I contracted Rocky Mountain Spotted Fever and Lyme Disease during a trip to North Carolina, which led to a severe illness. 
                My recovery took over a year and involved various antibiotics and supplements. Throughout the process, I dedicated a lot of time to researching and reading about tickborne disease. 
                I found, at times, that peoples firsthand experiences were more relatable and insightful than conventional medical literature.
                <br/><br/>I wished I could compile all these stories to see how others managed their symptoms and medications.
                This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
            </p>
        </AccordionItem>

        <AccordionItem class="accordion-item bg-gray-100">
            <span slot="header">How can I support this project?</span>
            <p class="text-lg text-white">
                You can support this project by contributing to the <a href="https://github.com/RonanChance/OpenRXN" target="_blank" rel="noreferrer" class="text-blue-600">Github</a>.
                <br/><br/>And reach out to me if you have any questions, recommendations, or just want to network.
                <br/><br/>Email: Ronan@OpenRXN.com
                <br/><br/>
            </p>
            <div class="githublinkedin">
                <a href="https://github.com/RonanChance/OpenRXN">
                    <GithubSolid class="w-8 h-8 text-gray" role="button"/>
                </a>
                <a href="https://www.linkedin.com/in/ronancdonovan">
                    <LinkedinSolid class="w-8 h-8 text-gray" role="button"/>
                </a>
            </div>
        </AccordionItem>
    </Accordion>
</div>

<style>

    p {
        color: black;
    }

    .accordion-container {
        width: 60%;
        margin: auto;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        background-color: white;
    }

    .githublinkedin {
        display: flex;
        justify-content: space-evenly;
    }

    .accordion-item{
        width: 100%;
    }

    @media (max-width: 768px) {
    .accordion-container{
        width: 75%;
    }
    .accordion-item {
        width: 100%;
    }
  }
</style>