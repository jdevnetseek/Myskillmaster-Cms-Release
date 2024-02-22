<template>
  <v-app>
    <v-navigation-drawer v-model="controls.drawer" width="322px" floating app>
      <v-layout
        align-center
        justify-center
        column
        class="app-logo-container"
        style="height: 322px"
      >
        <div class="app-logo-sheet">
          <v-img
            :src="require('@/assets/images/logo2.png')"
            width="100px"
            height="100px"
            class="ma-6"
          ></v-img>
        </div>
        <div class="app-company--name mt-8">myskillmaster</div>
        <div class="app-project--name mt-2">Admin CMS</div>
      </v-layout>

      <v-list class="app-nav" flat>
        <v-subheader class="mb-5">
          <div class="app-nav--title mx-auto">NAVIGATION</div>
        </v-subheader>
        <template v-for="(item, i) in navItems">
          <nav-list-group
            v-if="isGroupItem(item)"
            :key="i"
            :item="item"
            :group="$route.path"
          ></nav-list-group>
          <nav-list-item
            v-else
            :key="i"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
            class="py-2"
          ></nav-list-item>
        </template>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-menu top offset-y>
            <template v-slot:activator="{ on }">
              <v-list-item two-line v-on="on">
                <v-list-item-avatar>
                  <user-avatar size="40" :avatar="user.avatar" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ user.full_name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.email ? user.email : user.phone_number }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item
                :to="{ name: 'user.details', params: { id: user.id } }"
              >
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logoutConfirmDialog = true">
                <v-list-item-title>Log out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-content class="main-content">
      <div class="px-xl-12 px-lg-10 px-md-6 px-sm-4 px-xs-2">
        <slot />
      </div>
    </v-content>
    <ConfirmModal
      v-model="logoutConfirmDialog"
      title="Logout"
      message="Are you sure you want to logout?"
    >
      <v-btn text @click="logoutConfirmDialog = false">Cancel</v-btn>
      <v-btn color="primary" text @click="logout">Logout</v-btn>
    </ConfirmModal>
  </v-app>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import ConfirmModal from '@/components/modals/ConfirmModal'
import { mapState, mapActions, mapGetters } from 'vuex'
import UserAvatar from '@/components/UserAvatar'
import NavListGroup from '@/components/NavListGroup'
import NavListItem from '@/components/NavListItem'

export default {
  name: 'MainLayout',

  components: {
    UserAvatar,
    ConfirmModal,
    NavListGroup,
    NavListItem,
  },

  mixins: [ControlsMixin],

  data() {
    return {
      navItems: [
        // { label: 'Inbox', to: { name: 'inbox' } },
        { label: 'Users', to: { name: 'users' } },
        { label: 'Categories', to: { name: 'categories' } },
        // { label: 'Content', to: { name: 'content' } },
        // { label: 'Notifications', to: { name: 'notification' } },
        { label: 'Settings', to: { name: 'settings' } },
        { label: 'Reports', to: { name: 'reported_lessons' } },
        // { label: 'Reported Lessons', to: { name: 'reported_lessons' } },
      ],
      logoutConfirmDialog: false,
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    ...mapGetters({
      avatarThumb: 'auth/avatarThumb',
    }),
  },

  methods: {
    ...mapActions({
      logout: 'auth/logout',
    }),

    isGroupItem(navItem) {
      return navItem.children ? navItem.children.length > 0 : false
    },
  },
}
</script>
