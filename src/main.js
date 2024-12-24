import VueFinder from 'vuefinder'
import en from 'vuefinder/dist/locales/en'
import 'vuefinder/dist/style.css'

import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(VueFinder, {
  i18n: {
    en,
    ar: async () => await import('vuefinder/dist/locales/ar'),
    fr: async () => await import('vuefinder/dist/locales/fr'),
    de: async () => await import('vuefinder/dist/locales/de'),
    fa: async () => await import('vuefinder/dist/locales/fa'),
    he: async () => await import('vuefinder/dist/locales/he'),
    hi: async () => await import('vuefinder/dist/locales/hi'),
    ru: async () => await import('vuefinder/dist/locales/ru'),
    sv: async () => await import('vuefinder/dist/locales/sv'),
    tr: async () => await import('vuefinder/dist/locales/tr'),
    zhCN: async () => await import('vuefinder/dist/locales/zhCN'),
    zhTW: async () => await import('vuefinder/dist/locales/zhTW'),
  },
})
app.mount('#app')
