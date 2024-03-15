import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { T as TopBanner } from "../../../chunks/TopBanner.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: "#what_conditions_are_supported.svelte-12339hj.svelte-12339hj{scroll-margin-top:75px}#what_medications_are_supported.svelte-12339hj.svelte-12339hj{scroll-margin-top:75px}h2.svelte-12339hj.svelte-12339hj{text-align:center;margin-top:2rem;margin-bottom:2rem;color:white;font-style:italic;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:8px;text-decoration-style:solid;text-decoration-skip-ink:none}p.svelte-12339hj.svelte-12339hj{font-size:medium;color:white}.textbox.svelte-12339hj.svelte-12339hj{padding-top:1rem;padding-bottom:2rem;margin-left:10%;margin-right:10%}.columnscontainer.svelte-12339hj.svelte-12339hj{display:flex}.column.svelte-12339hj.svelte-12339hj{text-align:center;flex:1}.columnscontainer.svelte-12339hj li.svelte-12339hj::marker{color:rgba(255, 255, 255, 0)}.githublinkedin.svelte-12339hj.svelte-12339hj{display:flex;justify-content:space-evenly}@media(max-width: 768px){p.svelte-12339hj.svelte-12339hj{font-size:14pt}a.svelte-12339hj.svelte-12339hj{font-size:14pt}.columnscontainer.svelte-12339hj.svelte-12339hj{flex-wrap:wrap}.column.svelte-12339hj.svelte-12339hj{width:100%;flex:0 0 100%;text-align:left}}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} ${``}`;
});
export {
  Page as default
};
