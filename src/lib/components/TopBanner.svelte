<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { getCookie } from '../../lib/components/constants';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ModalPWA from './ModalPWA.svelte';

  let email;
  let selected = $page.url.pathname;
  export let expand = false;
  let showModal = false;
  
  onMount(() => {
      if (browser) {
        email = getCookie('email');
      }
  });

  function changeSelected(Destination) {
    goto(Destination)
  }

  function showPWAPoppup(){
    showModal = true;
  }

</script>

<ModalPWA bind:showModal>
  <div class="flex justify-center">
    <img src="/tutorial.GIF" alt="tutorial" class="w-[235px]"/>
  </div>
</ModalPWA>

<div class="font-semibold bg-[var(--white)] flex flex-row pt-2 px-5 justify-between block md:hidden">
  <div class="flex flex-row items-center justify-center">
    <div class="mr-2 ">
      <img src="/favicon-32x32.png" alt="Logo" class="w-8">
    </div>
    <div class="flex flex-col text-left">
      <div class="text-sm">Liminal Lyme - Open Source Health</div>
      <div class="text-sm text-black text-opacity-40 font-normal">Add to Home Screen</div>
    </div>
  </div>
  <div>
    <button type="submit" class="bg-[#007AFF] text-white font-semibold pt-1 pb-0.5 px-3.5 rounded-3xl flex items-center justify-center" on:click={ showPWAPoppup }>ADD</button>
  </div>
</div>
{#if !expand}
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
{:else}
  <div class="navbar-expanded">
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
{/if}

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
      left: 0px;
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

  .navbar-expanded {
      position: sticky;
      top: 0px;
      left: 0px;
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

  .navbar-expanded::after {
      content: '';
      position: absolute;
      top: 0;
      left: 99%;
      width: 600vw;
      height: 100%;
      background: var(--white);
      z-index: -1;
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
    
    .navbar-expanded {
        padding-top: 3%;
        padding-bottom: 3%;
        padding-left: 3%;
        padding-right: 3%;
    }
  }

</style>
