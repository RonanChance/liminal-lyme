<script>
    import {createEventDispatcher} from 'svelte'
    import { AngleUpSolid, LinkSolid, ChevronRightSolid} from 'flowbite-svelte-icons';
    import Card from './Card.svelte'
    import { Button } from 'flowbite-svelte';
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

</script>

<Card>
    <div class="str-name-subreddit-date">
        <div class="div">@{item.author}</div>
        <div class="div">r/{item.subreddit}</div>
        <div class="div">{formatDate(item.date)}</div>
        <!-- <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">@{item.author}</span>
        <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">r/{item.subreddit}</span>
        <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">{formatDate(item.date)}</span> -->
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
    <div class="str-review">
        {@html decodeHTMLEntities(item.body)}
    </div>
    <div class="sitelinkcontainer">
        <a class="site-link" href="{item.permalink}" target="_blank">
            Visit Post <ChevronRightSolid class="inline" style="bg-white" size=xs/>
        </a>
    </div>
</Card>

<style>

    .tagstyle {
        color: #000;
        margin-right: 2px;
        padding-left: 8px;
        padding-right: 8px;
        padding-top: 1px;
        padding-bottom: 1px;
        border-radius: 5px;
        
        margin-top: 1.5%;
        /* margin-left: 3px; */
        margin-right: 5px;
        font-size: small;

        /* text-xs font-medium mr-2 px-2.5 py-0.5 rounded */
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
        left: -20px;
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

    .sitelinkcontainer {
        display: flex;
    }
    .site-link {
        color: white;
        background: #e14b00;
        padding: 5px 10px 5px 10px;
        border-radius: 10px;

        margin-left: auto;
    }
    .str-review {
        margin-top: 3%;
        max-width: 105%;
        word-wrap: break-word;
        overflow: hidden;
        white-space: pre-wrap;
    }
</style>