<template>
  <v-list-item
    link
    router
    active-class="white black--text"
    :disabled="disabled"
    :key="label"
    :to="to"
  >
    <v-list-item-icon v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>

    <v-list-item-title
      class="pa-2 font-weight-bold grey--text text--darken-4"
      >{{ label }}</v-list-item-title
    >
  </v-list-item>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    disabled: {
      default: false,
    },
    to: {
      default: () => {},
    },
  },
}
</script>

<style></style>
