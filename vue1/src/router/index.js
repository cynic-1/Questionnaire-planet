import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import CreateTest from '../components/questionnaire/createtest.vue'
import Fill from '../components/questionnaire/fill.vue'
import personal_home from '../components/questionnaire/leftBlockAtHome.vue'
import Questionnairelist from '../components/questionnaire/questionnairelist.vue'
import RecycleBin from '../components/questionnaire/RecycleBin.vue'
import Report from '../components/questionnaire/report.vue'

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
      path: '/notLogin',
      name: 'notLogin',
      component: () => import('../views/NotLogin.vue'),
      meta: {title: '请先点击右上角登录'}
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
    //     path: '/writeBlog',
    //     name: 'writeBlog',
    //     component: () => import('../views/Write1.vue'),
    //     meta: { title: '创作笔记'}
    // },
    // {
    //     path: '/newBook',
    //     name: 'newBook',
    //     component: () => import('../views/newBook.vue'),
    //     meta: { title: '发布新书'}
    // },
    // {
    //     path:'/books/:id',
    //     name: 'books',
    //     component: () => import('./../views/Book'),
    //     meta: { title: '书籍详情页' }
    // },
    // {
    //     path:'/book-ground',
    //     name:'book-ground',
    //     component: () => import ("../views/BookGround"),
    //     meta:{title: "藏书阁"}
    // },
    // {
    //     path:'/log',
    //     name:'log',
    //     component: () => import ('./../views/Log'),
    //     meta: {title: "读书笔记"}
    // },
    // {
    //     path: '/discussion',
    //     name: 'userContent',
    //     component: () => import ('./../views/UserContent'),
    //     meta: {title: "争鸣殿——在这里讨论吧！"}
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
    {
        path: '/personal_home',
        name: 'personal_home',
        component: personal_home,
        children:[
            {path:'/questionnairelist',component:Questionnairelist},
            {path:'/recyclebin',component:RecycleBin},
        ]
      },
      {
        path:'/createtest',
        name:'createtest',
        component: CreateTest
      },
      {
        path:'/report',
        name:'report',
        component: Report
      },
      {
        path:'/fill',
        name: 'fill',
        component: Fill
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
    if(to.path === '/login' || to.path === '/' || to.path === '/book-ground' || to.path === '/home')
        // alert(token),
        next();
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
