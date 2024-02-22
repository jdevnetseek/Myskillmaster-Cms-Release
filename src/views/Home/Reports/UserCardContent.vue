<template>
  <v-card-text class="d-flex">
    <v-avatar>
      <img :src="userAvatar" :alt="userName" />
    </v-avatar>
    <div class="ml-3">
      <label class="d-block">{{ reporterName }}</label>
      <label class="d-block">{{ reporterEmail }}</label>
    </div>
  </v-card-text>
</template>
<script>
import get from 'lodash/get'
export default {
  props: ['report'],
  computed: {
    userAvatar() {
      return get(this.report, 'reportable.avatar_permanent_url')
    },
    userName() {
      return get(this.report, 'reportable.full_name')
    },
    reporterName() {
      return get(this.report, 'reportable.full_name')
    },
    reporterEmail() {
      return get(this.report, 'reportable.email')
    },
  },
}
</script>
