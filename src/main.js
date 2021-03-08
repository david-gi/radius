import Vue from 'vue'
import App from './App.vue'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import './assets/app.scss'

Vue.config.productionTip = false
Vue.use(IconsPlugin)
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App)
}).$mount('#app')
