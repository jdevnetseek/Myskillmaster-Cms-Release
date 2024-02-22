<template>
  <div class="py-8">
    <v-app-bar flat color="transparent">
      <app-bar-nav-icon />
      <v-toolbar-title class="breadcrumbs d-flex align-center">
        <v-icon class="text-primary">{{ icons.arrowLeft }}</v-icon>
        <router-link class="text-decoration--none" :to="{ name: 'users' }"
          >Users</router-link
        >
      </v-toolbar-title>
    </v-app-bar>

    <div class="ma-4" v-if="form">
      <div class="display-2 font-weight-bold my-6 text-capitalize">
        {{ displayName }}
      </div>

      <div class="d-flex my-6">
        <v-tabs hide-slider class="user-info-tabs">
          <v-tab class="pa-0" v-for="(item, key) in tabItems" :key="key">
            {{ item.tab }}
          </v-tab>

          <v-tab-item class="col-md-4 col-sm-12 col-xs-12 mt-6 pa-0">
            <v-alert
              dense
              outlined
              type="warning"
              color="orange darken-3"
              max-width="400px"
              v-if="!!user.blocked_at"
            >
              This account is <strong>disabled</strong>.
            </v-alert>

            <avatar-form
              :user="user"
              @change="avatarChange"
              @avatarRemove="userAvatarRemoved"
              :avatarLoading="avatarLoading"
            />

            <v-form ref="form" v-if="form" class="user-form">
              <v-divider></v-divider>

              <h3 class="py-5 primary--text">User Information</h3>

              <label class="text-field-label">Username</label>
              <v-text-field
                flat
                solo
                class="mt-2"
                v-model="form.username"
                :loading="loading"
                readonly
                disabled
              />

              <label class="text-field-label">First Name</label>
              <v-text-field
                flat
                solo
                required
                class="mt-2"
                v-model="form.first_name"
                :error-messages="form.$getError('first_name')"
                :loading="loading"
              ></v-text-field>

              <label class="text-field-label">Last Name</label>
              <v-text-field
                flat
                solo
                required
                class="mt-2"
                v-model="form.last_name"
                :error-messages="form.$getError('last_name')"
                :loading="loading"
              ></v-text-field>

              <label class="text-field-label">Email</label>
              <v-text-field
                flat
                solo
                required
                class="mt-2"
                v-model="form.email"
                :error-messages="form.$getError('email')"
                :loading="loading"
              >
                <v-tooltip slot="append" top v-if="user.email">
                  <template v-slot:activator="{ on }">
                    <v-icon
                      color="success"
                      v-on="on"
                      v-if="user.email_verified"
                      >{{ icons.check }}</v-icon
                    >
                    <v-icon color="warning" v-on="on" v-else>{{
                      icons.alert
                    }}</v-icon>
                  </template>
                  <span v-if="user.email_verified">Email Verified</span>
                  <span v-else>Unverified email</span>
                </v-tooltip>
              </v-text-field>

              <v-checkbox
                :input-value="user && user.blocked_at"
                label="Disable user account"
                color="orange darken-3"
                class="mt-0"
                @mousedown="showModal = true"
              ></v-checkbox>

              <div class="d-flex mt-4">
                <div>
                  <v-btn
                    color="error"
                    class="mr-4 px-6"
                    height="40px"
                    width="100%"
                    @click="deleteDialog = true"
                    >Delete</v-btn
                  >
                </div>

                <v-spacer></v-spacer>

                <div>
                  <v-btn
                    color="primary"
                    class="mr-4 px-6"
                    height="40px"
                    width="100%"
                    @click="updateUserDetails"
                    :loading="form.$busy"
                    >Update</v-btn
                  >
                </div>
              </div>
            </v-form>

            <v-dialog v-model="deleteDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Delete ?</v-card-title>

                <v-card-text
                  >Are you sure you want to delete this account ?</v-card-text
                >

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn text @click="deleteDialog = false">Cancel</v-btn>

                  <v-btn
                    color="red"
                    text
                    @click="deleteUser"
                    :loading="isLoadingDelete"
                    >Yes, Delete please</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-tab-item>
        </v-tabs>
      </div>
    </div>

    <v-overlay absolute :value="loading" opacity="0.2">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>

    <ConfirmModal
      v-model="showModal"
      title="Disable Account"
      :message="disableMessage"
      @cancel="showModal = false"
      @confirm="blockAccount"
    ></ConfirmModal>
  </div>
</template>

<script>
import { mdiChevronLeft, mdiCheck, mdiAlertCircleOutline } from '@mdi/js'
import { mapState, mapActions, mapMutations } from 'vuex'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import AvatarForm from './components/AvatarForm'
import ConfirmModal from '@/components/modals/ConfirmModal'

import Form from '@/utils/form'

export default {
  name: 'UserDetails',

  components: {
    AvatarForm,
    AppBarNavIcon,
    ConfirmModal,
  },

  data() {
    return {
      icons: {
        arrowLeft: mdiChevronLeft,
        check: mdiCheck,
        alert: mdiAlertCircleOutline,
      },
      loading: false,
      avatarLoading: false,
      deleteDialog: false,
      form: null,
      showCropperModal: false,
      avatarTimestamp: new Date().getTime(),
      tabItems: [{ tab: 'Info' }],
      snackbar: {
        show: false,
        message: null,
        color: '',
      },
      showModal: false,
      isLoadingDelete: false,
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user.userDetails,
      authUser: (state) => state.auth.user,
    }),
    displayName() {
      return this.form.full_name || this.form.email
    },
    disableMessage() {
      const action = this.user && this.user.blocked_at ? 'unblock' : 'block'
      return `Are you sure you want ${action} this account?`
    },
  },

  methods: {
    ...mapActions({
      getUserDetails: 'user/getUserDetails',
      changeAvatar: 'user/changeAvatar',
      updateUser: 'user/updateUser',
      blockUser: 'user/blockUser',
    }),

    ...mapMutations({
      clearUserDetails: 'user/clearUserDetails',
      setSelectedUserAvatar: 'user/setSelectedUserAvatar',
      userAvatarRemoved: 'user/userAvatarRemoved',
    }),

    async getUser() {
      this.loading = true
      await this.getUserDetails(this.$route.params.id)
      this.form = new Form(this.user)
      this.loading = false
    },

    async avatarChange(image) {
      this.avatarLoading = true
      let data = new FormData()
      data.append('user_id', this.user.id)
      data.append('avatar', image)
      await this.changeAvatar(data)
      this.avatarLoading = false
      this.showSnackbar('Avatar successfully updated!', 'success')
    },

    async updateUserDetails() {
      this.form.$busy = true
      this.form.$clearErrors()
      this.updateUser(this.form.$data())
        .then(() => {
          this.form.$busy = false
          this.showSnackbar('User details successfully updated!', 'success')
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    deleteUser() {
      this.isLoadingDelete = true
      this.user.delete().then(() => {
        this.isLoadingDelete = false
        this.deleteDialog = false
        this.showSnackbar('User deleted successfully!')
        this.$router.replace('/users')
      })
    },

    showSnackbar(message, color) {
      this.snackbar.message = message
      this.snackbar.show = true
      this.snackbar.color = color
    },
    blockAccount(value) {
      this.form.$busy = true
      const action = this.user.blocked_at ? 'unblocked' : 'blocked'
      this.blockUser({
        id: this.user.id,
        action,
      })
        .then(() => {
          this.form.$busy = false
          this.showModal = false
          this.showSnackbar(`User successfully ${action}!`, 'success')
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },
  },

  created() {
    this.getUser()
  },

  destroyed() {
    this.clearUserDetails()
  },

  watch: {
    $route() {
      this.getUser()
    },
  },
}
</script>

<style lang="scss" scoped>
.user-form {
  width: 400px;

  @media (max-width: 420px) {
    width: 100%;
  }
}
</style>
