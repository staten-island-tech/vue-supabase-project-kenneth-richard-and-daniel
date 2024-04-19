import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import ('../views/HomeView.vue')
    }, {
      path: '/all-skins',
      name: 'all-skins',
      component: () => import('../views/SkinView.vue')
    }, {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    }, {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue')
    }
  ]
})

export default router
