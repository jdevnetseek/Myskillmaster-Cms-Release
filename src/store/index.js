import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
// import notification from './modules/notification'
import report from './modules/report'
import category from './modules/category'
import versionControl from './modules/version-control'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    user,
    /* notification, */
    report,
    category,
    versionControl,
  },
  state: {
    controls: {
      showDrawer: true,
    },
  },
  mutations: {
    toggleDrawer(state, value) {
      state.controls.showDrawer = value
    },
  },
})
