import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import io from 'socket.io-client'

var socket = io('http://localhost:8080')

Vue.prototype.$socket = socket;
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
