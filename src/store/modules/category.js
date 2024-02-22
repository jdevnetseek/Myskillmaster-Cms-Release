import Category from '@/models/Category'
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
    categoryDetails: null,
  },

  actions: {
    async getCategories({ commit }, params) {
      const query = Category.page(params.page || 1)

      if (params.search) {
        query.where('search', params.search)
      }

      if (params.sort) {
        query.orderBy(params.sort)
      }

      const res = await query.params({ limit: 20 }).get()

      commit('setCategoriesList', res.data)
      commit('setCategoriesListMeta', res.meta)
    },

    async getCategoryDetails({ commit }, id) {
      const { data } = await Api.get(`admin/categories/${id}`)

      commit('setCategoryDetails', data.data)
    },

    async createCategory({ commit }, formData) {
      return new Category(formData).save()
    },

    async updateCategory({ commit }, formData) {
      const { data } = await Api.put(
        `admin/categories/${formData.id}`,
        formData
      )

      commit('setCategoryDetails', data.data)
    },

    async updateIcon({ commit }, formData) {
      formData.append('_method', 'put')

      const { data } = await Api.post(
        `admin/categories/${formData.get('id')}`,
        formData
      )

      commit('setCategoryDetails', data.data)
    },
  },

  mutations: {
    setCategoriesList(state, categories) {
      each(categories, (category) => {
        const exist = find(state.list, { id: category.id })
        if (!exist) {
          state.list.push(new Category(category))
        }
      })
    },

    setCategoryDetails(state, category) {
      if (category instanceof Category) {
        state.categoryDetails = category
      } else {
        state.categoryDetails = new Category(category)
      }
    },

    clearCategoryDetails(state) {
      state.categoryDetails = null
    },

    updateCategoryDataInList(state, { ndx, data }) {
      if (state.list[ndx] !== undefined) {
        state.list[ndx] = data
      }
    },

    clearCategoriesList(state) {
      state.list = []
    },

    setCategoriesListMeta(state, meta) {
      state.listMeta = meta
    },
  },
}
