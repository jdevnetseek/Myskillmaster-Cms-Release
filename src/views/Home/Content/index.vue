<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />
      <v-toolbar-title class="headline font-weight-bold"
        >Content</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn icon>
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </v-app-bar>
  </div>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'

export default {
  name: 'ContentPage',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon,
  },
}
</script>
