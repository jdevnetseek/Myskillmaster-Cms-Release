<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />

      <v-skeleton-loader
        type="chip"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>

      <v-toolbar-title v-else class="headline font-weight-bold">
        Reported Lessons ({{ listMeta.total }})
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-row v-show="showSearch" align="center" style="max-width: 300px">
        <v-text-field
          class="search"
          ref="searchField"
          flat
          hide-details
          solo
          rounded
          clearable
          background-color="grey lighten-3"
          label="Search"
          v-model="filter.search"
          @input="search"
        ></v-text-field>
      </v-row>

      <v-skeleton-loader
        type="actions"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>

      <v-btn class="ml-5" icon @click="showSearchField">
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </v-app-bar>

    <div class="d-flex mt-6">
      <v-select
        hide-details
        flat
        solo
        dense
        label="Category"
        clearable
        multiple
        item-text="label"
        item-value="id"
        v-model="filter.category"
        class="ml-4"
        :items="lessonCategories"
        style="max-width: 300px"
        @change="filterReport"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 1">
            <span>{{ item.label }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="text-grey text-caption align-self-center"
          >
            (+{{ filter.category.length - 1 }})
          </span>
        </template>
      </v-select>

      <v-spacer></v-spacer>

      <v-select
        hide-details
        flat
        solo
        dense
        label="Reasons"
        clearable
        multiple
        item-text="label"
        item-value="id"
        v-model="filter.reason"
        :items="reportCategories"
        style="max-width: 300px"
        @change="filterReport"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 1">
            <span>{{ item.label }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="text-grey text-caption align-self-center"
          >
            (+{{ filter.reason.length - 1 }})
          </span>
        </template>
      </v-select>

      <v-spacer></v-spacer>

      <v-select
        hide-details
        flat
        solo
        dense
        label="Status"
        clearable
        multiple
        item-text="label"
        item-value="value"
        v-model="filter.status"
        :items="[
          { label: 'Pending', value: 'PENDING' },
          { label: 'Resolved', value: 'RESOLVED' },
          { label: 'Ignored', value: 'IGNORED' },
        ]"
        style="max-width: 250px"
        @change="filterReport"
      >
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 1">
            <span>{{ item.label }}</span>
          </v-chip>
          <span
            v-if="index === 1"
            class="text-grey text-caption align-self-center"
          >
            (+{{ filter.status.length - 1 }})
          </span>
        </template>
      </v-select>

      <v-spacer></v-spacer>

      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            flat
            solo
            single-line
            clearable
            dense
            readonly
            v-on="on"
            v-model="reportDateFormatted"
            placeholder="Date"
            :append-icon="icons.calendar"
            @click:clear="clearDateFilter"
            style="max-width: 250px"
          ></v-text-field>
        </template>

        <v-date-picker
          v-model="filter.date_reported"
          no-title
          scrollable
          color="primary"
          :max="currentDate"
          @input="filterReport"
        ></v-date-picker>
      </v-menu>
    </div>

    <report-list :reports="reports" :loading="loading" @loadMore="loadMore" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapActions, mapMutations, mapState } from 'vuex'
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import ReportList from '../components/List'
import dayjs from 'dayjs'
import { mdiCalendar } from '@mdi/js'

export default {
  name: 'ReportedLessons',

  mixins: [ControlsMixin],

  components: {
    AppBarNavIcon,
    ReportList,
  },

  data() {
    return {
      loading: false,
      menu: false,
      reportDateFormatted: '',
      filter: {
        search: '',
        reason: '',
        category: '',
        status: '',
        date_reported: '',
      },
      icons: {
        calendar: mdiCalendar,
      },
      showSearch: false,
    }
  },

  created() {
    this.clearReports()
    this.fetchReports()
    this.fetchReportCategories()
    this.clearLessonCategories()
    this.fetchLessonCategories(1)
  },

  computed: {
    ...mapState({
      reports: (state) => state.report.list,
      listMeta: (state) => state.report.listMeta,
      reportCategories: (state) => state.report.categoriesList,
      lessonCategories: (state) => state.category.list,
    }),

    paginationLength() {
      return (this.listMeta.total / this.listMeta.per_page) | 0
    },

    currentDate() {
      return dayjs(new Date()).format('YYYY-MM-DD')
    },
  },

  methods: {
    ...mapActions({
      getReports: 'report/getReports',
      getReportCategories: 'report/getReportCategories',
      getLessonCategories: 'category/getCategories',
    }),

    ...mapMutations({
      clearReports: 'report/clearReportsList',
      clearLessonCategories: 'category/clearCategoriesList',
    }),

    pageChanged(page) {
      this.fetchReports(page)
    },

    async loadMore() {
      if (this.listMeta.current_page < this.listMeta.last_page) {
        try {
          this.loadMoreIndicator = true
          await this.fetchReports(this.listMeta.current_page + 1)
        } finally {
          this.loadMoreIndicator = false
        }
      }
    },

    async fetchReports(page = 1) {
      let params = { page, reportType: 'lessons' }
      if (this.filter.search) {
        params.searchLesson = this.filter.search
      }
      if (this.filter.reason) {
        params.reason = this.filter.reason
      }
      if (this.filter.category) {
        params.category = this.filter.category
      }
      if (this.filter.status) {
        params.status = this.filter.status
      }
      if (this.filter.date_reported) {
        params.date_reported = this.filter.date_reported
      }

      this.loading = true
      await this.getReports(params)
      this.loading = false
    },

    search: debounce(function () {
      this.clearReports()
      this.fetchReports()
    }, 500),

    showSearchField() {
      this.showSearch = true
    },

    async fetchReportCategories() {
      this.loading = true
      await this.getReportCategories()
      this.loading = false
    },

    async fetchLessonCategories(page = 1) {
      this.loading = true
      await this.getLessonCategories({ page })
      this.loading = false
    },

    clearDateFilter() {
      this.filter.date_reported = ''
      this.filterReport()
    },

    filterReport(filterValue) {
      if (this.filter.date_reported) {
        this.reportDateFormatted = `${dayjs(this.filter.date_reported).format(
          'MMMM DD, YYYY'
        )}`
      }
      this.clearReports()
      this.fetchReports(null, filterValue)
      this.menu = false
    },
  },
}
</script>
