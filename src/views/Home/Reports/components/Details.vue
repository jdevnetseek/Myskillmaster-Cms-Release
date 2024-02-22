<template>
  <div class="mx-4 col-xs-12 col-md-12 report-details">
    <v-row>
      <v-col cols="8" sm="8" class="pb-0">
        <v-alert dense :type="alertType" :color="alertColor + ' darken-3'">
          This report is marked as <strong> {{ report.status }}</strong
          >.
        </v-alert>
      </v-col>

      <v-col
        cols="8"
        sm="8"
        class="pt-0 pb-8"
        v-if="report.status === 'PENDING'"
      >
        <v-select
          solo
          class="mt-2"
          v-model="report.status"
          label="Select Action"
          :items="actions"
          item-text="label"
          item-value="value"
          @change="onActionSelect"
          :loading="loading"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8" sm="8">
        <v-form ref="form" style="max-width: 600px">
          <v-row>
            <v-col cols="6">
              <label class="text-field-label">Lesson title</label>
              <v-text-field
                :value="report.reportable.title"
                flat
                solo
                hide-details="auto"
                class="mt-2"
                readonly
              />
            </v-col>

            <v-col cols="6">
              <label class="text-field-label">Master</label>
              <v-text-field
                :value="report.reportable.master_profile.full_name"
                flat
                solo
                hide-details="auto"
                class="mt-2"
                readonly
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <label class="text-field-label d-block">Reasons</label>
              <v-chip
                class="ma-1 mt-2"
                color="red darken-3"
                outlined
                v-for="reason in report.reasons"
                :key="reason.id"
              >
                {{ reason.label }}
              </v-chip>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <label class="text-field-label d-block">Report description</label>
              <v-textarea
                no-resize
                solo
                flat
                rows="4"
                class="mt-2"
                :value="report.description"
                readonly
                hide-details
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <label class="text-field-label d-block">Reporter</label>
              <v-text-field
                :value="report.reporter.full_name"
                flat
                solo
                hide-details="auto"
                class="mt-2 p-0"
                readonly
              />
            </v-col>

            <v-col cols="6">
              <label class="text-field-label d-block">Reporter email</label>
              <v-text-field
                :value="report.reporter.email"
                flat
                solo
                hide-details="auto"
                class="mt-2"
                readonly
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4" sm="4">
        <label class="text-field-label d-block">Attachments</label>

        <Attachments
          :files="report.attachments"
          v-if="report.attachments.length > 0"
        />

        <div
          class="d-flex justify-center mt-3"
          v-if="report.attachments.length < 1 && !loading"
        >
          <p>No Attachments.</p>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>

    <ConfirmDialog
      v-model="confirmationModal.show"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      @cancel="confirmationModal.show = false"
      @confirm="updateStatus"
    ></ConfirmDialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Attachments from '../components/Gallery'
import ConfirmDialog from '@/components/modals/ConfirmModal'

export default {
  name: 'ReportInfo',

  props: {
    report: {
      required: true,
      type: Object,
    },
  },

  components: {
    ConfirmDialog,
    Attachments,
  },

  data() {
    return {
      actions: [
        { label: 'Resolve', value: 'RESOLVED' },
        { label: 'Ignore', value: 'IGNORED' },
      ],

      confirmationModal: {
        show: false,
        title: 'Report status update',
        message: '',
      },

      reportNewStatus: null,

      loading: false,

      snackbar: {
        show: false,
        message: null,
        color: '',
      },
    }
  },

  computed: {
    reportStatus: function () {
      return this.report.status.toLowerCase()
    },

    alertType: function () {
      return this.reportStatus === 'resolved'
        ? 'success'
        : this.reportStatus === 'ignored'
        ? 'info'
        : 'warning'
    },

    alertColor: function () {
      return this.reportStatus === 'resolved'
        ? 'green'
        : this.reportStatus === 'ignored'
        ? 'grey'
        : 'red'
    },
  },

  methods: {
    ...mapActions({
      updateReportStatus: 'report/updateReportStatus',
    }),

    onActionSelect(value) {
      this.confirmationModal.message = `Are you sure you want to mark this report as ${value}?`
      this.confirmationModal.show = true
      this.reportNewStatus = value
    },

    resetConfirmationModal() {
      this.confirmationModal.message = ''
      this.confirmationModal.show = false
      this.reportNewStatus = null
    },

    updateStatus() {
      this.loading = true

      this.updateReportStatus({
        id: this.report.id,
        status: this.reportNewStatus,
      })
        .then(() => {
          this.showSnackbar('Report status successfully updated', 'success')
        })
        .catch((err) => {
          if (err.response?.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          } else {
            this.showSnackbar(
              'Something went wrong. Please contact support.',
              'error'
            )
          }
        })
        .finally(() => {
          this.loading = false
          this.resetConfirmationModal()
        })
    },

    showSnackbar(message, color) {
      this.snackbar.message = message
      this.snackbar.show = true
      this.snackbar.color = color
    },
  },
}
</script>

<style scoped>
.report-details {
  min-width: 450px;
  max-width: 900px;
}
</style>
