<template>
  <div class="py-8">
    <v-app-bar flat color="transparent">
      <app-bar-nav-icon />
      <v-toolbar-title class="breadcrumbs d-flex align-center">
        <v-icon class="text-primary">{{ icons.arrowLeft }}</v-icon>
        <router-link
          class="text-decoration--none"
          :to="{ name: 'reported_lessons' }"
          >Reported Lessons</router-link
        >
      </v-toolbar-title>
    </v-app-bar>

    <div class="d-flex my-6 report">
      <report-details :report="report" v-if="report" />
    </div>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mdiChevronLeft } from '@mdi/js'
import { mapActions, mapMutations, mapState } from 'vuex'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import ReportDetails from '../components/Details'

export default {
  name: 'Report',

  components: {
    AppBarNavIcon,
    ReportDetails,
  },

  data() {
    return {
      loading: false,

      icons: {
        arrowLeft: mdiChevronLeft,
      },

      snackbar: {
        show: false,
        message: '',
        color: '',
      },
    }
  },

  created() {
    this.getReport()
  },

  computed: {
    ...mapState({
      report: (state) => state.report.reportDetails,
    }),
  },

  methods: {
    ...mapActions({
      getReportDetails: 'report/getReportDetails',
    }),

    ...mapMutations({
      clearReportDetails: 'report/clearReportDetails',
    }),

    async getReport() {
      this.loading = true

      await this.getReportDetails(this.$route.params.id)

      this.loading = false
    },
  },

  destroyed() {
    this.clearReportDetails()
  },

  watch: {
    $route() {
      this.getReport()
    },
  },
}
</script>

<style scoped>
.report {
  min-width: 450px;
  max-width: 900px;
}
</style>
