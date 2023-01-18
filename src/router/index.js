import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/home" },
  {
    // 主页
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
    children: [
      {
        path: "/trend",
        name: "/trend",
        component: () => import("@/views/trend.vue"),
      },
      {
        path: "/mean",
        name: "/mean",
        component: () => import("@/views/mean.vue"),
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
