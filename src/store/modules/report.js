import Report from '@/models/Report'
import Api from '@/services/api'
import { each, find } from 'lodash'

export default {
  namespaced: true,
  state: {
    list: [],
    listMeta: {
      current_page: 0,
      last_page: 1,
    },
    categoriesList: [],
    reportDetails: null,
  },

  actions: {
    async getReports({ commit }, params) {
      const query = Report.page(params.page || 1)

      if (params.search) {
        query.where('search', params.search)
      }
      if (params.searchLesson) {
        query.where('lesson', params.searchLesson)
      }
      if (params.reportType) {
        query.where('type', params.reportType)
      }
      if (params.reason) {
        query.whereIn('reason', params.reason)
      }
      if (params.category) {
        query.whereIn('category', params.category)
      }
      if (params.status) {
        query.whereIn('status', params.status)
      }
      if (params.date_reported) {
        query.where('date_reported', params.date_reported)
      }

      const res = await query
        .params({ limit: 20 })
        .include('reporter', 'reasons')
        .get()

      commit('setReportsList', res.data)
      commit('setReportsListMeta', res.meta)
    },

    async getReportCategories({ commit }) {
      const { data } = await Api.get(`admin/reports/categories`)
      commit('setReportCategoriesList', data.data)
    },

    async getReportDetails({ commit }, id) {
      const { data } = await Api.get(`admin/reports/${id}`)
      commit('setReportDetails', data.data)
    },

    async updateReportStatus({ commit }, { id, status }) {
      const { data } = await Api.put(`admin/reports/${id}`, {
        status: status,
      })
      commit('setReportDetails', data.data)
    },
  },

  mutations: {
    setReportsList(state, reports) {
      each(reports, (report) => {
        const exist = find(state.list, { id: report.id })
        if (!exist) {
          state.list.push(new Report(report))
        }
      })
    },

    setReportCategoriesList(state, reportCategories) {
      state.categoriesList = reportCategories
    },

    clearReportDetails(state) {
      state.reportDetails = null
    },

    setReportDetails(state, report) {
      if (report instanceof Report) {
        state.reportDetails = report
      } else {
        state.reportDetails = new Report(report)
      }
    },

    clearReportsList(state) {
      state.list = []
    },

    setReportsListMeta(state, meta) {
      state.listMeta = meta
    },
  },
}
