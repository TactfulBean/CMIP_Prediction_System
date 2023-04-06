import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", redirect: "/trend" },
	{
		// 主页
		path: "/home",
		name: "home",
		component: () => import("@/views/HomeView.vue"),
		children: [
			{
				path: "/timeline",
				name: "/timeline",
				component: () => import("@/views/timeLine.vue"),
			},
			{
				path: "/trend",
				name: "/trend",
				component: () => import("@/views/trend.vue"),
			},
			{
				path: "/area",
				name: "/area",
				component: () => import("@/views/area.vue"),
			},
			{
				path: "/globe",
				name: "/globe",
				component: () => import("@/views/globe.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
