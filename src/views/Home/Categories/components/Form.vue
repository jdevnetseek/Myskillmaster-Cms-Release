<template>
  <div>
    <v-form ref="form" v-if="form" class="category-form">
      <h3 class="pb-5 primary--text">Category Information</h3>

      <IconForm
        :category="category"
        :loading="iconLoading"
        :error-messages="form.$getError('icon')"
        @change="changeIcon"
      />

      <label class="text-field-label">Label</label>
      <v-text-field
        flat
        solo
        class="mt-2"
        v-model="form.label"
        :error-messages="form.$getError('label')"
        :loading="form.$busy"
      />

      <div class="mt-4">
        <v-btn
          color="primary"
          class="mr-4 px-6"
          height="40px"
          width="100%"
          @click="saveCategoryDetails"
          :loading="form.$busy"
          >{{ submitButtonText }}</v-btn
        >
      </div>
    </v-form>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
/* mapMutations, mapState  */
import { mapActions } from 'vuex'
import IconForm from './IconForm'
import Api from '@/services/api'
import Form from '@/utils/form'

export default {
  name: 'CategoryForm',

  emits: ['iconChanged'],

  props: {
    category: {
      required: true,
    },
  },

  components: {
    IconForm,
  },

  data() {
    return {
      form: new Form(this.category),

      snackbar: {
        show: false,
        message: null,
        color: '',
      },

      showCropperModal: false,

      iconLoading: false,
    }
  },

  computed: {
    isEdit() {
      return (
        this.category !== null &&
        this.category !== undefined &&
        this.category.id !== undefined
      )
    },

    submitButtonText() {
      return this.isEdit ? 'Update' : 'Create'
    },
  },

  methods: {
    ...mapActions({
      getCategoryDetails: 'category/getCategoryDetails',
      updateIcon: 'category/updateIcon',
      updateCategory: 'category/updateCategory',
      createCategory: 'category/createCategory',
    }),

    async saveCategoryDetails() {
      this.form.$busy = true
      this.form.$clearErrors()

      if (this.isEdit) {
        this.updateCategoryDetails()
      } else {
        this.create()
      }
    },

    async changeIcon(image) {
      if (this.isEdit) {
        this.iconLoading = true

        let data = new FormData()
        data.append('id', this.category.id)
        data.append('icon', image)

        await this.updateIcon(data)

        this.iconLoading = false
        this.showSnackbar('Icon successfully updated!', 'success')
      } else {
        this.form.icon = image
        this.$emit('iconChanged', image)
      }
    },

    async create() {
      let formData = new FormData()
      formData.append('label', this.form.label)
      formData.append('icon', this.form.icon)

      Api.post('admin/categories', formData)
        .then((response) => {
          // redirect to edit
          this.$router.push({
            name: 'category.details',
            params: { id: response.data.data.id },
          })
        })
        .catch((err) => {
          this.form.$busy = false

          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
        })
    },

    async updateCategoryDetails() {
      this.updateCategory(this.form.$data())
        .then(() => {
          this.form.$busy = false
          this.showSnackbar('Category details successfully updated!', 'success')
        })
        .catch((err) => {
          this.form.$busy = false

          if (err.response.status === 422) {
            this.form.$setErrors(err.response.data.errors)
          }
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

<style lang="scss" scoped>
.category-form {
  width: 400px;

  @media (max-width: 420px) {
    width: 100%;
  }
}
</style>
