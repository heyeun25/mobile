
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
    {path: '/equalizer', name: 'equalizer', component: Equalizer},
    {path: '/equalizer2', name: 'equalizer', component: Equalizer2},
    {path: '/tapestry', name: 'tapestry', component: Tapestry}
  ]});