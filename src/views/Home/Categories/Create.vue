<template>
  <div class="py-8">
    <BreadCrumbs>
      <v-icon class="text-primary">{{ leftIcon }}</v-icon>
      Create
    </BreadCrumbs>

    <div class="ma-4 col-md-4">
      <div class="my-8">
        <CategoryForm :category="category" @iconChanged="setIcon" />
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from './components/BreadCrumbs'
import CategoryForm from './components/Form'
import { mdiChevronLeft } from '@mdi/js'
import Category from '@/models/Category'

export default {
  name: 'CreateCategory',

  components: {
    BreadCrumbs,
    CategoryForm,
  },

  data() {
    return {
      leftIcon: mdiChevronLeft,
      category: new Category({
        label: '',
        icon: null,
      }),
    }
  },

  methods: {
    setIcon(image) {
      this.category.icon = image
    },
  },
}
</script>
