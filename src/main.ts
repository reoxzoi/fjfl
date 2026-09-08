import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import './framework/theme.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: App }],
})

createApp(App).use(router).mount('#app')
