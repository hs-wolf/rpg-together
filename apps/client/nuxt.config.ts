import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    output: {
      dir: '../../../../dist/apps/client',
    },
  },
  srcDir: 'src/',
  alias: {
    '@rpg-together/models': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/models/src/index.ts'),
    '@rpg-together/repos': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/repos/src/index.ts'),
    '@rpg-together/utils': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/utils/src/index.ts'),
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Rpg Together',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Rpg Together' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  css: ['~/assets/css/global.css', '~/assets/css/transitions.css'],
  modules: [
    '@nuxtjs/robots',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    'nuxt-icons',
    '@nuxt/image-edge',
    '@nuxtjs/eslint-module',
    '@nuxtjs/algolia',
  ],
  // https://github.com/nuxt-community/robots-module
  robots: {},
  // https://github.com/nuxt-modules/tailwindcss
  tailwindcss: {},
  // https://github.com/vueuse/vueuse
  vueuse: {},
  // https://github.com/vuejs/pinia/tree/v2/packages/nuxt
  pinia: {
    autoImports: ['acceptHMRUpdate', 'defineStore', 'storeToRefs'],
  },
  // https://github.com/nuxt-modules/i18n
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.yaml',
      },
      {
        code: 'pt',
        file: 'pt.yaml',
      },
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    vueI18n: {
      locale: 'en',
      fallbackLocale: 'en',
    },
  },
  // https://github.com/gitFoxCode/nuxt-icons
  nuxtIcons: {},
  // https://github.com/nuxt/image
  image: {},
  // https://github.com/nuxt-community/eslint-module
  eslint: {},
  // https://algolia.nuxtjs.org/getting-started/quick-start
  algolia: {},
});
