<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card max-width="380" class="mx-auto">
        <v-layout align-center justify-center column class="pt-6">
          <v-img
            :src="require('@/assets/images/logo.png')"
            width="290px"
            height="144px"
            contain
          ></v-img>
          <div class="display-1 ma-3">myskillmaster</div>
          <div class="subtitle-1">Sign into your account</div>
        </v-layout>
        <div class="pa-6">
          <v-tabs v-model="tab" class="no-tab-bar">
            <v-tabs-items v-model="tab">
              <v-tab-item value="username-tab">
                <v-form ref="form" @submit.prevent="checkEmail">
                  <v-text-field
                    autofocus
                    outlined
                    clearable
                    required
                    v-model="form.email"
                    label="Email"
                    class="mt-1"
                    :error-messages="form.$getError('email')"
                  ></v-text-field>
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="form.$busy"
                    >Submit</v-btn
                  >
                  <div class="mt-4" v-if="showCreateAccount">
                    <v-btn text color="primary" block>Create new account</v-btn>
                  </div>
                </v-form>
              </v-tab-item>
              <v-tab-item value="password-tab">
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
                <v-form ref="form" @submit.prevent="signIn">
                  <v-text-field
                    autofocus
                    outlined
                    required
                    type="password"
                    label="Password"
                    v-model="form.password"
                    :error-messages="form.$getError('password')"
                  ></v-text-field>
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="form.$busy"
                    >Sign in</v-btn
                  >
                </v-form>
                <v-layout class="mt-4" v-if="showForgotPassword">
                  <v-btn
                    text
                    color="primary"
                    block
                    :to="{ name: 'auth.forgot-password' }"
                    >Forgot password ?</v-btn
                  >
                </v-layout>
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
      showForgotPassword: false,
      showCreateAccount: false,
      tab: 'username-tab',
      form: new Form({
        email: null,
        password: null,
      }),
    }
  },

  methods: {
    checkEmail() {
      this.form.$clearErrors()
      this.form.$busy = true
      this.$api
        .post('auth/check-email', { email: this.form.email })
        .then(({ data }) => {
          this.form.$busy = false
          this.showPasswordTab()
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 404) {
            this.form.$setErrors({ email: err.response.data.message })
          } else if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    signIn() {
      this.form.$clearErrors()
      this.form.$busy = true
      this.$api
        .post('admin/login', {
          email: this.form.email,
          password: this.form.password,
        })
        .then(({ data }) => {
          this.form.$busy = false
          this.$store.commit('auth/setToken', data.data)
          this.$router.replace({ name: 'home' })
        })
        .catch((err) => {
          this.form.$busy = false
          if (err.response.status === 401) {
            this.form.$setErrors({ password: err.response.data.message })
          } else if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    notYou() {
      this.clearForm()
    },

    showUsernameTab() {
      this.tab = 'username-tab'
    },

    showPasswordTab() {
      this.tab = 'password-tab'
    },

    clearForm() {
      this.form.$reset()
      this.showUsernameTab()
    },
  },
  watch: {
    'form.email'() {
      this.form.$clearError('username')
    },
    'form.password'() {
      this.form.$clearError('password')
    },
  },
}
</script>
