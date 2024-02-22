<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />
      <v-toolbar-title class="headline font-weight-bold"
        >Notification</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon>
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </v-app-bar>

    <notification-card></notification-card>
  </div>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import NotificationCard from './components/NotificationCard'

export default {
  name: 'NotificationPage',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon,
    NotificationCard,
  },
}
</script>
