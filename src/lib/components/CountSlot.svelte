<script>
    export let option;
    export let tag_counts;
    export let selected;
</script>
  
<span>
{option} 
<span class="tag-count">{#if selected.includes(option)}{/if}{#if !selected.includes(option)}({tag_counts[option]}){/if}</span>
</span>
  
<style>
span {
    display: flex;
    justify-content: space-between;
}
.tag-count {
    font-size: small;
    align-self: center;
    text-align: right;
}
</style>