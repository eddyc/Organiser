import Vue from 'vue'

import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
// var VueMaterial = require('vue-material');

// Vue.use(VueMaterial);

Vue.use(Vuetify);
// Vue.use(Sortable);


let vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
