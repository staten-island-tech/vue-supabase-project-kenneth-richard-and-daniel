import { clientStore } from '@/stores/client'
import { sessionStore } from '@/stores/session';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/lootbox',
      name: 'lootbox',
      component: () => import ('../views/HomeView.vue')
    }, {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/InventoryView.vue')
    }, {
      path: '/trade-search',
      name: 'trade-search',
      component: () => import('../views/TradeSearch.vue')
    }, {
      path: '/login',
      name: 'login',
      component: () => import('../components/LoginAuth.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!["/", "/login"].includes(to.fullPath) && sessionStore().session.access_token == "") {
    clientStore().intendedRoute = to.fullPath;
    next("/login");
  } else {
    next();
  }
})

export default router
