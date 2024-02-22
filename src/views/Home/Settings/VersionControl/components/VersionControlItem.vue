<template>
  <v-card outlined tile>
    <v-card-title><b>Version:</b> {{ value.version }}</v-card-title>
    <v-card-text class="pb-0">
      <upgrade-guide-selector
        class="upgrade-guide-selector"
        size="small"
        :disabled="updating || deleting"
        :loading="updating"
        v-model="form.upgrade_guide"
        large
      />
      <v-text-field
        :loading="form.$busy"
        outlined
        required
        label="Title"
        v-model="form.title"
        :error-messages="form.$getError('title')"
        autocomplete="false"
      ></v-text-field>
      <v-text-field
        :loading="form.$busy"
        outlined
        required
        label="Message"
        v-model="form.message"
        :error-messages="form.$getError('message')"
        autocomplete="false"
      ></v-text-field>
      <v-text-field
        :loading="form.$busy"
        outlined
        required
        label="Store Url"
        v-model="form.store_url"
        :error-messages="form.$getError('store_url')"
        autocomplete="false"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="d-flex justify-space-between mt-0 pt-0 px-4 pb-5">
      <v-btn
        :disabled="updating || deleting"
        color="error"
        type="text"
        text
        large
        @click="remove"
        :loading="deleting"
        >Delete</v-btn
      >

      <v-btn
        :disabled="updating || deleting"
        color="primary"
        type="text"
        large
        @click="update"
        :loading="updating"
        >Update</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions } from 'vuex'
import UpgradeGuideSelector from './UpgradeGuideSelector.vue'
import Form from '@/utils/form'

export default {
  components: { UpgradeGuideSelector },
  name: 'VersionControlItem',
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleting: false,
      updating: false,
      form: new Form({
        upgrade_guide: this.value.upgrade_guide,
        store_url: this.value.store_url,
        title: this.value.title,
        message: this.value.message,
      }),
    }
  },
  watch: {
    value(v) {
      this.form.upgrade_guide = v.upgrade_guide
      this.form.store_url = v.store_url
    },
  },
  methods: {
    ...mapActions({
      updateVersionControl: 'versionControl/updateVersionControl',
      removeVersionControl: 'versionControl/removeVersionControl',
    }),
    async remove() {
      try {
        this.deleting = true
        await this.removeVersionControl(this.value)
      } finally {
        this.deleting = false
      }
    },
    async update(val) {
      try {
        this.upgradeGuide = val
        this.updating = true
        await this.updateVersionControl({
          ...this.value,
          ...this.form.$data(),
        })
      } finally {
        this.updating = false
      }
    },
  },
}
</script>
<style scoped>
.upgrade-guide-selector {
  /* width: 185px; */
}
</style>
