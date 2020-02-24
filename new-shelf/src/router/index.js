
import Vue from 'vue'
import Router from 'vue-router'
import Tree from '../components/Tree.vue'
import Photo from '../components/Photo.vue'
import Video from '../components/Video.vue'
import CircleTree from '../components/CircleTree.vue'

Vue.use(Router)
export default new Router({
  routes: [
    { path: '/tree', name: 'tree', component:  Tree},
    { path: '/circle', name: 'circle', component:  CircleTree},
    { path: '/image', name: 'image', component: Photo, props: true},
    { path: '/video', name: 'video', component: Video, props: true}
  ]});