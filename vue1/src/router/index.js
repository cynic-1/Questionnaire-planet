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
    // {
    //     path: '/personalCenter/:username',
    //     name: 'personalCenter',
    //     component: () => import('../views/PersonalCenter1.vue'),
    //     meta: { title: '个人中心', params: 'username'}
    // },
    // {
    //     path: '/search/:type/:words',
    //     name: 'search',
    //     component: () => import('../views/Home.vue'),
    //     meta: { title: '搜索', params: {type: 'type', words: 'words'}}
    // },
    // {
    //     path: '/article/:id',
    //     name: 'article',
    //     component: () => import('../views/Articles.vue'),
    //     meta: { title: '文章', params: 'id'}
    // },
    // {
    //     path: '/discuss/:id',
    //     name: 'discuss',
    //     component: () => import('../views/Discuss.vue'),
    //     meta: { title: '讨论', params: 'id'}
    // },
    // {
    //     path: '/books/tag/:tag',
    //     name: 'tag',
    //     component: () => import('../views/book-sort'),
    //     meta: { title: '书籍分类', params: 'tag'}
    // },
    // {
    //     path:'/questionnairelist',
    //     name: 'questionnairelist',
    //     component: () => import('../views/questionnaire/questionnairelist.vue'),
    //     meta: { title: 'fuck'}
    // },
    // {
    //     path: '/personal_home',
    //     name: 'personal_home',
    //     component: () => import('@/components/questionnaire/leftBlockAtHome'),
    //     children:[
    //         {path:'/questionnairelist',component:() => import('@/components/questionnaire/questionnairelist')},
    //         {path:'/recyclebin',component: () => import('@/components/questionnaire/RecycleBin')},
    //     ]
    //   },
    {
        path: '/recycleBin',
        name: 'recycleBin',
        component: () => import('@/views/Recycle'),
        meta: {title: '回收站'}
    },
      {
        path:'/createtest',
        name:'createtest',
        component: () => import('@/views/CreateTestPage'),
        meta: { title: '创建问卷' }
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
      }
]

const router = new VueRouter({
    //mode: 'history',
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
    if(to.path === '/login' || to.path === '/' || to.path === '/book-ground')
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
