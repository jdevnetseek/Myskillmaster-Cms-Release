import { mapState, mapMutations } from 'vuex'

export default {
  data() {
    return {
      controls: {
        drawer: true,
      },
    }
  },

  computed: {
    ...mapState({
      showDrawer: (state) => state.controls.showDrawer,
    }),
  },

  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer',
    }),
  },

  created() {
    this.controls.drawer = this.showDrawer
  },

  watch: {
    showDrawer(val) {
      this.controls.drawer = val
    },
    'controls.drawer'(val) {
      this.toggleDrawer(val)
    },
  },
}
