<template>
  <v-list-group
    class="pa-2"
    :active-class="'grey--text text--darken-4'"
    :sub-group="subGroup"
    :group="group"
  >
    <template v-slot:activator>
      <v-list-item-title
        class="app-nav--item"
        @click="item.to ? goToRoute(item.to) : ''"
        >{{ item.label }}</v-list-item-title
      >
    </template>

    <template v-for="(child, i) in item.children">
      <nav-list-group
        v-if="isGroupItem(child)"
        :key="i"
        :item="child"
        :sub-group="subGroup"
        :group="$route.path"
      ></nav-list-group>
      <nav-list-item
        v-else
        :key="i"
        :label="child.label"
        :icon="child.icon"
        :disabled="child.disabled"
        :to="child.to"
      ></nav-list-item>
    </template>
  </v-list-group>
</template>

<script>
import NavListItem from './NavListItem'

export default {
  components: {
    NavListItem,
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
    subGroup: {
      type: Boolean,
      default: false,
    },
    group: {
      default: '',
    },
  },

  methods: {
    isGroupItem(item) {
      return item.children && item.children.length > 0
    },
    goToRoute(route) {
      this.$router.replace({ name: route.name }).catch(() => {})
    },
  },
}
</script>

<style></style>
