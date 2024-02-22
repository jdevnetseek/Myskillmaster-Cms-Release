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
        >Users ({{ listMeta.total }})</v-toolbar-title
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
          label="Search name, email or phone number"
          v-model="filter.search"
          @input="search"
        ></v-text-field>
      </v-row>

      <v-skeleton-loader
        type="actions"
        transition="fade-transition"
        v-if="loading"
      ></v-skeleton-loader>

      <template v-else>
        <v-select
          class="ml-10"
          hide-details
          dense
          solo
          flat
          item-text="label"
          item-value="value"
          v-model="defaultFilter"
          :items="filterBy"
          style="max-width: 200px"
          @change="filterUser"
        />

        <v-btn
          depressed
          small
          fab
          class="ml-2"
          :color="sortOrder ? 'primary' : ''"
          @click="
            sortOrder = true
            filterUser()
          "
        >
          <v-icon>{{ icons.arrowUp }}</v-icon>
        </v-btn>
        <v-btn
          depressed
          small
          fab
          class="ml-2"
          :color="!sortOrder ? 'primary' : ''"
          @click="
            sortOrder = false
            filterUser()
          "
        >
          <v-icon>{{ icons.arrowDown }}</v-icon>
        </v-btn>

        <v-btn class="ml-5" icon @click="showSearchField">
          <img src="@/assets/icons/search.svg" alt height="17.7px" />
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="#383d3f"
              class="mr-1"
              icon
              @click="exportList"
              v-on="on"
            >
              <v-icon>{{ icons.export }}</v-icon>
            </v-btn>
          </template>
          <span>Export to Excel</span>
        </v-tooltip>
      </template>
    </v-app-bar>

    <div
      class="mt-12 mx-4"
      id="user-list"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th width="20%" colspan="2" class="text-left pa-0">Name</th>
            <th width="20%" class="text-left">Email</th>
            <th width="20%" class="text-left">Status</th>
            <th width="20%" class="text-left">Added date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="clickable"
            @click="
              $router.push({ name: 'user.details', params: { id: user.id } })
            "
          >
            <td colspan="2">
              <user-avatar :avatar="user.avatar" size="40" class="mr-4" />
              {{ user.full_name }}
            </td>
            <td>{{ user.email }}</td>
            <td>
              <p v-if="!user.blocked_at" class="green--text">Active</p>
              <p v-if="user.blocked_at" class="red--text">Blocked</p>
            </td>
            <td>{{ user.addedDate }}</td>
          </tr>

          <template v-if="loading">
            <tr v-for="index in 10" :key="index + '-skeleton'">
              <td class="py-3 pl-0" width="5%">
                <v-skeleton-loader
                  class="avatar-loading--36"
                  type="avatar"
                  transition="fade-transition"
                />
              </td>
              <td class="pl-0" v-for="i in 4" :key="i">
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
        v-if="!(users.length > 0) && !loading"
      >
        <p>No match found.</p>
      </div>
    </div>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" right>
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Ok</v-btn>
    </v-snackbar>
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
  mdiArrowUp,
  mdiArrowDown,
} from '@mdi/js'
import ControlsMixin from '@/utils/mixins/Controls'
import AppBarNavIcon from '@/layouts/shared/AppBarNavIcon'
import UserAvatar from '@/components/UserAvatar'
import infiniteScroll from 'vue-infinite-scroll'
import debounce from 'lodash/debounce'

export default {
  name: 'UsersPage',

  mixins: [ControlsMixin],

  directives: {
    infiniteScroll,
  },

  components: {
    UserAvatar,
    AppBarNavIcon,
  },

  data() {
    return {
      loading: false,
      showSearch: false,
      showProfile: false,
      selectedProfile: null,
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
        arrowUp: mdiArrowUp,
        arrowDown: mdiArrowDown,
      },
      snackbar: {
        show: false,
        message: null,
        color: null,
      },
      defaultFilter: 'first_name',
      sortOrder: true,
      filterBy: [
        {
          value: 'first_name',
          label: 'First Name',
        },
        {
          value: 'last_name',
          label: 'Last Name',
        },
        {
          value: 'email',
          label: 'Email',
        },
        {
          value: 'blocked_at',
          label: 'Status',
        },
        {
          value: 'created_at',
          label: 'Added date',
        },
      ],
    }
  },

  created() {
    this.clearUsers()
    this.fetchUsers(1)
  },

  computed: {
    ...mapState({
      users: (state) => state.user.list,
      listMeta: (state) => state.user.listMeta,
    }),

    paginationLength() {
      return (this.listMeta.total / this.listMeta.per_page) | 0
    },
  },

  methods: {
    ...mapActions({
      getUsers: 'user/getUsers',
      exportToExcel: 'user/exportToExcel',
    }),

    ...mapMutations({
      clearUsers: 'user/clearUserList',
    }),

    pageChanged(page) {
      this.fetchUsers(page)
    },

    filterUser(filterValue) {
      this.clearUsers()
      this.fetchUsers(null, filterValue)
    },

    loadMore() {
      if (this.listMeta.current_page < this.listMeta.last_page) {
        this.fetchUsers(this.listMeta.current_page + 1)
      }
    },

    search: debounce(function () {
      this.clearUsers()
      this.fetchUsers()
    }, 600),

    async fetchUsers(page = 1) {
      if (this.loading) return
      let params = {
        page,
        sort: this.sortOrder
          ? `${this.defaultFilter}`
          : `-${this.defaultFilter}`,
      }
      if (this.filter.search) {
        params.search = this.filter.search
      }
      this.loading = true
      await this.getUsers(params)
      this.loading = false
    },

    showProfileDialog(profile) {
      this.selectedProfile = profile
      this.showProfile = true
    },

    async exportList() {
      this.loading = true
      await this.exportToExcel()
        .then((response) => {
          const url = URL.createObjectURL(
            new Blob([response.data], {
              type: 'application/vnd.ms-excel',
            })
          )
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'users_list.xlsx')
          document.body.appendChild(link)
          link.click()
          this.showSnackbar('File successfully downloaded', 'success')
        })
        .catch(() => {
          this.showSnackbar('Ops! Something went wrong', 'red')
        })
      this.loading = false
    },

    showSnackbar(message, color) {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    },
    async showSearchField() {
      this.showSearch = !this.showSearch
      await this.$nextTick()
      this.$refs.searchField.$refs.input.focus()
    },
  },
}
</script>
