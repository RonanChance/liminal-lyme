<script>
  import '@fontsource-variable/league-spartan';
  import "../app.postcss";
  import "../styles.css";
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

{@render children?.()}