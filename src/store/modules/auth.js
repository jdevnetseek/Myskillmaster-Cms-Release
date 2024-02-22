import Cookies from 'js-cookie'
import router from '@/routes'
import User from '@/models/User'

export default {
  namespaced: true,
  state: {
    user: {},
    isAuthenticated: false,
    token: {
      accessToken: null,
      expiresIn: null,
      tokenType: 'Bearer',
      uuid: null,
    },
    timestamp: new Date().getTime(),
  },

  getters: {
    avatarThumb(state) {
      return state.user.avatar_thumb_url + '?timestamp=' + state.timestamp
    },
  },

  mutations: {
    setUser(state, user) {
      if (user instanceof User) {
        state.user = user
      } else {
        state.user = new User(user)
      }
    },

    setToken(state, token) {
      if (token) {
        Cookies.set('AUTH_TOKEN', token)
        state.token = token
        state.isAuthenticated = true
      }
    },

    clearToken(state) {
      Cookies.remove('AUTH_TOKEN')
      state.token = {
        accessToken: null,
        expiresIn: null,
        tokenType: 'Bearer',
        uuid: null,
      }
      state.isAuthenticated = false
    },

    changeTimestamp(state) {
      state.timestamp = new Date().getTime()
    },
  },

  actions: {
    init({ commit }) {
      const token = Cookies.getJSON('AUTH_TOKEN')
      commit('setToken', token)
    },

    getAuthenticatedUser({ commit }) {
      this.$api
        .get('/auth/me')
        .then((res) => {
          commit('setUser', res.data.data)
        })
        .catch((err) => {
          if (err.response.status === 401) {
            commit('clearToken')
            router.replace({ name: 'auth.login' })
          }
        })
    },

    logout({ commit }) {
      this.$api.post('/auth/logout').then(() => {
        commit('clearToken')
        router.replace({ name: 'auth.login' })
      })
    },
  },
}
