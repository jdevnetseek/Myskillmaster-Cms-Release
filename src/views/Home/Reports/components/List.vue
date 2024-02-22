<template>
  <div
    class="mx-4"
    id="report-list"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loading"
    infinite-scroll-distance="100"
  >
    <v-simple-table>
      <thead>
        <tr>
          <th width="15%">Lesson</th>
          <th width="15%">Master</th>
          <th width="25%">Reasons</th>
          <th width="10%">Report Status</th>
          <th width="10%">Reported By</th>
          <th width="10%">Date Reported</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="report in reports"
          :key="report.id"
          class="clickable"
          @click="
            $router.push({
              name: 'reported_lessons.details',
              params: { id: report.id },
            })
          "
        >
          <td class="text-capitalize">{{ report.reportable.title }}</td>
          <td class="text-capitalize">
            {{ report.reportable.master_profile.full_name }}
          </td>

          <td>
            <label v-for="(reason, rIndex) in report.reasons" :key="reason.id">
              {{ reason.label }}
              {{ rIndex !== report.reasons.length - 1 ? ',' : '' }}
            </label>
          </td>

          <td class="text-capitalize">
            <v-chip
              class="ma-1"
              :color="getStatusColor(report.status) + ' darken-4'"
              outlined
              small
              label
            >
              {{ report.status.toLowerCase() }}
            </v-chip>
          </td>

          <td class="text-capitalize">
            {{ report.reporter.full_name }}
          </td>

          <td>{{ report.addedDate }}</td>
        </tr>
      </tbody>

      <template v-if="loading">
        <tr v-for="index in 10" :key="index + '-skeleton'">
          <td class="py-3 pl-0" width="50%" v-for="i in 6" :key="i">
            <v-skeleton-loader type="list-item" transition="fade-transition" />
          </td>
        </tr>
      </template>
    </v-simple-table>

    <div
      class="d-flex justify-center mt-3"
      v-if="!(reports.length > 0) && !loading"
    >
      <p>No match found.</p>
    </div>
  </div>
</template>

<script>
import infiniteScroll from 'vue-infinite-scroll'

export default {
  name: 'ReportList',

  directives: {
    infiniteScroll,
  },

  emits: ['loadMore'],

  props: {
    reports: {
      required: true,
      type: Array,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    loadMore() {
      this.$emit('loadMore')
    },

    getDisplayableReasons(report) {
      return report.reasons.slice(0, 2)
    },

    getStatusColor(status) {
      status = status.toLowerCase()
      let color = 'red'

      if (status === 'resolved') {
        color = 'green'
      }
      if (status === 'ignored') {
        color = 'grey'
      }

      return color
    },
  },
}
</script>
