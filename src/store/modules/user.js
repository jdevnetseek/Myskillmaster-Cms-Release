import User from '@/models/User'
import Avatar from '@/models/Avatar'
import Api from '@/services/api'
import { each, find } from 'lodash'

export default {
  namespaced: true,
  state: {
    list: [],
    listMeta: {
      current_page: 0,
      last_page: 1,
    },
    userDetails: null,
  },

  mutations: {
    setUserList(state, users) {
      each(users, (user) => {
        const exist = find(state.list, { id: user.id })
        if (!exist) {
          state.list.push(new User(user))
        }
      })
    },

    clearUserList(state) {
      state.list = []
    },

    setUserListMeta(state, meta) {
      state.listMeta = meta
    },

    setUserDetails(state, user) {
      if (user instanceof User) {
        state.userDetails = user
      } else {
        state.userDetails = new User(user)
      }
    },

    setSelectedUserAvatar(state, avatar) {
      if (avatar instanceof Avatar) {
        state.userDetails.avatar = avatar
      } else {
        state.userDetails.avatar = new Avatar(avatar)
      }
    },

    clearUserDetails(state) {
      state.userDetails = null
    },

    userAvatarRemoved(state) {
      state.userDetails.avatar = null
    },
  },

  actions: {
    async getUsers({ commit }, params) {
      const query = User.page(params.page || 1)
        .include('avatar')
        .orderBy(params.sort)
        .where('with_blocked', 1)

      if (params.search) {
        query.where('search', params.search)
      }

      const res = await query.params({ limit: 20 }).get()

      commit('setUserList', res.data)
      commit('setUserListMeta', res.meta)
    },

    async getUserDetails({ commit }, id) {
      const { data } = await Api.get(`users/${id}`)
      commit('setUserDetails', data.data)
    },

    async changeAvatar({ commit }, formData) {
      const { data } = await Api.post(
        `users/${formData.get('user_id')}/avatar`,
        formData
      )
      commit('setSelectedUserAvatar', data.data)
    },

    async updateUser({ commit }, formData) {
      const { data } = await Api.put(`users/${formData.id}`, formData)
      commit('setUserDetails', data.data)
    },

    async blockUser({ commit }, { id, action }) {
      const { data } = await Api.post(`admin/users/${id}/${action}`)
      commit('setUserDetails', data.data)
    },

    async exportToExcel() {
      const file = await Api.get('/users/export', { responseType: 'blob' })
      return file
    },
  },
}
