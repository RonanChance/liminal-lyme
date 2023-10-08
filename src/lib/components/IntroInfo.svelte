<script>
    import { Popover, Button, Tooltip } from 'flowbite-svelte';
    import { onMount } from 'svelte';
    import TopBanner from './TopBanner.svelte'
</script>

<TopBanner />

<div class="text-center">

<h1>
Your <span class="highlighted-word">Health</span>. <br />
Your <span class="highlighted-word">Medication</span>.
</h1>

<h2>🤒 Condition + 💊 Medication = 🙂 Informed Patient</h2>

<h3>
  <span>We're aggregating open-source data so you can see how people with your condition react to medications</span>
  <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button" id="info-button">
    <svg class="w-4 h-4 ml-0 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
    </svg>
    <span class="sr-only">Show information</span>
  </button>
</h3>
<Popover class="w-64 text-sm font-light" triggeredBy="#info-button" data-popper-placement="left">This research is currently focused on tick-borne disease, but we're adding more daily!</Popover>

</div>

<style>
  .highlighted-word {
    color: #43bbde; 
  }
</style>