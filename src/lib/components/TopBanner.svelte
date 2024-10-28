<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { SearchOutline } from 'flowbite-svelte-icons';
  import ModalPWA from './ModalPWA.svelte';

  let selected = $page.url.pathname;
  let showModal = false;
  let isStandAlone = false;
  
  onMount(() => {
    isStandAlone = window.navigator.standalone || false;
    console.log(selected);
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
        <a class="flex justify-center font-medium text-lg text-[var(--darkbackground)]" href="/search" on:click={() => {changeSelected("/search");}} style="text-decoration: {selected.includes("search") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Search</a>
        <a class="flex justify-center font-medium text-lg text-[var(--darkbackground)]" href="/tree" on:click={() => {changeSelected("/tree");}} style="text-decoration: {selected.includes("tree") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Tree</a>
        <a class="flex justify-center font-medium text-lg text-[var(--darkbackground)]" href="/recovery-graph" on:click={() => {changeSelected("/recovery-graph");}} style="text-decoration: {selected.includes("recovery-graph") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">Track</a>
        <a class="flex justify-center font-medium text-lg text-[var(--darkbackground)]" href="/about" on:click={() => {changeSelected("/about");}} style="text-decoration: {selected.includes("about") ? "underline" : "none"}; text-decoration-thickness: 3px; text-underline-offset: 3px;" type="button">About</a>
    </nav>
</div>

{#if selected.includes("/search")}
    <div class="text-center text-xl sm:text-2xl text-[var(--darkbackground)] pb-4 bg-[var(--white)] rounded-b-lg text-bold flex flex-col">
        <span class="flex flex-row justify-center items-center gap-1"><SearchOutline class="w-7 h-7 pb-[3px]"/> Medication & Supplement Search</span>
        <span class="text-center text-sm">Search <a class="underline" href="/about#where_is_the_data_from">subreddits</a> with key terms</span>
    </div>
{:else if selected.includes("/tree")}
    <div class="text-center text-xl sm:text-2xl text-[var(--darkbackground)] pb-4 bg-[var(--white)] rounded-b-lg text-bold flex flex-col">
        <span class="flex flex-row justify-center items-center gap-1">
            <svg fill="#000000" class="w-9 h-9 pb-[1px]" viewBox="0 0 256.00 256.00" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="6.4"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M168,108h48a12.01343,12.01343,0,0,0,12-12V48a12.01343,12.01343,0,0,0-12-12H168a12.01343,12.01343,0,0,0-12,12V68H144a28.03146,28.03146,0,0,0-28,28v28H84V108A12.01343,12.01343,0,0,0,72,96H32a12.01343,12.01343,0,0,0-12,12v40a12.01343,12.01343,0,0,0,12,12H72a12.01343,12.01343,0,0,0,12-12V132h32v28a28.03146,28.03146,0,0,0,28,28h12v20a12.01343,12.01343,0,0,0,12,12h48a12.01343,12.01343,0,0,0,12-12V160a12.01343,12.01343,0,0,0-12-12H168a12.01343,12.01343,0,0,0-12,12v20H144a20.02229,20.02229,0,0,1-20-20V96a20.02229,20.02229,0,0,1,20-20h12V96A12.01343,12.01343,0,0,0,168,108ZM76,148a4.00427,4.00427,0,0,1-4,4H32a4.00427,4.00427,0,0,1-4-4V108a4.00427,4.00427,0,0,1,4-4H72a4.00427,4.00427,0,0,1,4,4Zm88,12a4.00427,4.00427,0,0,1,4-4h48a4.00427,4.00427,0,0,1,4,4v48a4.00427,4.00427,0,0,1-4,4H168a4.00427,4.00427,0,0,1-4-4Zm0-112a4.00427,4.00427,0,0,1,4-4h48a4.00427,4.00427,0,0,1,4,4V96a4.00427,4.00427,0,0,1-4,4H168a4.00427,4.00427,0,0,1-4-4Z"></path> </g></svg>
            Chronic Illness Research Tree
        </span>
        <span class="text-center text-sm">This tool is crowd-sourced knowledge</span>
    </div>
{/if}

<style>

  .navbar {
    top: 0px;
    left: 0px;
    z-index: 10;
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