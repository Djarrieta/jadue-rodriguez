import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

/*
 * Info para traducir vuetify
 * https://vuetifyjs.com/en/features/internationalization/#getting-started
 */

 // Translation provided by Vuetify (javascript)
import zhHans from 'vuetify/es5/locale/zh-Hans'

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
});
