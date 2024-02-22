<template>
  <div>
    <h3 class="mb-2">Send Notification</h3>
    <v-btn
      :loading="loading"
      color="primary"
      class="mr-4"
      @click="sendNotif('comment')"
    >
      Comment
    </v-btn>
    <v-btn
      :loading="loading"
      color="primary"
      class="mr-4"
      @click="sendNotif('like')"
      >Like</v-btn
    >
    <v-btn
      :loading="loading"
      color="primary"
      class="mr-4"
      @click="sendNotif('follow')"
      >Follow</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    sendNotif(type) {
      this.loading = true
      this.$api
        .post('/notifications/send', {
          type: type,
          user_id: this.user.id
        })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style></style>
