<template>
  <v-app-bar-nav-icon
    v-if="!controls.drawer"
    @click.stop="controls.drawer = !controls.drawer"
  ></v-app-bar-nav-icon>
</template>

<script>
import ControlsMixin from '@/utils/mixins/Controls'
export default {
  mixins: [ControlsMixin],
}
</script>

<style></style>
