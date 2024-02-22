<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />
      <v-toolbar-title class="headline font-weight-bold">Inbox</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </v-app-bar>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'

export default {
  name: 'InboxPage',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon,
  },

  data() {
    return {
      snackbar: {
        show: false,
        message: null,
        color: '',
      },
    }
  },
}
</script>
