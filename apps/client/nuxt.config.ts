import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import en from './locales/en.json';
import pt from './locales/pt.json';

export default defineNuxtConfig({
  typescript: { shim: false },
  nitro: {
    output: {
      dir: '~~/../../dist/apps/client',
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
      BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000/',
    },
  },
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    layoutTransition: { name: 'fade', mode: 'out-in' },
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
  css: ['~/assets/css/main.css', '~/assets/css/transitions.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    [
      '@pinia/nuxt',
      {
        autoImports: ['acceptHMRUpdate', 'defineStore', 'storeToRefs'],
      },
    ],
    '@vueuse/nuxt',
    [
      '@nuxtjs/i18n-edge',
      {
        vueI18n: {
          legacy: false,
          locale: 'en',
          fallbackLocale: 'en',
          messages: {
            ['en']: en,
            ['pt']: pt,
          },
        },
      },
    ],
    '@nuxt/image-edge',
    'nuxt-icons',
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: './tailwind.config.js',
    viewer: false,
  },
});
