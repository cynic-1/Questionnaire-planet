import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import './assets/css/style.less'
import './assets/font/iconfont.css'
require('./Mock')
import {parseTime} from './utils'
import axios from 'axios'
import 'github-markdown-css/github-markdown.css'
import qs from "qs"

import hljs from 'highlight.js'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueCropper from 'vue-cropper'
// use
const app = createApp(App)

app.mount('#app')
app.use(mavonEditor)
app.prototype.$qs = qs
app.use(VueCropper)
app.use(ElementPlus)
app.use(store)

app.config.productionTip = false
app.prototype.$axios= axios
// app.prototype.$store= $store
app.config.productionTip = false
// Vue.forceUpdate()
app.filter('parseTime', (v) => parseTime(v,'{y}-{m}-{d}'))

app.directive('highlight', function (el) {
    const blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
        hljs.highlightBlock(block)
    })
})

// new Vue({
//     router,
//     store,
//     render: h => h(App),
// }).$mount('#app')




