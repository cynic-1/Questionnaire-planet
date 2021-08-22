import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import CreateTest from '../components/questionnaire/createtest.vue'
import Fill from '../components/questionnaire/fill.vue'
import personal_home from '../components/questionnaire/leftBlockAtHome.vue'
import Questionnairelist from '../components/questionnaire/questionnairelist.vue'
import RecycleBin from '../components/questionnaire/RecycleBin.vue'


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
    //     path: '/personal_home',
    //     name: 'personal_home',
    //     component: personal_home,
    //     children:[
    //         {path:'/questionnairelist',component:Questionnairelist},
    //         {path:'/recyclebin',component:RecycleBin},
    //     ]
    //   },
      {
        path:'/createtest',
        name:'createtest',
        component: CreateTest
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
