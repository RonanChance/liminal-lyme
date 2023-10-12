<script>
    import {GithubSolid, LinkedinSolid} from 'flowbite-svelte-icons'
    import TopBanner from '../../lib/components/TopBanner.svelte'
    import { AccordionItem, Accordion } from 'flowbite-svelte';

    const subreddits = ['AlternativeHealth', 'Anxiety', 'AskDocs', 'askdoctors', 'AskDoctorSmeeee', 'camping', 'CampingandHiking', 'ChronicIllness', 'ChronicPain', 'Connecticut', 'covidlonghaulers', 'Health', 'healthcare', 'IAmA', 'Lyme', 'medicine', 'Outdoors', 'Survival', 'WhatIsThisBug']
</script>

<TopBanner />

<div class="Accordion-container">
    <Accordion >
        <AccordionItem class="bg-gray-100" >
            <span slot="header">What is this website?</span>
            <p class="text-lg mb-2 text-white "> This website aims to make the reactions people have during treatment accessible to you.
            
            <br/><br/> 
            
            Medical data often lacks nuanced information that is only discernable through personal narrative. We want to supercharge these narratives to empower your recovery. 
                
            <br/><br/> 
            
            The hope is that this data provides a better basis of understanding for your own healthcare, whether you are dealing with an acute or persistent issue.
        </AccordionItem>
        <AccordionItem class="bg-gray-100" >
            <span slot="header">What does "OpenRXN" even mean?</span>
            <p class="text-lg mb-2 text-white ">
            Good question! The medical abbreviation <a href="https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_R" target="_blank" rel="noreferrer" class="text-blue-600"> RXN </a> is short for "Reaction". 

            <br/><br/> 

            We provide a tool, open to anyone, to find reactions people have during treatment, hence the name OpenRXN.
        </AccordionItem>
        <AccordionItem class="bg-gray-100">
            <span slot="header">Where is the data from?</span>
            <p class="text-lg p-6 mb-4 text-white ">
                The current version of the website is using Reddit posts between June 2005 to December 2022 from the following subreddits: <br/><br/>
                {#each subreddits as subreddit}
                    <li>
                    <a href="https://www.reddit.com/r/{subreddit}" target="_blank" rel="noreferrer" class="text-blue-600"> {subreddit} </a>
                    </li>
                {/each}
            </p>
        </AccordionItem>
        <AccordionItem class="bg-gray-100">
            <span slot="header">What is the inspiration for this site?</span>
            <p class="text-lg p-6 mb-4 text-white ">
                I contracted Rocky Mountain Spotted Fever & Lyme Disease from a trip to North Carolina in late 2021 and became incredibly ill. 
                My recovery took many months and various antibiotics/supplements. 
                I was researching and reading whatever I could manage about tickborne disease, but I always found peoples own stories the most insightful.
                <br/><br/> 
                I wished I could compile all these expriences to see how others managed their symptoms and medications.
                This website is something I wanted during my acute phase of sickness, and I hope it serves you well.
            </p>
        </AccordionItem>
        <AccordionItem class="bg-gray-100">
            <span slot="header">How can I support this project?</span>
            <p class="text-lg mb-2 text-white">
                You can support this project by contributing to the <a href="https://github.com/RonanChance/OpenRXN" target="_blank" rel="noreferrer" class="text-blue-600">Github</a>.
                <br/><br/>
                And reach out to me if you have any questions, recommendations, or just want to network.
                <br/><br/>
                Email: Ronan@OpenRXN.com
                <br/><br/>
            </p>
            <div class="githublinkedin">
                <a href="https://www.github.com/RonanChance">
                    <GithubSolid class="w-8 h-8 text-white" role="button"/>
                </a>
                <a href="https://www.linkedin.com/in/ronancdonovan">
                    <LinkedinSolid class="w-8 h-8 text-white" role="button"/>
                </a>
            </div>
        </AccordionItem>
    </Accordion>
</div>

<style>
    .githublinkedin {
        display: flex;
        justify-content: space-evenly;
    }
</style>