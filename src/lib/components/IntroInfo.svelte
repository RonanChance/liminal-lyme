<script>
    import { Popover, Button, Tooltip } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition'

    let animate = false;
    onMount(() => animate = true);

    const words = [' Health.', ' Medication.', 'Journey.', 'Insight.', 'Health.']
    let currentIndex = 0;
    let currentWord = words[currentIndex];

    const interval = 2000; // Change text every 2 seconds (adjust as needed)

    const rotateText = () => {
      currentIndex = (currentIndex + 1) % words.length;
      currentWord = words[currentIndex];
    };

    // Set up an interval to rotate text
    const textInterval = setInterval(rotateText, interval);

    $: {
      // Clear the interval when the component is destroyed
      if (currentIndex === words.length - 1) {
        clearInterval(textInterval);
      }
    }
</script>

<div class="rotating-text">
  <div class="half">
    <h1 class="fixed-word">Your</h1>
  </div>
  &nbsp;&nbsp;
  {#key currentWord}
    <div class="half">
      <h1 class="highlighted-word" in:fly|global={{
        y: -25,
        delay: 0,
      }}>{currentWord}</h1>
    </div>
  {/key}
</div>

{#if animate}
  <div class="text-center">
    <h2 in:fly|global={{
      y: 100,
      delay: 50,
      duration: 1000
  }}><div class="emoji inline">🤒</div> Condition + <div class="emoji inline">💊</div> Medication <span class="second-line">= <div class="emoji inline">🙂</div> Informed Patient</span></h2>

    <h3 in:fly|global={{
      y: 100,
      delay: 100,
      duration: 1200
  }}>
      <span>We're aggregating open-source tickborne disease data so you can see how people with your condition react to medications</span>
      <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
        <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
        </svg>
        <span class="sr-only">Show information</span>
      </button>
    </h3>
    <Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is currently focused on tickborne disease data from Reddit, but may expand in the future!</Popover>
  </div>
{/if}

<style>
  .emoji {
    display: inline-block;
    font-size: 35px; /* Set the default size of the emoji */
    transition: font-size 0.2s; /* Add a transition for a smooth change in size */
  }
  .emoji:hover {
    font-size: 40px; /* Set the larger size when hovered on */
  }
  .rotating-text {
    display: flex;
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
    color: #43bbde;
  }
  @media (max-width: 768px) {
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