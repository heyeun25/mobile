import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/index'
import io from 'socket.io-client'

var socket = io(location.protocol + '//' + location.hostname + ':8080')

Vue.prototype.$socket = socket;
Vue.config.productionTip = false
Vue.use(VueRouter);

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
