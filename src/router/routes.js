
const routes = [
  {
    path: '/dashboard',
    name: 'dashborad',
    component: () => import('src/layouts/admin/MainLayout.vue'),
    redirect: { name: 'visitors-list' },
    children: [
      {
        path: 'visitors',
        name: 'admin-visitors-list',
        component: () => import('pages/views/VisitorsList'),
      },
      {
        path: 'new-visitor',
        name: 'admin-new-visitor',
        component: () => import('pages/views/NewVisitor'),
      }, 
      {
        path: 'search-visitors',
        name: 'admin-search-visitors',
        component: () => import('pages/views/SearchVisitors'),
      },
      {
        path: 'visitors/:id',
        name: 'admin-visitor-details',
        props: true,
        component: () => import('pages/views/VisitorDetails'),
      }
    ]
  },
  {
    path: '/visitor-manager',
    component: () => import('src/layouts/staff/StaffLayout.vue'),
    redirect: { name: 'visitors-list' },
    children: [
      {
        path: 'visitors',
        name: 'visitors-list',
        component: () => import('pages/views/VisitorsList'),
      },
      {
        path: 'visitors/:id',
        name: 'visitor-details',
        props: true,
        component: () => import('pages/views/VisitorDetails'),
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
