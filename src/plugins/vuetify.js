import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'

Vue.use(Vuetify)

const iconfont = 'mdiSvg'

const vuetify = new Vuetify({
  icons: {
    iconfont,
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#007675',
        secondary: '#5A489B',
        accent: '#8c9eff',
        error: '#c21e51',
        grey: {
          base: '#9E9E9E',
          lighten3: '#f1f3f4',
        },
      },
    },
  },
})

Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: iconfont,
})

export default vuetify
