
import Vue from 'vue'
import Router from 'vue-router'
import Tree from '../components/Tree.vue'
import Photo from '../pages/Photo.vue'
import Video from '../pages/Video.vue'
import CircleTree from '../components/CircleTree.vue'
import Pleats from '../components/Pleats.vue'
import Greenery from '../pages/Greenery.vue'
import Health from '../pages/Health.vue';
import Character from '../components/Character.vue'
import Account from '../components/Account.vue'

Vue.use(Router)
export default new Router({
  routes: [
    { path: '/tree', name: 'tree', component:  Tree},
    { path: '/circle', name: 'circle', component:  CircleTree},
    { path: '/image', name: 'image', component: Photo, props: true},
    { path: '/video', name: 'video', component: Video, props: true},
    { path: '/pleats', name: 'pleats', component: Pleats},
    { path: '/greenery', name: 'greenery', component: Greenery},
    { path: '/health', name: 'health', component: Health},
    { path: '/character', name: 'character', component: Character},
    { path: '/account', name: 'account', component: Account, props: true}
  ]});