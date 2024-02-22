<template>
  <div class="py-8">
    <v-app-bar flat color="transparent">
      <app-bar-nav-icon />
      <v-toolbar-title class="breadcrumbs d-flex align-center">
        <v-icon class="text-primary">{{ icons.arrowLeft }}</v-icon>
        <router-link class="text-decoration--none" :to="{ name: 'categories' }"
          >Categories</router-link
        >
      </v-toolbar-title>
    </v-app-bar>

    <div class="ma-4 col-md-4" v-if="form">
      <div class="mb-8">
        <CategoryForm :category="category" />
      </div>
    </div>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
/* , mdiCheck, mdiAlertCircleOutline */
import { mdiChevronLeft } from '@mdi/js'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import CategoryForm from './components/Form'

import Form from '@/utils/form'

export default {
  name: 'CategoryDetails',

  components: {
    AppBarNavIcon,
    CategoryForm,
  },

  data() {
    return {
      icons: {
        arrowLeft: mdiChevronLeft,
      },

      form: null,

      // loading
      loading: false,

      // snackbar
      snackbar: {
        show: false,
        message: null,
        color: '',
      },
    }
  },

  computed: {
    ...mapState({
      category: (state) => state.category.categoryDetails,
    }),

    isEdit() {
      return this.$route.params.id !== undefined
    },

    submitButtonText() {
      return this.isEdit ? 'Update' : 'Create'
    },
  },

  methods: {
    ...mapActions({
      getCategoryDetails: 'category/getCategoryDetails',
      updateIcon: 'category/updateIcon',
    }),

    ...mapMutations({
      clearCategoryDetails: 'category/clearCategoryDetails',
    }),

    async getCategory() {
      this.loading = true

      await this.getCategoryDetails(this.$route.params.id)

      this.form = new Form(this.category)

      this.loading = false
    },
  },

  created() {
    if (this.isEdit) {
      this.getCategory()
    }
  },

  destroyed() {
    this.clearCategoryDetails()
  },

  watch: {
    $route() {
      this.getCategory()
    },
  },
}
</script>

<style lang="scss" scoped>
.category-form {
  width: 400px;

  @media (max-width: 420px) {
    width: 100%;
  }
}
</style>
