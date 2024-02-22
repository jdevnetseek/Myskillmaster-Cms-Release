import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from './plugins/firebase'
import './assets/scss/main.scss'
import './registerServiceWorker'
import './services/api'
import './services/env'
import './models'

Vue.config.productionTip = false
store.dispatch('auth/init')

new Vue({
  router,
  store,
  vuetify,
  firebase,
  render: (h) => h(App),
}).$mount('#app')
