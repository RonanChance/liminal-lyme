

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.e994616b.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js"];
export const stylesheets = ["_app/immutable/assets/0.3915aa75.css"];
export const fonts = [];
