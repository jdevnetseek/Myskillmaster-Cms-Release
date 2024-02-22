<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card max-width="380" class="mx-auto">
        <v-layout align-center justify-center column class="pt-6">
          <v-img
            :src="require('@/assets/images/logo.png')"
            width="144px"
            height="144px"
          ></v-img>
          <div class="display-1 ma-3">APPETISER</div>
          <div class="subtitle-1">Forgot Password</div>
        </v-layout>
        <div class="pa-6">
          <v-tabs v-model="tab" class="no-tab-bar">
            <v-tabs-items v-model="tab">
              <v-tab-item value="forgot-password-tab">
                <v-form ref="form" @submit.prevent="checkUsername">
                  <v-text-field
                    outlined
                    clearable
                    required
                    type="email"
                    v-model="form.email"
                    label="Enter your email"
                    :error-messages="form.$getError('email')"
                  ></v-text-field>
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="form.$busy"
                    >Send password reset code</v-btn
                  >
                  <div class="mt-4">
                    <v-btn text color="primary" block to="/auth/login"
                      >Login</v-btn
                    >
                  </div>
                </v-form>
              </v-tab-item>
              <v-tab-item value="verify-token-tab">
                <div class="text-center mb-8">
                  <div v-if="form.email">
                    <v-chip close @click:close="notYou" outlined>
                      <v-avatar left>
                        <img
                          :src="require('@/assets/images/default-profile.png')"
                          alt=""
                        />
                      </v-avatar>
                      {{ form.email }}
                    </v-chip>
                  </div>
                </div>
                <v-alert dense type="info">
                  Check your inbox for the verification code and enter it below.
                </v-alert>
                <v-form ref="form" @submit.prevent="verifyToken">
                  <input type="hidden" />
                  <v-text-field
                    outlined
                    required
                    label="Verification code"
                    v-model="form.token"
                    :error-messages="form.$getError('token')"
                    autocomplete="false"
                  ></v-text-field>
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="form.$busy"
                    >Verify</v-btn
                  >
                </v-form>
              </v-tab-item>
              <v-tab-item value="reset-password-tab">
                <div class="text-center mb-4">
                  <div v-if="form.email">
                    <v-chip close @click:close="notYou" outlined>
                      <v-avatar left>
                        <img
                          :src="require('@/assets/images/default-profile.png')"
                          alt=""
                        />
                      </v-avatar>
                      {{ form.email }}
                    </v-chip>
                  </div>
                </div>
                <div class="title text-center">
                  Enter your new password below.
                </div>
                <br />
                <v-form ref="form" @submit.prevent="resetPassword">
                  <v-text-field
                    outlined
                    required
                    type="password"
                    label="Your new password"
                    v-model="form.password"
                    :error-messages="form.$getError('password')"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    required
                    type="password"
                    label="New password confirmation"
                    v-model="form.password_confirmation"
                    :error-messages="form.$getError('password_confirmation')"
                  ></v-text-field>
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="form.$busy"
                    >Reset Password</v-btn
                  >
                </v-form>
              </v-tab-item>
              <v-tab-item value="success-tab">
                <div class="text-center mb-8">
                  <div v-if="form.email">
                    <v-chip outlined>
                      <v-avatar left>
                        <img
                          :src="require('@/assets/images/default-profile.png')"
                          alt=""
                        />
                      </v-avatar>
                      {{ form.email }}
                    </v-chip>
                  </div>
                  <br />
                  <v-alert type="success">
                    Your password has been reset successfully!
                  </v-alert>
                  <v-btn
                    block
                    large
                    color="primary"
                    :to="{ name: 'auth.login' }"
                    >Continue to login</v-btn
                  >
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Form from '@/utils/form'

export default {
  name: 'LoginPage',
  data() {
    return {
      tab: 'forgot-password-tab',
      form: new Form({
        email: null,
        token: null,
        password: null,
        password_confirmation: null,
      }),
    }
  },

  methods: {
    checkUsername() {
      this.form.$clearErrors()
      this.form.$busy = true
      this.$api
        .post('auth/forgot-password', { email: this.form.email })
        .then(({ data }) => {
          this.form.$busy = false
          this.showVerifyTokenTab()
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    verifyToken() {
      this.form.$clearErrors()
      this.form.$busy = true
      this.$api
        .post('auth/reset-password/check', this.form.$data())
        .then(({ data }) => {
          this.form.$busy = false
          this.showResetPasswordTab()
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    resetPassword() {
      this.form.$clearErrors()
      this.form.$busy = true
      this.$api
        .post('auth/reset-password', this.form.$data())
        .then(({ data }) => {
          this.form.$busy = false
          this.showSuccessTab()
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    notYou() {
      this.clearForm()
    },

    showForgotPasswordTab() {
      this.tab = 'forgot-password-tab'
    },

    showVerifyTokenTab() {
      this.tab = 'verify-token-tab'
    },

    showResetPasswordTab() {
      this.tab = 'reset-password-tab'
    },

    showSuccessTab() {
      this.tab = 'success-tab'
    },

    clearForm() {
      this.form.$reset()
      this.showForgotPasswordTab()
    },
  },
  watch: {
    'form.username'() {
      this.form.$clearError('username')
    },
    'form.password'() {
      this.form.$clearError('password')
    },
  },
}
</script>
