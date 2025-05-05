import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/auth/LoginView.vue'
import RegisterView from '@/views/auth/auth/RegisterView.vue'
import ProfileView from '@/views/auth/auth/ProfileView.vue'
import HomeView from '@/views/auth/auth/HomeView.vue'
import NotFound from '@/views/auth/auth/NotFound.vue'
import { supabase } from '@/utils/supabase.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*', // 👈 Catch-all for unknown routes
      name: 'NotFound',
      component: NotFound,
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to home if logged in and trying to access login or register
  if ((to.name === 'login' || to.name === 'register') && user) {
    next('/home')
  }
  // Redirect to login if trying to access protected page
  else if (to.meta.requiresAuth && !user) {
    next('/')
  }
  else {
    next()
  }
})

export default router
