<script>
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition'

    let animate = false;
    onMount(() => animate = true);

    const words = [' Health.', ' Medication.', 'Journey.', 'Insight.']
    let currentIndex = 0;
    let currentWord = words[currentIndex];

    const interval = 2000; // Change text every 2 seconds 

    const rotateText = () => {
      currentIndex = (currentIndex + 1) % words.length;
      currentWord = words[currentIndex];
    };

    // Set up an interval to rotate text
    const textInterval = setInterval(rotateText, interval);

    // Add this back if I want to stop the scrolling words
    // $: {
      // Clear the interval when the component is destroyed
      // if (currentIndex === words.length - 1) {
      //   clearInterval(textInterval);
      // }
    // }
</script>

<div class="rotating-text">
  <div class="half">
    <h1 class="fixed-word">Your</h1>
  </div>
  &nbsp;&nbsp;
  {#key currentWord}
    <div class="half">
      <h1 class="highlighted-word" in:fly|global={{ y: -25, delay: 0}}>{currentWord}</h1>
    </div>
  {/key}
</div>

{#if animate}
  <div class="sub-heading text-center">
    <h2 in:fly|global={{y: 100, delay: 50, duration: 1000 }}>
      <!-- <div class="emoji inline">🤒</div> Condition + <div class="emoji inline">💊</div> Medication <span class="second-line">= <div class="emoji inline">🙂</div> Informed Patient</span> -->
      <div class="inline"> 
      Get <span class="bold">insights</span> based on your <span class="bold">conditions & medications</span>
      </div>
    </h2>
  </div>
{/if}

<style>
  .sub-heading {
    width: 100%;
    margin-bottom: 15pt;
  }

  .bold {
    font-weight: bold;
  }
  
  .rotating-text {
    display: flex;
    margin-top: 10pt;
    margin-bottom: 10pt;
  }
  
  .emoji {
    display: inline-block;
    font-size: 35px; /* Set the default size of the emoji */
    transition: font-size 0.2s; /* Add a transition for a smooth change in size */
  }
  .emoji:hover {
    font-size: 40px; /* Set the larger size when hovered on */
  }

  .half {
    flex-basis: 50%;
    display: flex;
    /* justify-content: flex-start; */
  }
  .fixed-word {
    margin-left: auto;
    /* justify-self: flex-end; */
  }
  .highlighted-word {
    margin-right: auto;
  }
  @media (max-width: 768px) {

    .rotating-text {
        padding-bottom: 2%;
    }

    .emoji-line {
        padding-bottom: 2%;
    }

    .second-line{
      display: block;
    }
    h2 {
      font-size: 18px;
    }
    .emoji {
      display: inline-block;
      font-size: 20px; /* Set the default size of the emoji */
      transition: font-size 0.2s; /* Add a transition for a smooth change in size */
    }
    .emoji:hover {
      font-size: 25px; /* Set the larger size when hovered on */
    }
    .fixed-word {
      margin-right: 0;
    }
    .highlighted-word {
      margin-left: 0;
    }
  }
</style>