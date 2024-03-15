

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.22f8a320.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js","_app/immutable/chunks/each.7fd2ffb1.js","_app/immutable/chunks/TopBanner.b7ca72bd.js","_app/immutable/chunks/singletons.ad51fe39.js"];
export const stylesheets = ["_app/immutable/assets/3.68c340a0.css","_app/immutable/assets/TopBanner.05adf756.css"];
export const fonts = [];
