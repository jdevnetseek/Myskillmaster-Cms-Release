<template>
  <div class="d-flex flex-row align-stretch mb-8 avatar-wrapper">
    <div>
      <v-skeleton-loader
        v-if="loading"
        width="160"
        height="160"
        type="card-avatar"
        tile
      ></v-skeleton-loader>
      <v-avatar size="140" tile class="elevation-1 rounded-lg">
        <img
          class="pa-2"
          v-show="iconUrl"
          :src="iconUrl"
          alt="category-icon"
          height="120"
        />
      </v-avatar>
    </div>

    <div class="d-flex flex-column justify-space-around ml-6">
      <v-btn
        text
        class="text-capitalize font-weight-bold text-primary"
        @click="showCropperModal = !showCropperModal"
        :loading="loading"
      >
        <img src="@/assets/icons/icon-image.svg" class="mr-2" alt />Upload Image
      </v-btn>

      <span class="error--text" v-if="errorMessages">
        {{ errorMessages[0] }}
      </span>
    </div>

    <image-cropper v-model="showCropperModal" @change="iconChange" />

    <v-snackbar v-model="snackbar.show" right>
      {{ snackbar.message }}
      <v-btn color="pink" text @click="snackbar.show = false">Ok</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mdiImagePlus, mdiDelete } from '@mdi/js'
import ImageCropper from '@/components/modals/ImageCropper'

export default {
  props: {
    category: {
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: Array,
    },
  },

  emits: ['change'],

  components: {
    ImageCropper,
  },

  data() {
    return {
      icons: {
        addImage: mdiImagePlus,
        delete: mdiDelete,
      },
      showCropperModal: false,
      deleteConfirmDialog: false,
      snackbar: {
        show: false,
        message: null,
      },
    }
  },

  computed: {
    iconUrl() {
      let url = ''

      if (
        this.category.icon_url !== '' &&
        this.category.icon_url !== undefined
      ) {
        url = this.category.icon_url
      } else if (this.category.icon instanceof Blob) {
        url = URL.createObjectURL(this.category.icon)
      }

      return url
    },
  },

  methods: {
    iconChange(image) {
      this.$emit('change', image)
    },
    showSnackbar(message) {
      this.snackbar.message = message
      this.snackbar.show = true
    },
  },
}
</script>
