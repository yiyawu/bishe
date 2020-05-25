// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import tablelist from './components/Tablelist'
axios.defaults.baseURL = 'http://localhost:1231/'
Vue.config.productionTip = false
Vue.use(ElementUi)
Vue.component('tablelist',tablelist)
Vue.prototype.$http = axios
//Vue.prototype.$message = Message
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
