import { c as create_ssr_component, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { T as TopBanner } from "../../chunks/TopBanner.js";
/* empty css                                                            */const IntroInfo_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "h1.svelte-1ww5z53{font-weight:600}.sub-heading.svelte-1ww5z53{width:100%;margin-bottom:15pt}.bold.svelte-1ww5z53{font-weight:bold}.rotating-text.svelte-1ww5z53{display:flex;margin-top:10pt;margin-bottom:10pt}.half.svelte-1ww5z53{flex-basis:50%;display:flex}.fixed-word.svelte-1ww5z53{margin-left:auto}.highlighted-word.svelte-1ww5z53{margin-right:auto}@media(max-width: 768px){.rotating-text.svelte-1ww5z53{padding-bottom:2%}h2.svelte-1ww5z53{font-size:20px}.fixed-word.svelte-1ww5z53{margin-right:0}.highlighted-word.svelte-1ww5z53{margin-left:0}}",
  map: null
};
const interval = 2e3;
const IntroInfo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const words = [" Health.", " Medication.", "Journey.", "Insight."];
  let currentIndex = 0;
  let currentWord = words[currentIndex];
  const rotateText = () => {
    currentIndex = (currentIndex + 1) % words.length;
    currentWord = words[currentIndex];
  };
  setInterval(rotateText, interval);
  $$result.css.add(css$2);
  return `<div class="rotating-text svelte-1ww5z53"><div class="half svelte-1ww5z53" data-svelte-h="svelte-1a73zgs"><h1 class="fixed-word svelte-1ww5z53">Your</h1></div>
    
  <div class="half svelte-1ww5z53"><h1 class="highlighted-word svelte-1ww5z53">${escape(currentWord)}</h1></div></div> ${``}`;
});
const LandingPageContent_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".imgdiv.svelte-ymxa46{min-width:50%;max-width:50%;height:auto;width:auto}.content-container.svelte-ymxa46{display:flex;flex-direction:column;gap:20px}.text-info.svelte-ymxa46{max-width:50%;padding-left:4%;padding-right:4%;display:flex;flex-direction:column;justify-content:center;color:white;font-size:12pt}.info-row.svelte-ymxa46{display:flex;flex-direction:row;justify-content:space-around;padding-left:2%;padding-right:2%;padding-top:5%;padding-bottom:5%}.disclaimer-container.svelte-ymxa46{padding-top:5%;max-width:90%;margin:auto;padding-bottom:5%}.numbersdiv.svelte-ymxa46{display:flex;flex-direction:column;align-items:center;padding-top:4%}hr.svelte-ymxa46{opacity:0.5;width:80%;margin:auto}.transparenttext.svelte-ymxa46{padding-top:2%;color:white;opacity:0.5}.numbertext.svelte-ymxa46{color:white;font-weight:bold;font-size:50pt}.divbg.svelte-ymxa46{max-width:50%;margin:auto}.buttondiv.svelte-ymxa46{padding-top:3%}.infonote.svelte-ymxa46{margin:auto;max-width:90%;padding-top:5%;padding-bottom:10%;text-align:center}@media(max-width: 768px){.disclaimer-container.svelte-ymxa46{padding-bottom:10%}.buttondiv.svelte-ymxa46{padding-top:5%}.divbg.svelte-ymxa46{max-width:95%;margin:auto}.infonote.svelte-ymxa46{padding-top:10%}}",
  map: null
};
const LandingPageContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `${``}`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".intro-container.svelte-1y6roqi{padding-top:10%;padding-left:8%;padding-right:8%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} <div class="intro-container svelte-1y6roqi">${validate_component(IntroInfo, "IntroInfo").$$render($$result, {}, {}, {})}</div> ${validate_component(LandingPageContent, "LandingPageContent").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
