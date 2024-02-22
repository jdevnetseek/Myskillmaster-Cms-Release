<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />
      <v-toolbar-title class="headline font-weight-bold"
        >Settings</v-toolbar-title
      >
      <v-spacer></v-spacer>
    </v-app-bar>
    <router-view class="ml-4 mt-4" />
  </div>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'

export default {
  name: 'SettingsPage',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon,
  },
}
</script>
