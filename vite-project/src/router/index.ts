import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/lootbox'
    }, {
      path: '/lootbox',
      name: 'lootbox',
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
      path: '/trade-search',
      name: 'trade-search',
      component: () => import('../views/TradeSearch.vue')
    }
  ]
})

export default router
