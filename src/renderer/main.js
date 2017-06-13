import Vue from 'vue'

import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
var VueMaterial = require('vue-material');

Vue.use(VueMaterial);

// Vue.use(Sortable);



Vue.material.registerTheme('default', { primary: 'indigo', accent: { color: 'indigo', hue: 700 }, warn: 'red', });

/* eslint-disable no-new */
let vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')


Vue.material.setCurrentTheme('default')
