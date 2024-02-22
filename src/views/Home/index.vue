<template>
  <main-layout v-if="!loading">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </main-layout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout'
import { mapState, mapActions } from 'vuex'

export default {
  components: { MainLayout },
  data() {
    return {
      loading: true,
    }
  },

  computed: {
    ...mapState({
      isAuthenticated: (state) => state.auth.isAuthenticated,
    }),
  },

  methods: {
    ...mapActions({
      getAuthenticatedUser: 'auth/getAuthenticatedUser',
    }),
  },

  created() {
    if (this.isAuthenticated) {
      this.getAuthenticatedUser().then((res) => {
        this.loading = false
      })
    } else {
      this.$router.replace({ name: 'auth.login' })
    }
  },
}
</script>
