
const routes = [
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'visitors-list' },
    children: [
      {
        path: 'visitors',
        name: 'visitors-list',
        component: () => import('components/VisitorsList'),
      },
      {
        path: 'new-visitor',
        name: 'new-visitor',
        component: () => import('components/VisitorsList'),
      }
    ]
  },
  {
    path: '/',
    name: 'login',
    component: () => import('pages/account/Login'),
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
