<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition'

    let animate = false;
    onMount(() => animate = true);

    const words = ['HEALTH', 'MEDICATION', 'JOURNEY', 'INSIGHT']
    let currentIndex = 0;
    let currentWord = words[currentIndex];

    const interval = 2700; // Change text every 2 seconds 

    const rotateText = () => {
      currentIndex = (currentIndex + 1) % words.length;
      currentWord = words[currentIndex];
    };

    // Set up an interval to rotate text
    const textInterval = setInterval(rotateText, interval);

</script>

<div class="intro-info pt-6 px-2">
  <div class="rotating-text mt-10 text-center">
    {#key currentWord}
        <h1 in:fade|global={{duration: 750}}>YOUR <span class="highlighted-word text-center">{currentWord}</span></h1>
    {/key}
  </div>

  {#if animate}
    <div class="mt-8 text-center">
      <h2 in:fade|global={{y: 100, delay: 50, duration: 1000 }}>
        <div class="inline"> 
        Get <span class="font-bold">insights</span> from Reddit based on <span class="font-bold">medications</span> & <span class="font-bold">supplements</span>
        </div>
      </h2>
    </div>
  {/if}
</div>