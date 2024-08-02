<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { getCookie } from '../../lib/components/constants';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let email;
  let selected = $page.url.pathname;
  
  onMount(() => {
        if (browser) {
          email = getCookie('email');
          // console.log(email);
        }
    });

  function changeSelected(Destination) {
      goto(Destination)
  }

</script>

<div class="navbar">
    <a href="/">
      <img src="/banner.png" class="mainlogo w-[170px] md:w-[250px] xl:w-[250px]" alt="LiminalLyme" />
    </a>
    <nav class="nav-links">
      {#if email}
        <button href="/logout" on:click={() => {changeSelected("/logout");}} style="text-decoration: {selected.includes("logout") ? "underline" : "none"}">Logout</button>
      {/if}
      <button href="/search" on:click={() => {changeSelected("/search");}} style="text-decoration: {selected.includes("search") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;">SEARCH</button>
      <button href="/tree" on:click={() => {changeSelected("/tree");}} style="text-decoration: {selected.includes("tree") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;">TREE</button>
      <button href="/about" on:click={() => {changeSelected("/about");}} style="text-decoration: {selected.includes("about") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;">ABOUT</button>
    </nav>
</div>

<style>
    .nav-links {
      display: flex;
      gap: 1rem;
      color: var(--darkbackground);
      font-weight: 600;
    }

  .navbar {
      position: sticky;
      top: 0px;
      z-index: 2;
      background: var(--white);

      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1%;
      padding-bottom: 1%;
      padding-left: 8%;
      padding-right: 8%;

      backface-visibility: hidden;
  }

  .mainlogo{
    transition: transform 0.2s;
  }

  .mainlogo:hover{
    transform: scale(105%);
  }

  @media (max-width: 768px) {
    .navbar {
        padding-top: 3%;
        padding-bottom: 3%;
        padding-left: 3%;
        padding-right: 3%;
    }
  }

</style>
