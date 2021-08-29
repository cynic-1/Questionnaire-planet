import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import 'element-ui/lib/theme-chalk/index.css'


Vue.use(VueRouter)


new Vue({
    'el': '#main'
})

const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: {
            title: '首页',
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/loginRegister.vue'),
        meta: { title: '注册登录'}
    },
    {
        path: '/recycleBin',
        name: 'recycleBin',
        component: () => import('@/views/Recycle'),
        meta: {title: '回收站'}
    },
      // {
      //   path:'/createtest',
      //   name:'createtest',
      //   component: () => import('@/views/CreateTestPage'),
      //   meta: { title: '创建问卷' }
      // },
    {
        path:'/createtest',
        name:'createtest',
        component: () => import('@/views/CreateTestPage1'),
        meta: { title: '创建普通问卷' }
    },
      {
        path:'/report',
        name:'report',
        component: () => import('@/components/questionnaire/report.vue'),
        meta: { title: '生成报告' }
      },
      {
        path:'/fill',
        name: 'fill',
        component: () => import('@/views/FillTest'),
        meta: { title: '填写问卷' }
      },
      {
        path:'/preview',
        name: 'preview',
        component: () => import('@/views/PreviewPage'),
        meta: { title: '预览问卷' }
      },
	  {
	      path:'/createtest2',
	      name:'createtest2',
	      component: () => import('@/views/CreateTestPage2'),
	      meta: { title: '创建投票问卷' }
	  },
	  {
	      path:'/createtest3',
	      name:'createtest3',
	      component: () => import('@/views/CreateTestPage3'),
	      meta: { title: '创建报名问卷' }
	  },
      {
        path:'/createtest4',
        name:'createtest4',
        component: () => import('@/views/CreateTestPage4'),
        meta: { title: '创建疫情打卡问卷' }
    },
	{
	    path:'/createtest5',
	    name:'createtest5',
	    component: () => import('@/views/CreateTestPage5'),
	    meta: { title: '创建考试问卷' }
	},
	  {
	    path:'/fill2',
	    name: 'fill2',
	    component: () => import('@/views/FillTest2'),
	    meta: { title: '填写投票问卷' }
	  },
	  {
	    path:'/fill3',
	    name: 'fill3',
	    component: () => import('@/views/FillTest3'),
	    meta: { title: '填写报名问卷' }
	  },
	  {
	    path:'/fill5',
	    name: 'fill5',
	    component: () => import('@/views/FillTest5'),
	    meta: { title: '填写考试问卷' }
	  },
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})
router.beforeResolve(async (to, from, next) => {
    let title = '天问：一站式问卷收集管理平台'
    if (to.meta.params){
        title = `${to.meta.title}: ${to.params[to.meta.params] || ''} - ${title}`
    }else {
        title = `${to.meta.title} - ${title}`
    }
    document.title = title
    let token = sessionStorage.getItem('Authorization')
    if(to.path === '/login' || to.path === '/')
        // alert(token),
        next();
	if(to.path === '/fill' && window.sessionStorage.getItem('username') == null && window.sessionStorage.getItem('ip') == null){
		window.sessionStorage.setItem('testid', JSON.stringify(to.query.testid))
		next('/login')
	}
    else{
        if(token === null || token === '')
            next('/login')
        else
            // alert(token)
            next();
    }

    if (to.path !== from.path) {
        store.dispatch('setLoading', true);
    }
    next();
})
router.afterEach((to, from) => {
    // 最多延迟 关闭 loading
    setTimeout(() => {
        store.dispatch('setLoading', false);
    }, 1500)
})
export default router
