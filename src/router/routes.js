
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
        component: () => import('pages/VisitorsList'),
      },
      {
        path: 'new-visitor',
        name: 'new-visitor',
        component: () => import('pages/NewVisitor'),
      },
      {
        path: 'search-visitors',
        name: 'search-visitors',
        component: () => import('pages/SearchVisitors'),
      },
      {
        path: 'visitors/:id',
        name: 'visitor-details',
        props: true,
        component: () => import('pages/VisitorDetails'),
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
