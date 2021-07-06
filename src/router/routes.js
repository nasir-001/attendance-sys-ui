
const routes = [
  {
    path: '/',
    component: () => import('pages/account/Login'),
  },
  {
    path: '/visitors',
    name: 'visitors',
    component: () => import('components/VisitorsList'),
  },
  {
    path: '/new-visitor',
    name: 'new-visitor',
    component: () => import('components/NewVisitor'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('layouts/MainLayout.vue'),
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
