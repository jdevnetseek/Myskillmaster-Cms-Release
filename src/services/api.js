import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import env from './env'
import store from '@/store'

const api = axios.create({
  baseURL: env.apiUrl,
})

api.interceptors.request.use(
  function (config) {
    const accessToken = store.state.auth.token.access_token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$api = api
Vuex.Store.prototype.$api = api

export default api
