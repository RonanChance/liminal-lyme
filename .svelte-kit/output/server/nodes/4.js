import * as server from '../entries/pages/auth/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/auth/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/auth/+page.server.js";
export const imports = ["_app/immutable/nodes/4.71e6f5ee.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js","_app/immutable/chunks/TopBanner.b7ca72bd.js","_app/immutable/chunks/singletons.ad51fe39.js","_app/immutable/chunks/pocketbase.es.baadb37e.js"];
export const stylesheets = ["_app/immutable/assets/4.1af319d0.css","_app/immutable/assets/TopBanner.05adf756.css"];
export const fonts = [];
