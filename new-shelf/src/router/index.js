
import Vue from 'vue'
import Router from 'vue-router'
import DisplayShelf from '../views/DisplayShelf.vue';
import Equalizer from '../views/Equalizer.vue';
import Equalizer2 from '../views/Equalizer2.vue';
import EqualizerWall from '../views/EqualizerWall.vue';
import Skin from '../views/Skin.vue';
import PositionFinder from "../views/PositionFinder";
import Concept from '../views/Concept';

Vue.use(Router)
export default new Router({
  routes: [
    {path: '/', name: 'concept', component: Concept},
    {path: '/displayShelf', name: 'displayShelf', component: DisplayShelf},
    {path: '/equalizer/0', name: 'equalizer0', component: Equalizer, props: { eqIdx: 0 }},
    {path: '/equalizer/1', name: 'equalizer1', component: Equalizer, props: { eqIdx: 1 }},
    {path: '/equalizer2', name: 'equalizer2', component: Equalizer2},
    {path: '/equalizerWall', name: 'equalizerWall', component: EqualizerWall},
    {path: '/skin', name: 'skin', component: Skin},
    {path: '/posfinder', name: 'posfinder', component: PositionFinder}
  ]});