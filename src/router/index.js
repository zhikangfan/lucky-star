import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getProfile } from '@/api/user.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   getProfile().then(() => {
//     next()
//   }).catch(() => {
//     next({ name: 'login' })
//   })
// })
export default router
