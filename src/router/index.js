import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user.js'

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
    {
      path: '/mine',
      name: 'mine',
      component: () => import('../views/MineView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.name === 'login') {
   next();
  } else {
    const userStore = useUserStore()
    await userStore.updateUserInfo()
    next()
  }

})
export default router
