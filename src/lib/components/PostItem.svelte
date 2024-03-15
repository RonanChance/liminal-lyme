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
    <div class="tags">
        {#each item.conditions as con}
            <div class="bg-[var(--condition)] text-[#ffff] text-xs font-medium mr-2 px-2.5 py-0.5 rounded" style="display: inline-block;">{con}</div>
        {/each}
    </div>
    <div class="tags">
        {#each item.medications as med}
            <div class="bg-[var(--medication)] text-[#ffff] text-xs font-medium mr-2 px-2.5 py-0.5 rounded" style="display: inline-block;">{med}</div>
        {/each}
    </div>
    <div class="tags">
        {#each item.supplements as sup}
            <div class="bg-[var(--supplement)] text-[#ffff] text-xs font-medium mr-2 px-2.5 py-0.5 rounded" style="display: inline-block;">{sup}</div>
        {/each}
    </div>
    <div class="str-name-subreddit-date">
        <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">@{item.author}</span>
        <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">r/{item.subreddit}</span>
        <span class="bg-[var(--blue)] text-[var(--offwhite)] text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400" style="white-space: nowrap; display: inline-block;">{formatDate(item.date)}</span>
    </div>
    <div class="num-rating">
        <AngleUpSolid size=xs /> 
        {item.score}
    </div>
    <a class="side-link" href="{item.permalink}" target="_blank">
        <ChevronRightSolid style="bg-white" size=xs/>
    </a>
    <div class="str-review">
        {@html decodeHTMLEntities(item.body)}
    </div>
</Card>

<style>
    .str-name-subreddit-date{
        padding-bottom: 10pt;
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
    .side-link {
        position: absolute;
        right: 0px; /* Adjust the position as needed */
        top: 0;
        bottom: 0;
        color: #fff;
        background: #e14b00; /* Set the same background color as the card */
        border-radius: 0 10px 10px 0; /* Apply rounded edges on the side link */

        /* Center the chevron icon vertically within the side link */
        display: flex;
        align-items: center;
        padding: 0 5px; /* Adjust padding for spacing */
    }
    .str-review {
        max-width: 105%;
        word-wrap: break-word;
        overflow: hidden;
        white-space: pre-wrap;
    }
</style>