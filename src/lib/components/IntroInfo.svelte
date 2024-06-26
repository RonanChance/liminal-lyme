<script>
    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition'

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

<div class="intro-info">
  <div class="rotating-text">
    {#key currentWord}
        <h1 in:fade|global={{duration: 750}}>YOUR <span class="highlighted-word">{currentWord}</span></h1>
    {/key}
  </div>

  {#if animate}
    <div class="sub-heading text-center">
      <h2 in:fade|global={{y: 100, delay: 50, duration: 1000 }}>
        <div class="inline"> 
        Get <span class="bold">insights</span> from Reddit based on <span class="bold">medications</span> & <span class="bold">supplements</span>
        </div>
      </h2>
    </div>
  {/if}
</div>

<style>

  .intro-info {
    padding-top: 4%;
    padding-left: 8%;
    padding-right: 8%;
  }

  .sub-heading {
    width: 100%;
    margin-top: 50px;
  }

  .bold {
    font-weight: bold;
  }

  .rotating-text {
    margin-top: 50px;
    text-align: center;
  }

  .highlighted-word {
    text-align: center;
  }
</style>