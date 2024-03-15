

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.058b4447.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js","_app/immutable/chunks/TopBanner.b7ca72bd.js","_app/immutable/chunks/singletons.ad51fe39.js","_app/immutable/chunks/MedicalDisclaimer.d621663c.js"];
export const stylesheets = ["_app/immutable/assets/2.1621713b.css","_app/immutable/assets/TopBanner.05adf756.css","_app/immutable/assets/MedicalDisclaimer.e07ba00b.css"];
export const fonts = [];
