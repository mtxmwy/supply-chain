import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '工作台', icon: 'House' }
      },
      {
        path: '/supply-chain',
        name: 'SupplyChain',
        meta: { title: '供应链', icon: 'Box' },
        children: [
          {
            path: '/supply-chain/purchase',
            name: 'Purchase',
            component: () => import('@/views/supply-chain/Purchase.vue'),
            meta: { title: '采购管理', icon: 'ShoppingCart' }
          },
          {
            path: '/supply-chain/inventory',
            name: 'Inventory',
            component: () => import('@/views/supply-chain/Inventory.vue'),
            meta: { title: '库存管理', icon: 'Box' }
          },
          {
            path: '/supply-chain/sales',
            name: 'Sales',
            component: () => import('@/views/supply-chain/Sales.vue'),
            meta: { title: '销售管理', icon: 'TrendCharts' }
          }
        ]
      },
      {
        path: '/finance',
        name: 'Finance',
        meta: { title: '财务管理', icon: 'Money' },
        children: [
          {
            path: '/finance/accounts',
            name: 'Accounts',
            component: () => import('@/views/finance/Accounts.vue'),
            meta: { title: '总账管理', icon: 'Notebook' }
          },
          {
            path: '/finance/receivable',
            name: 'Receivable',
            component: () => import('@/views/finance/Receivable.vue'),
            meta: { title: '应收管理', icon: 'CreditCard' }
          },
          {
            path: '/finance/payable',
            name: 'Payable',
            component: () => import('@/views/finance/Payable.vue'),
            meta: { title: '应付管理', icon: 'Wallet' }
          }
        ]
      },
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          {
            path: '/system/users',
            name: 'Users',
            component: () => import('@/views/system/Users.vue'),
            meta: { title: '用户管理', icon: 'User' }
          },
          {
            path: '/system/roles',
            name: 'Roles',
            component: () => import('@/views/system/Roles.vue'),
            meta: { title: '角色管理', icon: 'UserFilled' }
          },
          {
            path: '/system/permissions',
            name: 'Permissions',
            component: () => import('@/views/system/Permissions.vue'),
            meta: { title: '权限管理', icon: 'Lock' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 金蝶星空云`
  }
  
  // 简单的登录验证逻辑
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router