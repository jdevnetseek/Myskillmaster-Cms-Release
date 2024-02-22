<template>
  <v-card outlined tile>
    <v-card-title>Default Store Url</v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="setSettings">
        <v-text-field
          :loading="form.$busy"
          outlined
          required
          label="Store Url"
          v-model="form.store_url"
          :error-messages="form.$getError('store_url')"
          autocomplete="false"
        ></v-text-field>
        <v-btn large color="primary" type="submit" :loading="form.$busy"
          >Save</v-btn
        >
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import Form from '@/utils/form'
import get from 'lodash/get'
import { mapActions } from 'vuex'

export default {
  props: {
    platform: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: new Form({
        platform: this.platform,
        store_url: null,
      }),
    }
  },
  mounted() {
    this.getSettings()
  },
  methods: {
    ...mapActions({
      getList: 'versionControl/getList',
    }),
    async getSettings() {
      try {
        this.form.$busy = true
        const response = await this.$api.get(
          'admin/settings/digital-distribution',
          {
            params: { platform: this.platform },
          }
        )
        this.form.store_url = get(response, 'data.data.store_url')
      } finally {
        this.form.$busy = false
      }
    },
    async setSettings() {
      try {
        this.form.$busy = true
        await this.$api.post(
          'admin/settings/digital-distribution',
          this.form.$data()
        )
        this.getList()
      } finally {
        this.form.$busy = false
      }
    },
  },
}
</script>
