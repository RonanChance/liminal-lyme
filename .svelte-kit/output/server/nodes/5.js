import * as server from '../entries/pages/home/_page.server.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/home/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/home/+page.server.js";
export const imports = ["_app/immutable/nodes/5.a7811060.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js","_app/immutable/chunks/TopBanner.b7ca72bd.js","_app/immutable/chunks/singletons.ad51fe39.js","_app/immutable/chunks/pocketbase.es.baadb37e.js","_app/immutable/chunks/each.7fd2ffb1.js","_app/immutable/chunks/MedicalDisclaimer.d621663c.js","_app/immutable/chunks/stores.283e6d03.js"];
export const stylesheets = ["_app/immutable/assets/5.b0a755f4.css","_app/immutable/assets/TopBanner.05adf756.css","_app/immutable/assets/MedicalDisclaimer.e07ba00b.css"];
export const fonts = [];
