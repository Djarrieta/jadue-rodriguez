import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
<<<<<<< HEAD

/*
 * Info para traducir vuetify
 * https://vuetifyjs.com/en/features/internationalization/#getting-started
 */

 // Translation provided by Vuetify (javascript)
import es from 'vuetify/es5/locale/es'
=======
import zhHans from 'vuetify/es5/locale/zh-Hans'
import colors from 'vuetify/lib/util/colors'
>>>>>>> feature/crud-usuarios

Vue.use(Vuetify);

Vue.component('my-component', {
  methods: {
    changeLocale () {
      this.$vuetify.lang.current = 'es'
    },
  },
})

export default new Vuetify({
    lang: {
        locales: { es },
            current: 'es',
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

