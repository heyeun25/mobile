
import Vue from 'vue'
import Router from 'vue-router'
import DisplayShelf from '../pages/DisplayShelf.vue';
import Equalizer from '../pages/Equalizer.vue';
import Tapestry from '../pages/Tapestry.vue';
import Equalizer2 from '../pages/Equalizer2.vue';

Vue.use(Router)
export default new Router({
  routes: [
    {path: '/displayShelf', name: 'displayShelf', component: DisplayShelf},
    {path: '/equalizer/0', name: 'equalizer0', component: Equalizer, props: { eqIdx: 0 }},
    {path: '/equalizer/1', name: 'equalizer1', component: Equalizer, props: { eqIdx: 1 }},
    {path: '/equalizer2', name: 'equalizer2', component: Equalizer2},
    {path: '/tapestry', name: 'tapestry', component: Tapestry}
  ]});