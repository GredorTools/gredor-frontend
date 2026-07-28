import { createRouter, createWebHistory } from "vue-router";
import PageMain from "@/pages/PageMain.vue";
import PageSend from "@/pages/PageSend.vue";
import PageAbout from "@/pages/PageAbout.vue";

const routes = [
  { path: "/", component: PageMain },
  { path: "/om", component: PageAbout },
  { path: "/laddaupp", component: PageSend },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
