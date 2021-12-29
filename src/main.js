import App from './App'
// import Vue from 'vue'
// import Router from 'vue-router'
import router from './router'
// import ELEMENT from 'element-ui'
import store from './store'
import lodash from 'lodash'
// import '@/assets/theme/index.css'
import '@/assets/icon/iconfont.css'
import {formatTime} from "./utils/time";


// Vue.prototype.$echarts = echarts;


Vue.config.productionTip = false
// Vue.use(ElementUI)

Object.defineProperty(Vue.prototype, '$_', { value: lodash })

Vue.directive('title',  function (el, binding) {
  document.title = el.dataset.title
})
//格式话时间
Vue.filter('format', formatTime)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
