

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.ed726968.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js","_app/immutable/chunks/stores.283e6d03.js","_app/immutable/chunks/singletons.ad51fe39.js"];
export const stylesheets = [];
export const fonts = [];
