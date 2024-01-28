<script>
  import { onMount } from 'svelte'
  import PostItem from "./PostItem.svelte";
  import { Button } from 'flowbite-svelte';
  import PocketBase from 'pocketbase';

  export let fetchDataFunction;
  export let posts = [];
  let itemsPerPage = 10; // Number of items to load per page
  let currentPage = 1;

  function loadMore() {
    currentPage++;
  }

  $: visiblePosts = posts.slice(0, currentPage * itemsPerPage);

  onMount(loadMore);
</script>

{#if posts.length > 0}
  <ul>
    {#each visiblePosts as post (post.id)}
      <PostItem item={post}/>
    {/each}
  </ul>
  <div class="button-container">
    {#if visiblePosts.length < posts.length}
      <button on:click={loadMore}>Load More</button>
    {/if}
  </div>
{/if}

  <style>
    p {
      color: white;
      text-align: center;
      
    }

    a {
      color: #42bade;
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
      border-radius: 8px;
      width: 100px;
      height: 40px;
      cursor: pointer;
    }
  
    button:hover {
      transform: scale(0.98);
      opacity: 0.9;
    }
  
  </style>