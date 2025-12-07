import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const Products = () => import('../views/Products.vue')
const Checkout = () => import('../views/Checkout.vue')
const Login = () => import('../views/Login.vue')
const Profile = () => import('../views/Profile.vue')
const Orders = () => import('../views/Orders.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    props: true
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard pour protéger les routes
router.beforeEach((to, from, next) => {
  const currentUser = JSON.parse(localStorage.getItem('techshop_current_user') || 'null')
  
  if (to.meta.requiresAuth && !currentUser) {
    // Rediriger vers login si la route nécessite une authentification
    next('/login')
  } else if (to.path === '/login' && currentUser) {
    // Rediriger vers accueil si déjà connecté et essaie d'accéder à login
    next('/')
  } else {
    next()
  }
})

export default router