import * as server from '../entries/pages/logout/_page.server.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/logout/+page.server.js";
export const imports = ["_app/immutable/nodes/6.850f15ff.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js"];
export const stylesheets = [];
export const fonts = [];
