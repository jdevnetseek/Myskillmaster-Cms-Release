<template>
  <div>
    <div v-show="!loading">
      <div class="tab-bar">
        <h2>{{ pageTitle }}</h2>
        <div class="action">
          <v-btn color="primary" :loading="form.$busy" @click="save" large
            >Save</v-btn
          >
        </div>
      </div>
      <content-editor class="my-3" v-model="form.content" />
    </div>
    <v-container v-show="loading" style="height: 400px">
      <v-row class="fill-height" align-content="center" justify="center">
        <v-col class="subtitle-1 text-center" cols="12">
          Loading Content
        </v-col>
        <v-col cols="6">
          <v-progress-linear
            color="primary accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar.show" right :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.show = false">OK</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import ContentEditor from './components/ContentEditor.vue'
import Form from '@/utils/form'
import get from 'lodash/get'

export default {
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
    pageType: {
      type: String,
      required: true,
    },
  },
  components: {
    ContentEditor,
  },
  data() {
    return {
      loading: true,
      form: new Form({
        type: this.pageType,
        content: null,
      }),
      snackbar: {
        show: false,
        message: null,
        color: '',
      },
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const response = await this.$api.get(
          `admin/settings/pages/${this.form.type}`
        )
        this.form.content = get(response, 'data.data.content')
      } finally {
        this.loading = false
      }
    },
    async save() {
      try {
        this.form.$busy = true
        await this.$api
          .post('admin/settings/pages', this.form.$data())
          .then(() => {
            this.showSnackbar('Content successfully updated!', 'success')
          })
      } finally {
        this.form.$busy = false
      }
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
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
}
</style>
