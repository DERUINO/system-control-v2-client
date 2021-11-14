import Vue from 'vue'
import VueRouter from 'vue-router'
import Table from '../components/Table.vue'
import Settings from '../components/Settings.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Table',
    component: Table
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
