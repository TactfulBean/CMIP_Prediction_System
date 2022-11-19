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
        path: "/function1",
        name: "/function1",
        component: () => import("@/views/function1.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
