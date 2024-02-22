<template>
  <div>
    <Header :loading="loading" :total-categories="total">
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

      <v-skeleton-loader
        type="actions"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>

      <v-btn class="ml-5" icon @click="showSearchField">
        <img src="@/assets/icons/search.svg" alt height="17.7px" />
      </v-btn>
    </Header>

    <div class="ml-4 mt-4">
      <div v-show="!loading">
        <v-btn
          depressed
          color="primary"
          @click="$router.push({ name: 'category.add' })"
        >
          <v-icon small left>{{ icons.plus }}</v-icon>
          <span class="mb-1">Add Category</span>
        </v-btn>
      </div>
    </div>

    <List
      :loading="loading"
      :categories="categories"
      @loadMore="loadMore"
      @deleteCategory="showDeleteConfirmation"
      @sort="sortList"
    />

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>

    <ConfirmModal
      v-model="showConfirmationModal"
      title="Delete Category"
      :message="deleteMessage"
      @cancel="showConfirmationModal = false"
      @confirm="deleteCategory"
    ></ConfirmModal>
  </div>
</template>

<script>
import { mdiPlus } from '@mdi/js'
import debounce from 'lodash/debounce'
import { mapState, mapActions, mapMutations } from 'vuex'
import Header from './components/Header'
import List from './components/List'
import ControlsMixin from '@/utils/mixins/Controls'
import ConfirmModal from '@/components/modals/ConfirmModal'
import Category from '@/models/Category'

import Form from '@/utils/form'

export default {
  name: 'Categories',

  mixins: [ControlsMixin],

  components: {
    Header,
    List,
    ConfirmModal,
  },

  data() {
    return {
      loading: false,

      totalCategories: 0,
      filter: {
        search: '',
      },

      sort: 'label',

      showSearch: false,

      icons: {
        plus: mdiPlus,
      },

      snackbar: {
        show: false,
        message: null,
        color: '',
      },

      showConfirmationModal: false,

      toBeDeletedCategory: {
        id: null,
        label: '',
      },

      showAddFormDialog: false,
      form: new Form({
        label: '',
      }),
    }
  },

  created() {
    this.clearCategories()
    this.fetchCategories(1)
  },

  computed: {
    ...mapState({
      categories: (state) => state.category.list,
      listMeta: (state) => state.category.listMeta,
    }),

    paginationLength() {
      return (this.listMeta.total / this.listMeta.per_page) | 0
    },

    total() {
      return this.listMeta.total ?? 0
    },

    deleteMessage() {
      return (
        'Are you sure you want to delete ' +
        this.toBeDeletedCategory.label +
        '?'
      )
    },
  },

  methods: {
    ...mapActions({
      getCategories: 'category/getCategories',
      createCategory: 'category/createCategory',
    }),

    ...mapMutations({
      clearCategories: 'category/clearCategoriesList',
      updateCategoryDataInList: 'category/updateCategoryDataInList',
    }),

    pageChanged(page) {
      this.fetchCategories(page)
    },

    async loadMore() {
      if (this.listMeta.current_page < this.listMeta.last_page) {
        try {
          this.loadMoreIndicator = true
          await this.fetchCategories(this.listMeta.current_page + 1)
        } finally {
          this.loadMoreIndicator = false
        }
      }
    },

    search: debounce(function () {
      this.clearCategories()
      this.fetchCategories()
    }, 400),

    async fetchCategories(page = 1) {
      let params = { page }

      if (this.filter.search) {
        params.search = this.filter.search
      }

      if (this.sort) {
        params.sort = this.sort
      }

      this.loading = true
      await this.getCategories(params)
      this.loading = false
    },

    sortList({ field, order }) {
      this.sort = order === 'asc' ? field : '-' + field
      this.clearCategories()
      this.fetchCategories()
    },

    async showSearchField() {
      this.showSearch = !this.showSearch
      await this.$nextTick()
      this.$refs.searchField.$refs.input.focus()
    },

    deleteCategory() {
      new Category(this.toBeDeletedCategory)
        .delete()
        .then(() => {
          this.showConfirmationModal = false
          this.clearCategories()
          this.fetchCategories()
          this.showSnackbar('Category successfully deleted', 'success')
          this.resetToBeDeletedCategory()
        })
        .catch((err) => {
          if (err.response.status >= 500) {
            this.showSnackbar('Something went wrong.', 'error')
          }

          if (err.response.status === 400) {
            this.showSnackbar(err.response.data.message, 'error')
          }

          this.showConfirmationModal = false
        })
    },

    showSnackbar(message, color) {
      this.snackbar.message = message
      this.snackbar.show = true
      this.snackbar.color = color
    },

    showDeleteConfirmation(category) {
      this.toBeDeletedCategory = category

      this.showConfirmationModal = true
    },
  },
}
</script>
