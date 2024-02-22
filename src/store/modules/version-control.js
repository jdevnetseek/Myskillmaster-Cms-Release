import Api from '@/services/api'
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import filter from 'lodash/filter'

export default {
  namespaced: true,
  state: {
    list: [],
  },

  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    upsert(state, payload) {
      const i = findIndex(state.list, { id: payload.id })
      if (i === -1) {
        state.list.unshift(payload)
      } else {
        state.list.splice(i, 1, payload)
      }
    },
    remove(state, payload) {
      const i = findIndex(state.list, { id: payload.id })
      i > -1 && state.list.splice(i, 1)
    },
  },

  getters: {
    iosList(state) {
      return filter(state.list, (item) => item.platform === 'ios')
    },
    androidList(state) {
      return filter(state.list, (item) => item.platform === 'android')
    },
  },

  actions: {
    async addVersionControl(context, payload) {
      const response = await Api.post('admin/app/version-control', payload)
      context.commit('upsert', get(response, 'data.data'))
    },
    async updateVersionControl(context, payload) {
      const response = await Api.put(
        `admin/app/version-control/${payload.id}`,
        payload
      )
      context.commit('upsert', get(response, 'data.data'))
    },
    async getList(context, payload) {
      const response = await Api.get('admin/app/version-control')
      context.commit('setList', get(response, 'data.data', []))
    },
    async removeVersionControl(context, payload) {
      await Api.delete(`admin/app/version-control/${payload.id}`)
      context.commit('remove', payload)
    },
  },
}
