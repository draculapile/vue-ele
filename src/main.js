import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.use(VueResource)

Vue.use(VueLazyload, {
  loading: require('common/image/default.jpg')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
