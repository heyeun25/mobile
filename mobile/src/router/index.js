
import Vue from 'vue'
import Router from 'vue-router'
import SmartThings from '../components/SmartThings';
import Setting from '../components/Setting';
import SelectPhoto from '../components/SelectPhoto';
import SelectPhoto2 from '../components/SelectPhoto2';

Vue.use(Router)
export default new Router({
  routes: [
    {path: '/', name: 'smartthings', component: SmartThings},
    {path: '/setting', name: 'setting', component: Setting},
    {path: '/selectPhoto', name: 'selectPhoto', component: SelectPhoto},
    {path: '/selectPhoto2', name: 'selectPhoto2', component: SelectPhoto2}
]});