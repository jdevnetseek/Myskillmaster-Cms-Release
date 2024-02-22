<template>
  <v-avatar :size="size" :tile="tile">
    <img :src="thumbSrc" alt="avatar" />
  </v-avatar>
</template>

<script>
export default {
  props: {
    avatar: {
      type: Object,
    },
    alt: {
      type: String,
      default: 'Avatar',
    },
    size: {
      type: String,
      default: '120',
    },
    tile: {
      type: Boolean,
    },
  },

  computed: {
    thumbSrc() {
      return this.avatar
        ? this.avatar.url
        : require('@/assets/images/default-profile.png')
    },
  },
}
</script>

<style lang="scss" scoped>
.rounded-0 {
  border-radius: 5px !important;
}
</style>
