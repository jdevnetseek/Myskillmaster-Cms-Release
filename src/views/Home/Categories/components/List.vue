<template>
  <div
    class="mt-2 mx-4"
    id="category-list"
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="loading"
    infinite-scroll-distance="100"
  >
    <v-simple-table>
      <thead>
        <tr>
          <th
            width="40%"
            colspan="1"
            class="text-left pa-0 clickable pl-4"
            @click="sortList"
          >
            Name
            <v-icon>{{ sortIcon }}</v-icon>
          </th>
          <th width="40%" class="text-left">Added Date</th>
          <th width="20%" class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="clickable"
          @click="
            $router.push({
              name: 'category.details',
              params: { id: category.id },
            })
          "
        >
          <td class="text-left text-capitalize">
            <v-avatar size="40" class="mr-4">
              <img :src="category.icon_url" alt="category-icon" />
            </v-avatar>
            {{ category.label }}
          </td>

          <td>{{ category.addedDate }}</td>

          <td>
            <div style="z-index: 99">
              <v-btn
                color="error"
                small
                fab
                elevation="0"
                @click.stop="$emit('deleteCategory', category)"
                ><v-icon small>{{ icons.delete }}</v-icon></v-btn
              >
            </div>
          </td>
        </tr>

        <template v-if="loading">
          <tr v-for="index in 10" :key="index + '-skeleton'">
            <td class="py-3 pl-0" width="50%">
              <v-skeleton-loader
                type="list-item"
                transition="fade-transition"
              />
            </td>
            <td class="py-3 pl-0" width="50%">
              <v-skeleton-loader
                type="list-item"
                transition="fade-transition"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </v-simple-table>

    <div
      class="d-flex justify-center mt-3"
      v-if="!(categories.length > 0) && !loading"
    >
      <p>No match found.</p>
    </div>
  </div>
</template>

<script>
import { mdiMenuDown, mdiMenuUp, mdiTrashCan } from '@mdi/js'
import { mapActions } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import Form from '@/utils/form'

export default {
  name: 'List',

  directives: {
    infiniteScroll,
  },

  emits: ['loadMore', 'categoryUpdated', 'deleteCategory', 'sort'],

  props: {
    categories: {
      type: Array,
      required: true,
    },

    loading: {
      default: false,
      type: Boolean,
    },
  },

  data() {
    return {
      form: new Form({
        id: null,
        label: '',
      }),

      icons: {
        caretUp: mdiMenuUp,
        caretDown: mdiMenuDown,
        delete: mdiTrashCan,
      },

      sort: {
        field: 'label',
        order: 'asc',
      },
    }
  },

  computed: {
    sortIcon() {
      return this.sort.order === 'asc'
        ? this.icons.caretUp
        : this.icons.caretDown
    },
  },

  methods: {
    ...mapActions({
      updateCategoryDetails: 'category/updateCategory',
    }),

    sortList() {
      this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc'

      this.$emit('sort', this.sort)
    },

    loadMore() {
      this.$emit('loadMore')
    },
  },
}
</script>
