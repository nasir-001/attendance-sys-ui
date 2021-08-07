
const routes = [
  {
    path: '/admin',
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
    path: '/security',
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
    path: '/admin/acl',
    component: () => import('layouts/admin/MainLayout.vue'),
    children: [
      {
        path: 'user-permissions',
        name: 'permission-list',
        component: () => import('pages/access_control/Permissions.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'user-roles',
        name: 'role-list',
        component: () => import('pages/access_control/Roles.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'user-roles/:roleName',
        name: 'role-detail',
        component: () => import('pages/access_control/RoleDetail.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'user-groups',
        name: 'group-list',
        component: () => import('pages/access_control/UserGroupList.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'user-groups/:groupName',
        name: 'group-detail',
        component: () => import('pages/access_control/UserGroupDetail.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      }
    ]
  },
  {
    path: '/',
    name: 'login',
    component: () => import('pages/auth/Login'),
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
