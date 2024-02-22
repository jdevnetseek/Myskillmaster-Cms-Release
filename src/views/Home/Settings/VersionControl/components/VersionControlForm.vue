<template>
  <v-card outlined tile>
    <v-card-title>Add Version </v-card-title>
    <v-card-subtitle
      >Note: Make sure that the new version has been released.</v-card-subtitle
    >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submit">
        <v-text-field
          outlined
          required
          label="Version"
          v-model="form.version"
          :error-messages="form.$getError('version')"
          autocomplete="false"
        ></v-text-field>
        <upgrade-guide-selector v-model="form.upgrade_guide" />
        <v-text-field
          outlined
          required
          label="Title"
          v-model="form.title"
          :error-messages="form.$getError('title')"
          autocomplete="false"
        ></v-text-field>
        <v-text-field
          outlined
          required
          label="Message"
          v-model="form.message"
          :error-messages="form.$getError('message')"
          autocomplete="false"
        ></v-text-field>
        <v-text-field
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
import { mapActions } from 'vuex'
import UpgradeGuideSelector from './UpgradeGuideSelector.vue'

export default {
  components: { UpgradeGuideSelector },
  name: 'VersionControlForm',
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
        version: null,
        upgrade_guide: 'default',
        title: null,
        message: null,
        store_url: null,
      }),
    }
  },
  methods: {
    ...mapActions({
      addVersionControl: 'versionControl/addVersionControl',
    }),
    async submit() {
      try {
        this.form.$busy = true
        await this.addVersionControl(this.form.$data())
        this.form.$reset()
      } catch (err) {
        if (err.response.status === 422) {
          this.form.$setErrors(err.response.data.errors)
        }
      } finally {
        this.form.$busy = false
      }
    },
  },
}
</script>
