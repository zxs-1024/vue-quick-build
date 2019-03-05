import 'normalize.css'

import App from './App.vue'
import router from './router'

import './axios/index'
import './util/encrypt'
import './style/element-variables.scss'

const { Vue, ELEMENT } = window

Vue.use(ELEMENT)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
