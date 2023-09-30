<script>
    import { createEventDispatcher } from 'svelte'
    const dispatch = createEventDispatcher()
    import MultiSelect from 'svelte-multiselect'

    let selected = []
    export let options = []
    export let placeholderString = ''
    
    $: {
        dispatch('choices', selected);
    }

</script>

<MultiSelect bind:selected options={options} placeholder={placeholderString}/>