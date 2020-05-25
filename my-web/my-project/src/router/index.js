import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Question from '../pages/Question'
import Users from '../pages/Users'
import Camera from '../pages/Camera'
import History from '../pages/History'
import HelloWorld from '../components/HelloWorld.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/HelloWorld',
      children: [
        {
          path: '/HelloWorld',
          component:HelloWorld
        },
        {
          path: '/pages/Question',
          component:Question
        },
        {
          path: '/pages/Users',
          component:Users
        },
        {
          path: '/pages/Camera',
          component:Camera
        },
        {
          path: '/pages/History',
          component:History
        },
      ]
    },
    
  ],
})
/*
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //next()放行 next('/login') 强制跳转
  if(to.path === '/login') return next ()
  //获取token
  const tokerStr = window.sessionStorage.getItem('token');
  if(!tokerStr) return next ('/login')
})*/
export default router