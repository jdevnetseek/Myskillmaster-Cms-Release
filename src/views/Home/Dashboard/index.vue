<template>
  <div>
    <v-app-bar flat color="transparent">
      <app-bar-nav-icon />
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'

export default {
  name: 'DashboardPage',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon
  }
}
</script>
