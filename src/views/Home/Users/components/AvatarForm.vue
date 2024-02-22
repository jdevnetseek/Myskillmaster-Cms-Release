<template>
  <div class="d-flex flex-row align-stretch mb-8 avatar-wrapper">
    <div>
      <v-skeleton-loader
        v-if="avatarLoading"
        width="160"
        height="160"
        type="card-avatar"
        tile
      ></v-skeleton-loader>
      <user-avatar v-else :avatar="user.avatar" tile size="160" />
    </div>

    <div class="d-flex flex-column justify-space-around ml-6">
      <v-btn
        text
        class="text-capitalize font-weight-bold text-primary"
        @click="showCropperModal = !showCropperModal"
        :loading="avatarLoading"
      >
        <img src="@/assets/icons/icon-image.svg" class="mr-2" alt />Upload Image
      </v-btn>
      <v-btn
        v-if="user.avatar"
        text
        class="text-capitalize font-weight-bold text-light-grey"
        @click="deleteConfirmDialog = true"
        :loading="avatarLoading"
      >
        <img src="@/assets/icons/icon-trash.svg" class="mr-2" alt /> Delete
        Image
      </v-btn>
    </div>

    <image-cropper v-model="showCropperModal" @change="avatarChange" />

    <ConfirmModal
      v-model="deleteConfirmDialog"
      title="Remove Image"
      message="Are you sure you want to remove the image?"
      @cancel="deleteConfirmDialog = false"
      @confirm="deleteAvatar"
    ></ConfirmModal>

    <v-snackbar v-model="snackbar.show" right>
      {{ snackbar.message }}
      <v-btn color="pink" text @click="snackbar.show = false">Ok</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mdiImagePlus, mdiDelete } from '@mdi/js'
import ImageCropper from '@/components/modals/ImageCropper'
import UserAvatar from '@/components/UserAvatar'
import User from '@/models/User'
import ConfirmModal from '@/components/modals/ConfirmModal'

export default {
  props: {
    user: {
      type: User,
    },
    avatarLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ImageCropper,
    UserAvatar,
    ConfirmModal,
  },
  data() {
    return {
      icons: {
        addImage: mdiImagePlus,
        delete: mdiDelete,
      },
      loading: false,
      showCropperModal: false,
      deleteConfirmDialog: false,
      snackbar: {
        show: false,
        message: null,
      },
    }
  },
  methods: {
    avatarChange(image) {
      this.$emit('change', image)
    },
    async deleteAvatar() {
      await this.$api.delete(`/users/${this.user.id}/avatar`)
      this.showSnackbar('User avatar successfully deleted!')
      this.deleteConfirmDialog = false
      this.$emit('avatarRemove')
    },
    showSnackbar(message) {
      this.snackbar.message = message
      this.snackbar.show = true
    },
  },
}
</script>
