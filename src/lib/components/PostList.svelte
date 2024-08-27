<script>
  import { onMount } from 'svelte'
  import PostItem from "./PostItem.svelte";
  import { ClockSolid } from 'flowbite-svelte-icons';

  export let posts = [];
  export let chronologyMode = false;

  let itemsPerPage = 10; // Number of items to load per page
  let currentPage = 1;

  function loadMore() {
    currentPage++;
  }

  function formatDate(date1, date2) {
    let firstDate = new Date(date1);
    let secondDate = new Date(date2);
    let differenceMilliseconds = firstDate - secondDate;
    let differenceDays = differenceMilliseconds / (1000 * 60 * 60 * 24) | 0;

    return differenceDays;
  }

  $: visiblePosts = posts.slice(0, currentPage * itemsPerPage);

  onMount(loadMore);
</script>

{#if posts.length > 0}
  {#if chronologyMode}
    <ul>
      {#each visiblePosts as post, idx (post.id)}
        <PostItem item={post}/>
        {#if idx < posts.length-1}
          <div class="timediv">
            <div class="duration" style="color: white;">
              <ClockSolid />
              {formatDate(posts[idx].date, posts[idx+1].date)}
              Days
            </div>
          </div>
        {/if}
      {/each}
    </ul>
  {:else}
   <ul>
      {#each visiblePosts as post (post.id)}
        <PostItem item={post}/>
      {/each}
    </ul>
  {/if}
  <div class="button-container">
    {#if visiblePosts.length < posts.length}
      <button on:click={loadMore}>Load More</button>
    {/if}
  </div>
{/if}

<style>
    .timediv {
        display: flex;
        flex-direction: column;
        color: var(--offwhite);
    }

    .duration {
        display: flex;
        flex-direction: row;
        margin: auto;
        gap: 0.75rem;
    }

    .button-container {
        display: flex;
        justify-content: center;
    }

    button {
        color: #202142;
        background-color: #202142;
        color: #ffff;
        border: 0;
        border-radius: 0.5rem;
        width: 6.75rem;
        height: 2.5rem;
        cursor: pointer;
    }

    button:hover {
        transform: scale(0.98);
        opacity: 0.9;
    }
</style>