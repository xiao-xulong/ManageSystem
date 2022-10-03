import { createApp } from 'vue'
// import "lib-flexible-computer"
import App from './App.vue'
import router from './router/index'
import store from './store/index.js'
import animate from "animate.css";
// import 'element-plus/theme-chalk/el-message.css'
// import 'element-plus/theme-chalk/el-message-box.css'
// import 'element-plus/theme-chalk/el-loading.css'
// import 'element-plus/theme-chalk/el-notification.css'

import lazyPlugin from 'vue3-lazy'
import { Loading } from '../src/util/loading'
const app = createApp(App)
import dayjs from 'dayjs'

app.config.globalProperties.$dayjs = dayjs as any

app.config.globalProperties.$Loading = Loading
app.use(router).use(store).use(animate as any).use(lazyPlugin, {
    loading: './assets/imgLoading.png',// 图片加载时默认图片
    error: './assets/imgLoading.png'    // 图片加载失败时默认图片
}).mount('#app')
