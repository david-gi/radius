import Vue from 'vue'
import App from './App.vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import './assets/app.scss'
import store from './store'
import helpers from './mixins/helpers.js'

Vue.config.productionTip = false

Vue.mixin(helpers)
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
