import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import zhHans from 'vuetify/es5/locale/zh-Hans'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

Vue.component('my-component', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'sv'
    },
  },
})

export default new Vuetify({
    lang: {
        locales: { zhHans },
            current: 'zhHans',
        },
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken1, // #E53935
          secondary: colors.blue.lighten4, // #FFCDD2
          accent: colors.indigo.base, // #3F51B5
        },
      },
    },
});

