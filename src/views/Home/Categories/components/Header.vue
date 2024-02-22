<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />
      <v-skeleton-loader
        type="chip"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>

      <v-toolbar-title v-else class="headline font-weight-bold"
        >Categories ({{ totalCategories }})</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <slot></slot>
    </v-app-bar>
  </div>
</template>

<script>
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'

export default {
  name: 'CategoriesHeader',

  props: {
    loading: {
      required: true,
      type: Boolean,
    },
    totalCategories: {
      required: true,
      type: Number,
    },
  },

  components: {
    AppBarNavIcon,
  },
}
</script>
