
import Vue from 'vue'
import Router from 'vue-router'
import DisplayShelf from '../pages/DisplayShelf.vue';
import Equalizer from '../pages/Equalizer.vue';
import Tapestry from '../pages/Tapestry.vue';
// import Tree from '../components/Tree.vue'
// import Photo from '../pages/Photo.vue'
// import CircleTree from '../components/CircleTree.vue'
// import Pleats from '../components/Pleats.vue'
// import Greenery from '../pages/Greenery.vue'
// import Health from '../pages/Health.vue'
// import Character from '../components/Character.vue'
// import Account from '../pages/Account.vue'
// import Family from '../pages/Family.vue'
// import Luxury from '../pages/Luxury.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {path: '/displayShelf', name: 'displayShelf', component: DisplayShelf},
    {path: '/equalizer/0', name: 'equalizer0', component: Equalizer, props: { eqIdx: 0 }},
    {path: '/equalizer/1', name: 'equalizer1', component: Equalizer, props: { eqIdx: 1 }},
    {path: '/tapestry', name: 'tapestry', component: Tapestry}
    // { path: '/tree', name: 'tree', component:  Tree},
    // { path: '/circle', name: 'circle', component:  CircleTree},
    // { path: '/image', name: 'image', component: Photo, props: true},
    // { path: '/pleats', name: 'pleats', component: Pleats},
    // { path: '/greenery', name: 'greenery', component: Greenery},
    // { path: '/health', name: 'health', component: Health},
    // { path: '/character', name: 'character', component: Character},
    // { path: '/account', name: 'account', component: Account, props: true},
    // { path: '/family', name: 'family', component: Family},
    // { path: '/luxury', name: 'luxury', component: Luxury}
  ]});