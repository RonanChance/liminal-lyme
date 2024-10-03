<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import ModalPWA from './ModalPWA.svelte';

  let selected = $page.url.pathname;
  let showModal = false;
  let isStandAlone = false;
  
  onMount(() => {
    isStandAlone = window.navigator.standalone || false;
  });

  function changeSelected(Destination) {
    goto(Destination)
  }
</script>

<meta charset="utf-8" name="theme-color" content="#f8f8f8"/>

{#if !isStandAlone}
    <ModalPWA bind:showModal>
    <div class="flex justify-center">
        <video autoplay loop muted playsinline class="w-[85%]">
        <source src="/videos/tutorial.mp4" type="video/mp4"> This browser does not display the video tag. </video>
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
            <button type="submit" class="bg-[#007AFF] text-white font-semibold pt-1 pb-0.5 px-3.5 rounded-3xl flex items-center justify-center" on:click={ ()=> {showModal = true;} }>ADD</button>
        </div>
    </div>
{/if}

<div class="navbar flex flex-row gap-4 ">
    <a href="/">
        <img src="/banner.png" class="mainlogo w-[200px] sm:w-[250px] xl:w-[250px] px-1 py-1 md:px-0" alt="LiminalLyme" />
    </a>
    <nav class="bg-[var(--white)] flex flex-row gap-3 md:gap-6">
        <a class="flex justify-center font-semibold text-lg text-[var(--darkbackground)]" href="/search" on:click={() => {changeSelected("/search");}} style="text-decoration: {selected.includes("search") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Search</a>
        <a class="flex justify-center font-semibold text-lg text-[var(--darkbackground)]" href="/tree" on:click={() => {changeSelected("/tree");}} style="text-decoration: {selected.includes("tree") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Tree</a>
        <a class="flex justify-center font-semibold text-lg text-[var(--darkbackground)]" href="/recovery-graph" on:click={() => {changeSelected("/recovery-graph");}} style="text-decoration: {selected.includes("recovery-graph") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Track</a>
        <a class="flex justify-center font-semibold text-lg text-[var(--darkbackground)]" href="/about" on:click={() => {changeSelected("/about");}} style="text-decoration: {selected.includes("about") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">About</a>
    </nav>
</div>

<style>

  .navbar {
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