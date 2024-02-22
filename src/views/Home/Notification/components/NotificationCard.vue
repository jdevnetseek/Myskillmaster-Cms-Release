<template>
  <v-card
    max-width="850"
    class="mx-auto my-10 pb-10"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loading"
    infinite-scroll-distance="100"
  >
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-subheader v-text="item.header" :key="item.header"></v-subheader>

        <div v-if="item.data.length > 0" :key="index">
          <template v-for="notif in item.data">
            <v-list-item
              :key="notif.id"
              :class="notif.read ? '' : 'blue lighten-5'"
            >
              <v-list-item-avatar>
                <v-img :src="actorThumbSrc(notif.actor.avatar)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content v-if="notif.type == type.like">
                <v-list-item-title>
                  <strong>{{ notif.actor.full_name }}</strong> liked
                  <strong>{{ notif.notifiable.full_name }}</strong> post.
                </v-list-item-title>
                <v-list-item-subtitle
                  v-html="notif.diffForHuman"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content v-else-if="notif.type == type.follow">
                <v-list-item-title>
                  <strong>{{ notif.actor.full_name }}</strong> started following
                  <strong>{{ notif.notifiable.full_name }}</strong
                  >.
                </v-list-item-title>
                <v-list-item-subtitle
                  v-html="notif.diffForHuman"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-content v-else-if="notif.type == type.comment">
                <v-list-item-title>
                  <strong>{{ notif.actor.full_name }}</strong> commented on
                  <strong>{{ notif.notifiable.full_name }}</strong> post.
                </v-list-item-title>
                <v-list-item-subtitle
                  v-html="notif.diffForHuman"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider :key="notif.id + 'divider'"></v-divider>
          </template>
        </div>

        <div v-else :key="index">
          <v-list-item>
            <v-list-item-content>
              <v-alert
                color="blue lighten-4"
                border="left"
                elevation="2"
                colored-border
                :icon="icons.bellSleep"
                >There are no recent activities.</v-alert
              >
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-list>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { mdiDotsVertical, mdiBellSleep } from '@mdi/js'
import { findIndex } from 'lodash'

import infiniteScroll from 'vue-infinite-scroll'

export default {
  name: 'NotificationCard',

  directives: {
    infiniteScroll,
  },

  data() {
    return {
      loading: false,
      icons: {
        dotVertical: mdiDotsVertical,
        bellSleep: mdiBellSleep,
      },
      items: [
        {
          header: 'New',
          data: [],
        },
        {
          header: 'Earlier',
          data: [],
        },
      ],
      type: {
        like: 'like',
        follow: 'follow',
        comment: 'comment',
      },
    }
  },

  created() {
    this.clearNotificationList()
    this.fetchNotification()
  },

  computed: {
    ...mapState({
      newNotifs: (state) => state.notification.newList,
      earlierNotifs: (state) => state.notification.earlierList,
      listMeta: (state) => state.notification.listMeta,
    }),

    paginationLength() {
      return (this.listMeta.total / this.listMeta.per_page) | 0
    },
  },

  methods: {
    ...mapActions({
      getNotifications: 'notification/getNotifications',
    }),

    ...mapMutations({
      clearNotificationList: 'notification/clearNotificationList',
    }),

    pageChanged(page) {
      this.fetchNotification(page)
    },

    loadMore() {
      if (this.listMeta.current_page < this.listMeta.last_page) {
        this.fetchNotification(this.listMeta.current_page + 1)
      }
    },

    async fetchNotification(page = 1) {
      if (this.loading) return
      let params = { page }

      this.loading = true
      await this.getNotifications(params)

      let newIndex = findIndex(this.items, { header: 'New' })
      let earlierIndex = findIndex(this.items, { header: 'Earlier' })

      this.items[newIndex].data = this.newNotifs
      this.items[earlierIndex].data = this.earlierNotifs

      this.loading = false
    },

    actorThumbSrc(avatar) {
      return avatar
        ? avatar.url
        : require('@/assets/images/default-profile.png')
    },
  },
}
</script>
