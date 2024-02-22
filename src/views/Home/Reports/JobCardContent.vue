<template>
  <v-card-text>
    <v-row>
      <v-col
        v-for="photo in report.reportable.photos"
        :key="photo.id"
        class="d-flex child-flex"
        cols="4"
      >
        <v-img
          :src="photo.url"
          :lazy-src="photo.url"
          aspect-ratio="1"
          class="grey lighten-2"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
    <div class="font-weight-bold mb-4">
      <div>Title: {{ report.reportable.title }}</div>
      <div>Description: {{ report.reportable.description }}</div>
      <div>Price Offer: {{ report.reportable.price_offer }}</div>
      <div>Suburb: {{ report.reportable.suburb }}</div>
    </div>
    <v-divider></v-divider>
    <div class="d-flex mt-4">
      <v-avatar>
        <img :src="authorAvatar" />
      </v-avatar>

      <div class="ml-3">
        <label class="d-block">{{ report.reportable.author.full_name }}</label>
        <label class="d-block">{{ report.reportable.author.email }}</label>
      </div>
    </div>
  </v-card-text>
</template>
<script>
import get from 'lodash/get'

export default {
  props: ['report'],
  computed: {
    authorAvatar(vm) {
      return get(vm.report, 'reportable.author.avatar_permanent_url')
    },
  },
}
</script>
