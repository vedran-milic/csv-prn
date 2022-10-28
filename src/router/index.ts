import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

export const routes = [
  { path: '/', component: HomeView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
});
