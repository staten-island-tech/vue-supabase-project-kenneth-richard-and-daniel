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
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue')
    }, {
      path: '/acc-search',
      name: 'acc-search',
      component: () => import('../views/AccSearch.vue')
    }
  ]
})

export default router
