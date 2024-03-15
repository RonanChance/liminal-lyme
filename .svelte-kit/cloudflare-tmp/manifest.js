export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["bacteria_images/img1.png","bacteria_images/img2.png","bacteria_images/img3.png","bacteria_images/img4.png","favicon.png","favicon_old.png","logo.png","websitedemo.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.f4aab951.js","app":"_app/immutable/entry/app.d1b549b6.js","imports":["_app/immutable/entry/start.f4aab951.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/singletons.ad51fe39.js","_app/immutable/entry/app.d1b549b6.js","_app/immutable/chunks/scheduler.b62641ca.js","_app/immutable/chunks/index.91daa77f.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/api/auth",
				pattern: /^\/api\/auth\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/auth/_server.js'))
			},
			{
				id: "/api/credits/get",
				pattern: /^\/api\/credits\/get\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/credits/get/_server.js'))
			},
			{
				id: "/api/message/create",
				pattern: /^\/api\/message\/create\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/message/create/_server.js'))
			},
			{
				id: "/api/message/list",
				pattern: /^\/api\/message\/list\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/message/list/_server.js'))
			},
			{
				id: "/api/run/create",
				pattern: /^\/api\/run\/create\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/run/create/_server.js'))
			},
			{
				id: "/api/run/retrieve",
				pattern: /^\/api\/run\/retrieve\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/run/retrieve/_server.js'))
			},
			{
				id: "/api/thread/create",
				pattern: /^\/api\/thread\/create\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/thread/create/_server.js'))
			},
			{
				id: "/api/thread/delete",
				pattern: /^\/api\/thread\/delete\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/thread/delete/_server.js'))
			},
			{
				id: "/auth",
				pattern: /^\/auth\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/home",
				pattern: /^\/home\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

export const prerendered = new Set([]);
