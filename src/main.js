import Vue from 'vue'
import App from './App.vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import './assets/app.scss'
import store from './store'
import helpers from './plugins/helpers'

Vue.config.productionTip = false
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)
Vue.use(helpers)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
