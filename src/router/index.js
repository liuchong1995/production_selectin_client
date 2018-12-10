import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index'),
        meta: { noCache: true }
      }
    ]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/selection/print/:orderId(\\d+)',
    component: () => import('@/views/productSelection/orderDetailPrint'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    name: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'Dashboard',
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/selection',
    component: Layout,
    redirect: '/selection/list',
    name: 'selection',
    alwaysShow: true,
    meta: { title: '产品选型', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/productSelection/list'),
        meta: { title: '选型列表', icon: 'form' }
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/views/productSelection/history'),
        meta: { title: '历史选型', icon: 'list' }
      },
      {
        path: 'selecting/:productId(\\d+)',
        name: 'selecting',
        hidden: true,
        component: () => import('@/views/productSelection/selecting'),
        meta: { title: '选型' }
      },
      {
        path: 'edit/:orderId(\\d+)',
        name: 'editOrder',
        hidden: true,
        component: () => import('@/views/productSelection/edit'),
        meta: { title: '修改选型'}
      },
      {
        path: 'fork/:orderId(\\d+)',
        name: 'fork',
        hidden: true,
        component: () => import('@/views/productSelection/fork'),
        meta: { title: '克隆选型' }
      },
      {
        path: 'detail/:orderId(\\d+)',
        name: 'orderDetail',
        hidden: true,
        component: () => import('@/views/productSelection/orderDetail'),
        meta: { title: '选型详情' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
