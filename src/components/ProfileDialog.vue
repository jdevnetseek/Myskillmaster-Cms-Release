<template>
  <v-dialog v-model="show" :width="width">
    <profile-card v-if="profile" :profile="profile" />
  </v-dialog>
</template>

<script>
import ProfileCard from '@/components/ProfileCard'

export default {
  components: {
    ProfileCard
  },

  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 500
    },
    profile: {
      type: [Object, null]
    }
  },

  data() {
    return {
      show: this.value
    }
  },

  watch: {
    show(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.show = val
    }
  }
}
</script>

<style></style>
