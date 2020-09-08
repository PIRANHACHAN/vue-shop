import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue'),
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome.vue'),
      },
      {
        path: '/users',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/user/Users.vue'),
        name: '用户列表',
        meta: { parentName: '用户管理' },
      },
      {
        path: '/rights',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Rights.vue'),
        name: '权限列表',
        meta: { parentName: '权限管理' },
      },
      {
        path: '/roles',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '@/components/power/Roles.vue'),
        name: '角色列表',
        meta: { parentName: '权限管理' },
      },
      {
        path: '/categories',
        component: () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Cate.vue'),
        name: '商品分类',
        meta: { parentName: '商品管理' },
      },
      {
        path: '/params',
        component: () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Params.vue'),
        name: '分类参数',
        meta: { parentName: '商品管理' },
      },
      {
        path: '/goods',
        component: () => import(/* webpackChunkName: "list_addlist" */ '@/components/goods/List.vue'),
        name: '商品列表',
        meta: { parentName: '商品管理' },
      },
      {
        path: '/goods/add',
        component: () => import(/* webpackChunkName: "list_addlist" */ '@/components/goods/Add.vue'),
        name: '添加商品',
        meta: { parentName: '商品管理' },
      },
      {
        path: '/orders',
        component: () => import(/* webpackChunkName: "order" */ '@/components/order/Order.vue'),
        name: '订单列表',
        meta: { parentName: '订单管理' },
      },
      {
        path: '/reports',
        component: () => import(/* webpackChunkName: "report" */ '@/components/report/Report.vue'),
        name: '数据报表',
        meta: { parentName: '数据统计' },
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
