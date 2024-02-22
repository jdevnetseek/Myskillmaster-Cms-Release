<template>
  <div>
    <v-row>
      <v-col
        v-for="(file, ndx) in files"
        :key="ndx"
        class="d-flex child-flex ma-1"
        cols="5"
      >
        <v-img
          :src="file.url"
          :lazy-src="file.thumb_url"
          aspect-ratio="1"
          cover
          class="bg-grey-lighten-2"
          @click="displayImageDialog(ndx)"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey-lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <v-dialog
      @click:outside="hideImageDialog"
      @keydown.esc="hideImageDialog"
      v-model="imageDialog.show"
      content-class="view-image"
    >
      <v-btn dark fab @click="hideImageDialog" class="float-right">
        <v-icon>{{ icons.close }}</v-icon>
      </v-btn>
      <v-card class="view-image__border">
        <v-carousel hide-delimiters v-model="imageDialog.currentImageIndex">
          <v-carousel-item
            v-for="(file, i) in files"
            :key="i"
            :src="file.url"
            max-height="1920"
            max-width="1080"
            contain
          ></v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: 'Images',

  props: {
    files: {
      type: Array,
    },
  },

  data() {
    return {
      imageDialog: {
        show: false,
        currentImageIndex: -1,
      },

      icons: {
        close: mdiClose,
      },
    }
  },

  methods: {
    displayImageDialog(ndx) {
      this.imageDialog.currentImageIndex = ndx

      this.toggleImageDialog()
    },

    hideImageDialog() {
      this.toggleImageDialog()

      this.imageDialog.currentImageIndex = -1
    },

    toggleImageDialog() {
      this.imageDialog.show = !this.imageDialog.show
    },
  },
}
</script>

<style lang="scss" scoped>
.v-dialog {
  box-shadow: none;
}
::v-deep .view-image {
  max-width: 1080px;
  box-shadow: none;

  &__border {
    height: 100%;
    text-align: center;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
