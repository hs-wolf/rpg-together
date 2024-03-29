import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    output: {
      dir: resolve(
        dirname(fileURLToPath(import.meta.url)),
        '../../dist/apps/client/.output',
      ),
    },
  },
  srcDir: 'src/',
  alias: {
    '@rpg-together/models': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/models/src/index.ts'),
    '@rpg-together/repositories': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/repositories/src/index.ts'),
    '@rpg-together/utilities': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/utilities/src/index.ts'),
  },
  runtimeConfig: {
    public: {
      API_URL: 'https://monolith-lmggplptsq-ue.a.run.app/',
      FIREBASE_CONFIG: {
        apiKey: 'AIzaSyAncOxnuvQJLLuwoKIt8FPZIo-8OyjM8wM',
        authDomain: 'rpg-together-44d2e.firebaseapp.com',
        projectId: 'rpg-together-44d2e',
        storageBucket: 'rpg-together-44d2e.appspot.com',
        messagingSenderId: '941581255741',
        appId: '1:941581255741:web:a46b39ad5fd52937b6d654',
        measurementId: 'G-8C6KCG0W5X',
      },
      RECAPTCHA: '6LfkKikpAAAAAH6_gcUUTGypoqygYQCgpO-tmQM4',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'client',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'client' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['~/assets/css/global.css', '~/assets/css/transitions.css'],
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    'nuxt-icons',
    '@nuxtjs/robots',
    '@nuxtjs/algolia',
  ],
  // https://github.com/nuxt-modules/eslint
  eslint: { lintOnStart: false },
  // https://github.com/nuxt-modules/tailwindcss
  tailwindcss: { viewer: false },
  // https://github.com/nuxt-modules/i18n
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.yaml',
      },
      {
        code: 'pt',
        iso: 'pt-BR',
        file: 'pt.yaml',
      },
    ],
    defaultLocale: 'en',
    langDir: 'locales',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    vueI18n: './i18n.config.ts',
  },
  // https://github.com/vueuse/vueuse
  vueuse: {},
  // https://github.com/vuejs/pinia/tree/v2/packages/nuxt
  pinia: {
    autoImports: ['acceptHMRUpdate', 'defineStore', 'storeToRefs'],
  },
  // https://github.com/nuxt/image
  image: {},
  // https://github.com/gitFoxCode/nuxt-icons
  nuxtIcons: {},
  // https://github.com/nuxt-community/robots-module
  robots: {},
  // https://github.com/nuxt-modules/algolia
  algolia: {
    apiKey: 'b1495d3ccb1ceb952551f678b95480e1',
    applicationId: '9T02IX7HGQ',
  },
})
