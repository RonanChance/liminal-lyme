<script>
  import { onMount } from 'svelte';
  import PostItem from "./PostItem.svelte";
  import { ClockSolid } from 'flowbite-svelte-icons';

  /**
   * @typedef {Object} Props
   * @property {any} [posts]
   * @property {boolean} [chronologyMode]
   */

  /** @type {Props} */
  let { posts = [], chronologyMode = false } = $props();

  let itemsPerPage = 10; // Number of items to load per page
  let currentPage = $state(1);

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

  let visiblePosts = $derived(posts.slice(0, currentPage * itemsPerPage));

  onMount(loadMore);
</script>

{#if posts.length > 0}
  {#if chronologyMode}
    <ul>
      {#each visiblePosts as post, idx (post.id)}
        <PostItem item={post}/>
        {#if idx < posts.length-1}
          <div class="flex flex-col">
            <div class="flex flex-row mx-auto gap-2" style="color: white;">
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
  <div class="flex justify-center">
    {#if visiblePosts.length < posts.length}
      <button class="whitebutton rounded-lg" onclick={loadMore}>Load More</button>
    {/if}
  </div>
{/if}