<template>
  <div class="version-control">
    <h2 class="py-5">Version Control</h2>
    <v-col cols="7">
      <v-row>
        <v-tabs hide-slider v-model="tab">
          <v-tab v-for="item in platformList" :key="item.platform">
            {{ item.label }}
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="item in platformList" :key="item.platform">
              <div class="py-8">
                <default-store-link-form :platform="item.platform" />
                <v-divider class="my-10" />
                <version-control-form :platform="item.platform" />
                <v-divider v-if="item.list.length > 0" class="my-10" />
                <version-control-item
                  class="version-control-item mt-3 mb-3"
                  v-for="version in item.list"
                  :key="version.id"
                  :value="version"
                />
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-row>
    </v-col>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import VersionControlForm from './components/VersionControlForm'
import VersionControlItem from './components/VersionControlItem'
import DefaultStoreLinkForm from './components/DefaultStoreLinkForm'

export default {
  name: 'VersionControl',
  components: {
    VersionControlForm,
    VersionControlItem,
    DefaultStoreLinkForm,
  },
  data() {
    return {
      tab: 0,
    }
  },
  computed: {
    ...mapGetters('versionControl', ['iosList', 'androidList']),
    platformList(vm) {
      return [
        {
          platform: 'ios',
          label: 'iOS',
          list: vm.iosList,
        },
        {
          platform: 'android',
          label: 'Android',
          list: vm.androidList,
        },
      ]
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions({
      getList: 'versionControl/getList',
    }),
  },
}
</script>
