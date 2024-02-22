<template>
  <div>
    <v-app-bar flat color="transparent" class="main-appbar">
      <app-bar-nav-icon />

      <v-skeleton-loader
        type="chip"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>
      <v-toolbar-title v-else class="headline font-weight-bold"
        >Reports ({{ listMeta.total }})</v-toolbar-title
      >

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
          label="Search name"
          v-model="filter.search"
          @input="search"
        ></v-text-field>
      </v-row>

      <v-btn class="ml-5" icon @click="showSearchField">
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </v-app-bar>

    <div
      class="mt-12 mx-4 pb-10"
      id="report-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
    >
      <v-card
        v-for="report in reports"
        :key="report.id"
        max-width="620"
        class="mx-auto my-10 py-4 px-4"
      >
        <div class="px-4 py-5 pb-0">
          <v-card elevation="0" style="background: #e9e9ed">
            <user-card-content
              v-if="report.report_type === 'users'"
              :report="report"
            />
            <post-card-content
              v-else-if="report.report_type === 'posts'"
              :report="report"
            />
            <product-card-content
              v-else-if="report.report_type === 'products'"
              :report="report"
            />
            <job-card-content
              v-else-if="report.report_type === 'jobs'"
              :report="report"
            />
            <template v-else>
              <v-card-text class="display-1">
                Unable to render unsupported content type:
                {{ report.report_type }}
              </v-card-text>
            </template>
          </v-card>
        </div>
        <v-card-text>
          <p class="mb-0">Content Type</p>
          <div class="body-1 text--primary">
            {{ startCase(report.report_type) }}
          </div>
          <p class="mt-2 mb-0">Report Description</p>
          <div class="body-1 text--primary">
            {{ report.description }}
          </div>
          <p class="mt-2 mb-0">Reason</p>
          <div class="body-1 text--primary">
            {{ report.reason.label }}
          </div>
          <template v-if="report.attachments.length > 0">
            <p class="mt-2 mb-0">Attachments</p>
            <v-row>
              <v-col
                v-for="photo in report.attachments"
                :key="photo.id"
                class="d-flex child-flex"
                cols="4"
              >
                <v-img
                  :src="photo.thumb_url"
                  :lazy-src="photo.thumb_url"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
              </v-col>
            </v-row>
          </template>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Reported By</v-card-title>
        <v-card-text class="d-flex">
          <v-avatar class="m-2">
            <img
              :src="get(report, 'reporter.avatar_permanent_url')"
              :alt="get(report, 'reporter.full_name')"
            />
          </v-avatar>
          <div class="ml-3">
            <label class="d-block">{{
              get(report, 'reporter.full_name')
            }}</label>
            <label class="d-block">{{ report.addedDate }}</label>
          </div>
        </v-card-text>
      </v-card>
      <v-progress-linear
        indeterminate
        v-if="loadMoreIndicator"
        class="mx-auto my-10 load-more-indicator"
        color="grey"
      ></v-progress-linear>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  mdiDotsVertical,
  mdiUnfoldMoreHorizontal,
  mdiMagnify,
  mdiAccountCircleOutline,
  mdiChevronRight,
  mdiFileExcel,
} from '@mdi/js'
import infiniteScroll from 'vue-infinite-scroll'
import debounce from 'lodash/debounce'
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import startCase from 'lodash/startCase'
import UserCardContent from './UserCardContent.vue'
import PostCardContent from './PostCardContent.vue'
import ProductCardContent from './ProductCardContent.vue'
import JobCardContent from './JobCardContent.vue'
import get from 'lodash/get'

export default {
  name: 'ReportsPage',

  mixins: [ControlsMixin],

  directives: {
    infiniteScroll,
  },

  components: {
    AppBarNavIcon,
    UserCardContent,
    PostCardContent,
    ProductCardContent,
    JobCardContent,
  },

  data() {
    return {
      loadMoreIndicator: false,
      loading: false,
      showSearch: false,
      filter: {
        search: '',
      },
      icons: {
        settings: mdiDotsVertical,
        sort: mdiUnfoldMoreHorizontal,
        search: mdiMagnify,
        view: mdiAccountCircleOutline,
        arrow: mdiChevronRight,
        export: mdiFileExcel,
      },
    }
  },

  created() {
    this.clearReport()
    this.fetchReports(1)
  },

  computed: {
    ...mapState({
      reports: (state) => state.report.list,
      listMeta: (state) => state.report.listMeta,
    }),

    paginationLength() {
      return (this.listMeta.total / this.listMeta.per_page) | 0
    },
  },

  methods: {
    get,
    ...mapActions({
      getReports: 'report/getReports',
    }),
    startCase,
    ...mapMutations({
      clearReport: 'report/clearReportsList',
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

    search: debounce(function () {
      this.clearReport()
      this.fetchReports()
    }, 600),

    async fetchReports(page = 1) {
      let params = { page }
      if (this.filter.search) {
        params.search = this.filter.search
      }
      this.loading = true
      await this.getReports(params)
      this.loading = false
    },
    async showSearchField() {
      this.showSearch = !this.showSearch
      await this.$nextTick()
      this.$refs.searchField.$refs.input.focus()
    },
  },
}
</script>
<style scoped>
.load-more-indicator {
  max-width: 620px;
}
</style>
