<template>
  <v-app-bar flat color="transparent">
    <app-bar-nav-icon />
    <v-toolbar-title class="breadcrumbs d-flex align-center">
      <v-icon class="text-primary">{{ leftIcon }}</v-icon>
      <router-link class="text-decoration--none" :to="{ name: 'categories' }"
        >Categories</router-link
      >

      <slot />
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import { mdiChevronLeft } from '@mdi/js'

export default {
  name: 'BreadCrumbs',

  components: {
    AppBarNavIcon,
  },

  data() {
    return {
      leftIcon: mdiChevronLeft,
    }
  },
}
</script>
