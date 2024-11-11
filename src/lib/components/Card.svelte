<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
    const children_render = $derived(children);

</script>

<div class="bg-white rounded-lg p-7 my-6 shadow-[0px_0px_20px_2px_#0c0c18] relative">
    {@render children_render?.()}
</div>