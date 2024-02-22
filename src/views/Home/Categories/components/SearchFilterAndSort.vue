<template>
  <div>
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

    <!-- Filter here -->
    <v-btn class="ml-5" icon @click="showSearchField">
      <img src="@/assets/icons/search.svg" alt height="17.7px" />
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SearchAndSort',

  props: {
    loading: {
      type: Boolean,
    },
  },

  emits: ['search'],

  data() {
    return {
      showSearch: false,
      filter: {
        search: '',
      },
    }
  },

  methods: {
    search() {
      this.$emit('search', this.filter)
    },

    async showSearchField() {
      this.showSearch = !this.showSearch
      await this.$nextTick()
      this.$refs.searchField.$refs.input.focus()
    },
  },
}
</script>
