
const routes = [
  {
    path: '/dashboard',
    name: 'dashborad',
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
        component: () => import('components/NewVisitor'),
      },
      {
        path: 'search-visitors',
        name: 'search-visitors',
        component: () => import('components/SearchVisitors'),
      },
      {
        path: 'visitors/:id',
        name: 'visitor-details',
        props: true,
        component: () => import('components/VisitorDetails'),
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
