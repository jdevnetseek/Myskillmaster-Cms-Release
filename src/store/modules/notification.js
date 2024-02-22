import Notification from '@/models/Notification'
import { each } from 'lodash'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default {
  namespaced: true,
  state: {
    newList: [],
    earlierList: [],
    listMeta: {
      current_page: 0,
      last_page: 1,
    },
  },

  actions: {
    async getNotifications({ commit }, params) {
      const query = Notification.page(params.page || 1).include(
        'notifiable.avatar,actor.avatar'
      )

      if (params.search) {
        query.where('search', params.search)
      }

      const res = await query.params({ limit: 20 }).get()

      commit('setNewNotificationList', res.data)
      commit('setNotificationListMeta', res.meta)
    },
  },

  mutations: {
    setNewNotificationList(state, notifications) {
      each(notifications, (notif) => {
        if (dayjs().isSame(notif.created_at, 'date')) {
          // set today notifs
          state.newList.push(new Notification(notif))
        } else {
          // set previous days notifs
          state.earlierList.push(new Notification(notif))
        }
      })
    },

    setNotificationListMeta(state, meta) {
      state.listMeta = meta
    },

    clearNotificationList(state) {
      state.newList = []
      state.earlierList = []
    },
  },
}
