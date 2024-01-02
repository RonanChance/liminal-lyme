<script>
    import { createEventDispatcher } from 'svelte';
    import MultiSelect from 'svelte-multiselect';
    import CountSlot from './CountSlot.svelte';

    const dispatch = createEventDispatcher();

    let selected = [];
    export let options = [];
    export let placeholderString = '';
    export let tag_counts = {};

    $: {
        dispatch('choices', selected);
    }
</script>

<MultiSelect bind:selected options={options} placeholder={placeholderString} let:option>
    <CountSlot {option} {tag_counts} {selected} />
</MultiSelect>