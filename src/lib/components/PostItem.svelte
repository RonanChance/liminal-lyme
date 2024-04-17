<script>
    import {createEventDispatcher} from 'svelte'
    import { AngleUpSolid, LinkSolid, ChevronRightSolid, ClockSolid} from 'flowbite-svelte-icons';
    import Card from './Card.svelte'
    import { Button } from 'flowbite-svelte';
    import { chronology_usernames } from '../../lib/components/constants.js'

    export let item

    function formatDate(dateString) {
        // Remove the time part and the milliseconds and replace ' ' with 'T' for compatibility
        dateString = dateString.split(' ')[0] + 'T' + dateString.split(' ')[1].split('.')[0] + 'Z';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function decodeHTMLEntities(html) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }

    // Function to handle clicks on medication spans
    function medClick(event) {
        const target = event.target;
        if (target.classList.contains('medication')) {
            const medication = target.textContent.trim();
            // console.log("Clicked on medication:", medication);
            console.log(target.classList[0].split('').reverse().join(''));
        }
        if (target.classList.contains('supplement')) {
            const supplement = target.textContent.trim();
            // console.log("Clicked on supplement:", supplement);
            console.log(target.classList[0].split('').reverse().join(''));
        }
        if (target.classList.contains('condition')) {
            const condition = target.textContent.trim();
            // console.log("Clicked on condition:", condition);
            console.log(target.classList[0].split('').reverse().join(''));
        }
    }
</script>

<Card>
    <div class="str-name-subreddit-date">
        <div class="div">@{item.author}</div>
        <div class="div">r/{item.subreddit}</div>
        <div class="div">{formatDate(item.date)}</div>
    </div>
    <div class="tags">
        {#each item.conditions as con}
            <div class="tagstyle" style="background-color: var(--condition_highlight); display: inline-block;">{con}</div>
        {/each}
    </div>
    <div class="tags">
        {#each item.medications as med}
            <div class="tagstyle" style="background-color: var(--medication_highlight); display: inline-block;">{med}</div>
        {/each}
    </div>
    <div class="tags">
        {#each item.supplements as sup}
            <div class="tagstyle" style="background-color: var(--supplement_highlight); display: inline-block;">{sup}</div>
        {/each}
    </div>
    <div class="num-rating">
        <AngleUpSolid size=xs /> 
        {item.score}
    </div>
    <div class="str-review" on:click|preventDefault="{medClick}">
        {@html decodeHTMLEntities(item.body)}
    </div>
    <div class="actionbuttons">
        {#if item.author in chronology_usernames}
            <a class="chronology-link" href="/home?path=chronologyTab&username={item.author}" target="_blank">
                <ClockSolid class="inline" style="bg-white" size=sm/> History
            </a>
        {/if}
        <a class="site-link" href="{item.permalink}" target="_blank">
            Visit Post <ChevronRightSolid class="inline" style="bg-white" size=xs/>
        </a>
    </div>
</Card>

<style>

    .actionbuttons {
        padding-top: 7%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .tagstyle {
        color: #000;
        margin-right: 2px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 1px;
        padding-bottom: 1px;
        border-radius: 0.25rem;
        
        margin-top: 1.5%;
        margin-right: 5px;
        font-size: small;
    }

    .str-name-subreddit-date{
        font-size: 10pt;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 1%;
    }
    .num-rating{
        position: absolute;
        top: -20px;
        left: -15px;
        width: 50px;
        height: 50px;
        background: #e14b00;
        color: #fff;
        border: 1px #eee solid;
        border-radius: 50%;
        font-size: 11px;
        display: flex; /* Use flexbox to center content */
        flex-direction: column; /* Stack the elements vertically */
        justify-content: center; /* Center vertically */
        align-items: center; /* Center horizontally */
    }

    .site-link {
        display: flex;
        color: white;
        background: #e14b00;
        padding: 8px 8px 8px 8px;
        border-radius: 0.5rem;
        align-items: center;
        gap: 0.5rem;
    }

    .chronology-link {
        display: flex;
        color: white;
        background: var(--accent);
        padding: 8px 8px 8px 8px;
        border-radius: 0.5rem;
        align-items: center;
        gap: 0.5rem;
    }
    .str-review {
        margin-top: 3%;
        max-width: 105%;
        word-wrap: break-word;
        overflow: hidden;
        white-space: pre-wrap;
    }
</style>