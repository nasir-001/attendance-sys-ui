
const routes = [
  {
    path: '/admin',
    name: 'dashborad',
    component: () => import('src/layouts/admin/MainLayout.vue'),
    redirect: { name: 'admin-visitors-list' },
    children: [
      {
        path: 'visitors',
        name: 'admin-visitors-list',
        component: () => import('pages/views/admin/VisitorsList'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'new-visitor',
        name: 'admin-new-visitor',
        component: () => import('pages/views/admin/NewVisitor'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      }, 
      {
        path: 'search-visitors',
        name: 'admin-search-visitors',
        component: () => import('pages/views/admin/SearchVisitors'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'visitors/:id',
        name: 'admin-visitor-details',
        props: true,
        component: () => import('pages/views/admin/VisitorDetails'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
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
        component: () => import('pages/views/security/VisitorsList'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'visitors/:id',
        name: 'visitor-details',
        props: true,
        component: () => import('pages/views/security/VisitorDetails'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
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
    path: '/admin/users',
    component: () => import('layouts/admin/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'user-list',
        component: () => import('pages/users/UserList.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'new-user',
        name: 'new-user',
        component: () => import('pages/users/NewUser.vue'),
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true
        }
      },
      {
        path: 'users/:uuid',
        name: 'user-detail',
        component: () => import('pages/users/UserDetail.vue'),
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
