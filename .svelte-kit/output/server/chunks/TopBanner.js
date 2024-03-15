import { c as create_ssr_component, a as compute_rest_props, b as spread, d as escape_attribute_value, f as escape_object, v as validate_component, e as escape } from "./ssr.js";
import { twMerge } from "tailwind-merge";
const NavBrand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["href"]);
  let { href = "" } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  return `<a${spread(
    [
      { href: escape_attribute_value(href) },
      escape_object($$restProps),
      {
        class: escape_attribute_value(twMerge("flex items-center", $$props.class))
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</a> `;
});
const TopBanner_svelte_svelte_type_style_lang = "";
const css = {
  code: ".nav-links.svelte-120htaj{display:flex;gap:10px;color:var(--offwhite);font-weight:600}.navbar.svelte-120htaj{position:sticky;top:0px;z-index:1;background:rgba(14, 43, 74, 0.888);display:flex;align-items:center;justify-content:space-between;padding-top:2%;padding-left:8%;padding-right:8%;max-height:100px}.mainlogo.svelte-120htaj{transform:scale(95%);transition:transform 0.2s}.mainlogo.svelte-120htaj:hover{transform:scale(100%)}@media(max-width: 768px){.navbar.svelte-120htaj{padding-top:3%;padding-bottom:3%;padding-left:3%;padding-right:3%}}@media(min-width: 1500px){.navbar.svelte-120htaj{padding-top:2%;padding-bottom:2%;padding-left:20%;padding-right:20%}}",
  map: null
};
const TopBanner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="navbar svelte-120htaj"><div>${validate_component(NavBrand, "NavBrand").$$render($$result, { href: "/" }, {}, {
    default: () => {
      return `<img src="/logo.png" class="mainlogo svelte-120htaj" alt="OpenRXN">`;
    }
  })}</div> <nav class="nav-links svelte-120htaj">${``} <button href="/home" style="${"text-decoration: " + escape("none", true)}">Home</button>
      |
      <button href="/about" style="${"text-decoration: " + escape("none", true)}">About</button></nav> </div>`;
});
export {
  TopBanner as T
};
