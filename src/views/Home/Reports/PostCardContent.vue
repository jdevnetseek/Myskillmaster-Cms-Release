<template>
  <v-card-text>
    <v-img :src="postImage" aspect-ratio="1.7778" />
    <div class="font-weight-bold body-1 mt-2">
      {{ postBody }}
    </div>
  </v-card-text>
</template>
<script>
import get from 'lodash/get'
export default {
  props: ['report'],
  computed: {
    postImage() {
      return get(this.report, 'reportable.photo.url')
    },
    postBody() {
      return get(this.report, 'reportable.body')
    },
  },
}
</script>
